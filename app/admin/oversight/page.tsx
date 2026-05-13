"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Footer from "@/components/layout/Footer";
import { getIncidents, updateIncident, API_BASE } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { KASOA_TOWNS } from "@/lib/data";

export default function IncidentOversightPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRegion, setFilterRegion] = useState("");

  const fetchAll = async () => {
    try {
      const data = await getIncidents({ 
        limit: 200, 
        status: filterStatus || undefined,
        region: filterRegion || undefined
      });
      setIncidents(data.incidents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "superadmin")) {
      router.push("/");
      return;
    }
    if (user) fetchAll();
  }, [user, authLoading, filterStatus, filterRegion]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY DELETE this incident? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("cerp_token");
      await fetch(`${API_BASE}/incidents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusReset = async (id: string) => {
    try {
      await updateIncident(id, { status: "new", assigned_agency: undefined });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="pl-64">
        <Navbar />
        <AdminSidebar />
        <div className="pt-32 px-10 text-center">Synchronizing incident directory...</div>
      </main>
    );
  }

  return (
    <main className="pl-64 min-h-screen bg-bg text-white">
      <Navbar />
      <AdminSidebar />

      <div className="pt-32 px-10 max-w-6xl mx-auto pb-24">
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2">Total Oversight</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "Syne" }}>Incident Archive</h1>
            <p className="text-white/40 text-sm mt-2">Filter, override, and manage every community issue reported on the platform.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest outline-none focus:border-red-500 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select 
              value={filterRegion} 
              onChange={(e) => setFilterRegion(e.target.value)}
              className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest outline-none focus:border-red-500 transition-all"
            >
              <option value="">All Regions</option>
              {KASOA_TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {incidents.length === 0 ? (
            <div className="p-20 text-center opacity-30 italic bg-surface rounded-3xl border border-white/5">No incidents found matching these filters.</div>
          ) : incidents.map((inc) => (
            <div key={inc.id} className="bg-surface border border-white/5 p-6 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-white/10 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`badge badge-${inc.status} text-[9px]`}>{inc.status}</span>
                  <span className="text-[10px] opacity-40 font-mono">ID: {inc.id.slice(0,8).toUpperCase()}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">{inc.description}</h3>
                <p className="text-xs text-white/40">
                  {inc.region} · {inc.location_text} · Reported on {new Date(inc.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleStatusReset(inc.id)}
                  className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all"
                >
                  🔄 Reset Status
                </button>
                <button 
                  onClick={() => handleDelete(inc.id)}
                  className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red/60 hover:text-red hover:bg-red/10 transition-all border border-red/10"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
