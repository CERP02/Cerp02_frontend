"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function AuditTrailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "superadmin")) {
      router.push("/");
      return;
    }

    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("cerp_token");
        const res = await fetch(`${API_BASE}/superadmin/audit?limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setLogs(data.logs);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchLogs();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <main className="pl-64">
        <Navbar />
        <AdminSidebar />
        <div className="pt-32 px-10 text-center">Loading audit trail...</div>
      </main>
    );
  }

  return (
    <main className="pl-64 min-h-screen bg-bg text-white">
      <Navbar />
      <AdminSidebar />

      <div className="pt-32 px-10 max-w-6xl mx-auto pb-24">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2">Security & Compliance</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "Syne" }}>Audit Trail</h1>
            <p className="text-white/40 text-sm mt-2">Comprehensive history of administrative actions on the CIRP platform.</p>
          </div>
        </header>

        <div className="bg-surface border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Timestamp</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Administrator</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Action Performed</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-right">Resource</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center opacity-30 italic">No activity logs recorded yet.</td></tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/2 transition-colors group">
                    <td className="p-6 text-xs opacity-60 font-mono">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-sm tracking-tight">{log.admin_name}</div>
                      <div className="text-[10px] opacity-40 font-mono">{log.admin_email}</div>
                    </td>
                    <td className="p-6">
                      <div className="text-sm">{log.action}</div>
                    </td>
                    <td className="p-6 text-right">
                      <span className="bg-white/5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider opacity-60">
                        {log.target_type || "SYSTEM"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
