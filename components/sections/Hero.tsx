"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * useCountUp: Animates numeric values from 0 to target.
 */
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, start]);
  return value;
}

/**
 * Hero: Impactful landing section with animated metrics.
 */
export default function Hero() {
  const { user } = useAuth();
  const [counting, setCounting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCounting(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { val: useCountUp(63, 1800, counting), label: "Active Issues", color: "var(--red)" },
    { val: useCountUp(10, 1400, counting), label: "Towns Covered", color: "var(--blue)" },
    { val: useCountUp(7, 1600, counting), label: "Partner Agencies", color: "var(--orange)" },
  ];

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden px-10 pt-28 pb-20">
      {/* Background Decorative Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(var(--red) 1px, transparent 1px), linear-gradient(90deg, var(--red) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(255,59,59,0.1) 0%, transparent 70%)" }} />

      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest mb-8 border border-red-500/30 bg-red-500/10 text-red-400">
          <span className="pulse-dot w-2 h-2 rounded-full bg-red-500" />
          Live Community Issue Tracker
        </div>

        <h1 className="font-extrabold leading-[0.95] mb-6 tracking-tight" style={{ fontFamily: "Syne", fontSize: "clamp(48px, 8vw, 90px)" }}>
          Your <span className="text-red-500 italic">community</span><br />your voice
        </h1>

        <p className="text-lg md:text-xl opacity-70 mb-10 max-w-xl leading-relaxed">
          StreetPulse connects Kasoa residents directly to utility agencies. Report traffic, burst pipes, and infrastructure faults across all 10 Kasoa towns.
        </p>

        <div className="flex gap-4 flex-wrap">
          <a href="/report" className="btn-primary px-8 py-4 text-lg">Report an Issue</a>
          {user && (user.role === "admin" || user.role === "superadmin" || user.role === "responder") && (
            <a href="/dashboard" className="btn-ghost px-8 py-4 text-lg">View Dashboard</a>
          )}
        </div>
      </div>

      {/* Animated Metric Cards (Visible on LG+) */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4">
        {stats.map(({ val, label, color }) => (
          <div key={label} className="rounded-2xl p-6 min-w-[200px] border border-white/5 bg-surface backdrop-blur-sm">
            <div className="text-4xl font-extrabold mb-1" style={{ fontFamily: "Syne", color }}>{val}</div>
            <div className="text-[10px] font-bold tracking-widest uppercase opacity-50">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
