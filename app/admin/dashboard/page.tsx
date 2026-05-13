"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function SuperadminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "admin" && user.role !== "superadmin"))) {
      router.push("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("cerp_token");
        const res = await fetch(`${API_BASE}/superadmin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <main className="pl-64">
        <Navbar />
        <AdminSidebar />
        <div className="pt-32 px-10 text-center">Loading dashboard metrics...</div>
      </main>
    );
  }

  return (
    <main className="pl-64 min-h-screen bg-bg">
      <Navbar />
      <AdminSidebar />

      <div className="pt-32 px-10 max-w-6xl mx-auto pb-24">
        <header className="mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-red mb-2">
            Superadmin Overview
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Platform Health
          </h1>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Incidents", value: stats.incidents.total, color: "var(--text-primary)", icon: "🚨" },
            { label: "Pending", value: stats.incidents.pending, color: "var(--orange)", icon: "⏳" },
            { label: "Resolved", value: stats.incidents.resolved, color: "var(--green)", icon: "✅" },
            { label: "Total Users", value: Object.values(stats.users).reduce((a: any, b: any) => a + b, 0), color: "var(--blue)", icon: "👥" },
          ].map((s) => (
            <div key={s.label} className="p-6 rounded-2xl bg-surface border border-border shadow-sm">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Distribution */}
          <div className="lg:col-span-1 p-8 rounded-3xl bg-surface border border-border shadow-md">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Syne, sans-serif" }}>User Roles</h2>
            <div className="flex flex-col gap-4">
              {Object.entries(stats.users).map(([role, count]: [any, any]) => (
                <div key={role} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${role === 'superadmin' ? 'bg-red' : role === 'admin' ? 'bg-orange' : 'bg-blue'}`} />
                    <span className="text-sm font-semibold capitalize">{role}s</span>
                  </div>
                  <span className="text-sm font-mono bg-surface2 px-2 py-1 rounded-lg">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-surface border border-border shadow-md">
            <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "Syne, sans-serif" }}>Recent Incidents</h2>
            <div className="flex flex-col gap-0">
              {stats.recentActivity.map((act: any) => (
                <div key={act.id} className="py-4 border-b border-border last:border-0 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold mb-0.5">{act.description}</p>
                    <p className="text-[10px] text-muted uppercase tracking-wider">
                      Reported by {act.reporter_name || 'Anonymous'} · {new Date(act.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge badge-${act.status} text-[10px]`}>{act.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
