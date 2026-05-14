"use client";

import { useState } from "react";

/**
 * AlertSystem: Manages multi-channel community notifications.
 */
export default function AlertSystem() {
  const [sent, setSent] = useState(false);

  const channels = [
    { emoji: "📱", name: "SMS Broadcast", desc: "Reaches all subscribers in Kasoa area" },
    { emoji: "🔔", name: "Push Notification", desc: "Instant alerts to StreetPulse mobile app users" },
    { emoji: "🌐", name: "Web Banner", desc: "Prominent banner shown on the portal" },
  ];

  return (
    <section id="alerts" className="py-24 px-10 max-w-6xl mx-auto">
      <p className="section-label">Notification System</p>
      <h2 className="section-title mb-10">Reach everyone, everywhere</h2>

      <div className="rounded-3xl p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-surface border border-white/5">
        
        {/* Delivery Channels */}
        <div>
          <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "Syne" }}>Delivery Channels</h3>
          <div className="space-y-3">
            {channels.map((ch) => (
              <div key={ch.name} className="flex items-center gap-4 bg-surface2 border border-white/5 rounded-2xl px-5 py-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-red-500/10 text-red-500">{ch.emoji}</div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{ch.name}</div>
                  <div className="text-[11px] opacity-40">{ch.desc}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_var(--green)]" />
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preview */}
        <div className="bg-bg/50 p-8 rounded-3xl border border-white/5">
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Syne" }}>Live Preview</h3>
          <p className="text-sm opacity-50 mb-6 leading-relaxed">Notifications target specific Kasoa towns or custom radii in seconds.</p>

          <div className="bg-surface border border-white/10 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="pulse-dot w-2 h-2 rounded-full bg-red-500" />
              <strong className="text-[10px] font-bold uppercase tracking-widest text-red-500">⚠ Community Notice</strong>
            </div>
            <p className="text-sm leading-relaxed mb-3 opacity-80">
              Burst water pipe on <strong className="text-white">Kasoa-Winneba Road</strong>. GWCL assigned and en route. Avoid the stretch.
            </p>
            <p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Kasoa Command Center · 3km Radius · 5m ago</p>
          </div>

          <div className="flex gap-3">
            <button 
              className="btn-primary flex-1 py-3" 
              onClick={() => { setSent(true); setTimeout(() => setSent(false), 3000); }}
            >
              {sent ? "✅ Sent!" : "Broadcast Notice"}
            </button>
            <button className="btn-ghost px-6">Settings</button>
          </div>
        </div>
      </div>
    </section>
  );
}
