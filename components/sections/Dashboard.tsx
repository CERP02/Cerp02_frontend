"use client";

import { useState, useEffect } from "react";
import { KASOA_TOWNS } from "@/lib/data";
import type { IncidentType } from "@/lib/types";
import { getIncidents } from "@/lib/api";
import type { Incident } from "@/lib/api";

const TYPE_COLOR: Record<IncidentType, string> = {
  flood: "var(--blue)",
  fire: "var(--red)",
  accident: "var(--orange)",
};

const STATUS_CLASS: Record<string, string> = {
  new: "badge badge-new",
  dispatched: "badge badge-dispatched",
  resolved: "badge badge-resolved",
};

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<IncidentType | "all">("all");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real incidents from the backend on load
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getIncidents({ limit: 100 });
        setIncidents(data.incidents);
      } catch {
        console.error("Failed to fetch incidents");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const tabs: { label: string; value: IncidentType | "all" }[] = [
    { label: "All", value: "all" },
    { label: "🌊 Flood", value: "flood" },
    { label: "🔥 Fire", value: "fire" },
    { label: "🚗 Accident", value: "accident" },
  ];

  const filtered =
    activeFilter === "all"
      ? incidents
      : incidents.filter((i) => i.type === activeFilter);

  return (
    <section id="dashboard" className="py-24 px-10 max-w-6xl mx-auto">
      <p className="section-label">Command Center</p>
      <h2 className="section-title">Community Incident Dashboard</h2>
      <p className="section-sub">
        Real-time visibility across all active emergencies in the Kasoa community.
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="px-7 py-6 flex items-center justify-between flex-wrap gap-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h3 className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            🗺 Live Kasoa Incidents
          </h3>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--bg)" }}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className="px-3.5 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200"
                style={{
                  background: activeFilter === tab.value ? "var(--surface)" : "transparent",
                  color: activeFilter === tab.value ? "var(--text-primary)" : "var(--text-muted)",
                  border: "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <select className="form-input text-sm" style={{ width: "auto", minWidth: "160px" }}>
            <option>All Kasoa Towns</option>
            {KASOA_TOWNS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Incident feed — full width since map needs real GPS integration */}
        <div style={{ minHeight: "400px" }}>
          {loading ? (
            <div className="p-10 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Loading incidents…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center" style={{ color: "var(--text-muted)" }}>
              <div className="text-4xl mb-3">✅</div>
              <p className="text-sm">No incidents reported yet.</p>
            </div>
          ) : (
            filtered.map((inc) => (
              <div
                key={inc.id}
                className="px-7 py-4 flex items-start gap-3 transition-colors duration-150"
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = "transparent")
                }
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    background: TYPE_COLOR[inc.type as IncidentType],
                    boxShadow: `0 0 6px ${TYPE_COLOR[inc.type as IncidentType]}`,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-0.5 truncate">{inc.description}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {inc.region} · {inc.location_text} · {new Date(inc.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <span className={STATUS_CLASS[inc.status]}>{inc.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}