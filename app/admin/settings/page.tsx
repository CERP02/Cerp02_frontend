"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/lib/api";

export default function PlatformSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "superadmin")) {
      router.push("/");
      return;
    }

    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("cerp_token");
        const res = await fetch(`${API_BASE}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSettings(data.settings);
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSettings();
  }, [user, authLoading, router]);

  const handleUpdate = async (key: string, value: string) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("cerp_token");
      const res = await fetch(`${API_BASE}/settings`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      });
      if (res.ok) {
        setMessage(`Setting "${key}" updated successfully`);
        // Update local state
        setSettings(settings.map(s => s.key === key ? { ...s, value } : s));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="pl-64">
        <Navbar />
        <AdminSidebar />
        <div className="pt-32 px-10 text-center">Loading platform configuration...</div>
      </main>
    );
  }

  return (
    <main className="pl-64 min-h-screen bg-bg text-white">
      <Navbar />
      <AdminSidebar />

      <div className="pt-32 px-10 max-w-4xl mx-auto pb-24">
        <header className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2">Platform Control</p>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "Syne" }}>Settings</h1>
          <p className="text-white/40 text-sm mt-2">Manage branding, notifications, and platform-wide parameters.</p>
        </header>

        {message && (
          <div className="bg-green/10 border border-green/30 p-4 rounded-2xl mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green shadow-[0_0_8px_var(--green)]" />
            <span className="text-xs font-bold uppercase tracking-widest text-green">{message}</span>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {settings.map((s) => (
            <div key={s.key} className="bg-surface border border-white/5 p-8 rounded-3xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 capitalize" style={{ fontFamily: "Syne" }}>{s.key.replace(/_/g, " ")}</h3>
                  <p className="text-xs text-white/40 mb-4">{s.description}</p>
                  <input 
                    type="text" 
                    defaultValue={s.value}
                    onBlur={(e) => {
                      if (e.target.value !== s.value) {
                        handleUpdate(s.key, e.target.value);
                      }
                    }}
                    className="w-full bg-surface2 border border-white/10 rounded-xl px-5 py-3 text-sm focus:border-red-500 outline-none transition-all"
                  />
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  {saving && <div className="text-[10px] uppercase font-bold tracking-widest opacity-40 animate-pulse">Saving...</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-red/5 border border-red/10">
          <h3 className="text-sm font-bold text-red mb-2 uppercase tracking-widest">Danger Zone</h3>
          <p className="text-xs text-white/40 mb-6">These settings affect the core functionality of the platform. Change them with caution.</p>
          <button className="btn-ghost px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red/60 hover:text-red hover:bg-red/10 transition-all border-red/20">
            Reset All Settings to Default
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
