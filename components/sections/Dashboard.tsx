"use client";

// Import React hooks for managing state
import { useState } from "react";
// Import mock incident data and Kasoa towns list from the data file
import { MOCK_INCIDENTS, KASOA_TOWNS } from "@/lib/data";
// Import the IncidentType TypeScript type for type-safe filtering
import type { IncidentType } from "@/lib/types";

// TYPE_COLOR maps each incident type to its display color
const TYPE_COLOR: Record<IncidentType, string> = {
  // Flood incidents are shown in blue
  flood: "var(--blue)",
  // Fire incidents are shown in red
  fire: "var(--red)",
  // Road accident incidents are shown in orange
  accident: "var(--orange)",
};

// STATUS_CLASS maps each incident status to the corresponding CSS badge class
const STATUS_CLASS: Record<string, string> = {
  // New incidents get a red badge
  new: "badge badge-new",
  // Dispatched incidents get an orange badge
  dispatched: "badge badge-dispatched",
  // Resolved incidents get a green badge
  resolved: "badge badge-resolved",
};

// MAP_MARKERS defines the positions and types of fake incident markers on the map
// In production these coordinates come from the real incidents in the database
const MAP_MARKERS = [
  // Critical fire in Kasoa Central — shows a pulsing ring to indicate urgency
  { type: "fire" as IncidentType, top: "30%", left: "40%", ping: true },
  // Secondary fire in Lamptey Mills
  { type: "fire" as IncidentType, top: "35%", left: "36%", ping: false },
  // Major flood in Millennium City — shows a pulsing ring
  { type: "flood" as IncidentType, top: "52%", left: "58%", ping: true },
  // Secondary flood in Opeikuma
  { type: "flood" as IncidentType, top: "60%", left: "52%", ping: false },
  // Third flood marker in Akweley
  { type: "flood" as IncidentType, top: "45%", left: "63%", ping: false },
  // Road accident at Kasoa-Winneba junction
  { type: "accident" as IncidentType, top: "42%", left: "46%", ping: false },
  // Road accident in Bawjiase
  { type: "accident" as IncidentType, top: "68%", left: "33%", ping: false },
  // Road accident in Nyanyano
  { type: "accident" as IncidentType, top: "22%", left: "66%", ping: false },
];

// Dashboard renders the live incident map and the scrollable incident feed panel
// It is shown on both the home page and the dedicated /dashboard page
export default function Dashboard() {
  // activeFilter controls which incident type is shown on the map and in the list
  // "all" means no filter is applied — all incident types are visible
  const [activeFilter, setActiveFilter] = useState<IncidentType | "all">("all");

  // tabs defines the filter tab buttons displayed above the map
  const tabs: { label: string; value: IncidentType | "all" }[] = [
    // All tab shows every incident type
    { label: "All", value: "all" },
    // Flood tab filters to flood incidents only
    { label: "🌊 Flood", value: "flood" },
    // Fire tab filters to fire incidents only
    { label: "🔥 Fire", value: "fire" },
    // Accident tab filters to road accident incidents only
    { label: "🚗 Accident", value: "accident" },
  ];

  // filtered is the subset of incidents matching the active filter
  const filtered =
    activeFilter === "all"
      ? // If "all" is selected show every incident
        MOCK_INCIDENTS
      : // Otherwise only show incidents matching the selected type
        MOCK_INCIDENTS.filter((i) => i.type === activeFilter);

  return (
    // Section with vertical padding and centered max width
    <section id="dashboard" className="py-24 px-10 max-w-6xl mx-auto">
      {/* Small uppercase section label */}
      <p className="section-label">Command Center</p>

      {/* Section heading */}
      <h2 className="section-title">Community Incident Dashboard</h2>

      {/* Supporting description */}
      <p className="section-sub">
        Real-time visibility across all active emergencies in the Kasoa community.
        Color-coded by type, filtered by incident category.
      </p>

      {/* Dashboard card container */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* ── Dashboard Header ── */}
        <div
          className="px-7 py-6 flex items-center justify-between flex-wrap gap-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {/* Dashboard title */}
          <h3
            className="text-xl font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            🗺 Live Kasoa Map
          </h3>

          {/* ── Filter Tabs ── */}
          {/* Dark pill container holding the incident type filter buttons */}
          <div
            className="flex gap-1 p-1 rounded-lg"
            style={{ background: "var(--bg)" }}
          >
            {/* Render each filter tab */}
            {tabs.map((tab) => (
              <button
                key={tab.value}
                // Update the active filter when a tab is clicked
                onClick={() => setActiveFilter(tab.value)}
                className="px-3.5 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200"
                style={{
                  // Active tab has a surface background, inactive is transparent
                  background:
                    activeFilter === tab.value ? "var(--surface)" : "transparent",
                  color:
                    activeFilter === tab.value
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  border: "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Town Filter Dropdown ── */}
          {/* Dropdown to filter incidents by specific Kasoa community town */}
          <select
            className="form-input text-sm"
            style={{ width: "auto", minWidth: "160px" }}
          >
            {/* Default option shows all towns */}
            <option>All Kasoa Towns</option>
            {/* Render each Kasoa town as a selectable option */}
            {KASOA_TOWNS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* ── Dashboard Body ── */}
        {/* Two-column layout: map on left, incident feed on right */}
        <div className="flex flex-col lg:flex-row min-h-[500px]">

          {/* ── Map Panel ── */}
          <div
            className="flex-1 relative overflow-hidden"
            style={{ background: "#0d1117", minHeight: "400px" }}
          >
            {/* Subtle grid background to give the map a technical look */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(46,134,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(46,134,255,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* ── Map Markers ── */}
            {/* Filter markers by active type and render each one */}
            {MAP_MARKERS.filter(
              (m) => activeFilter === "all" || m.type === activeFilter
            ).map((m, i) => (
              <div key={i} style={{ position: "absolute", top: m.top, left: m.left }}>
                {/* Pulsing ring shown on critical incidents to draw attention */}
                {m.ping && (
                  <div
                    className="ping-ring absolute rounded-full"
                    style={{
                      width: "14px",
                      height: "14px",
                      // Color the ring to match the incident type
                      background:
                        m.type === "fire"
                          ? "rgba(255,59,59,0.35)"
                          : m.type === "flood"
                          ? "rgba(46,134,255,0.35)"
                          : "rgba(255,140,0,0.35)",
                    }}
                  />
                )}

                {/* The solid dot marker representing the incident location */}
                <div
                  className="rounded-full cursor-pointer transition-transform duration-200 hover:scale-150"
                  style={{
                    width: "14px",
                    height: "14px",
                    // Color the dot to match the incident type
                    background: TYPE_COLOR[m.type],
                    // Dark border helps the dot stand out on the map background
                    border: "2px solid rgba(10,12,16,0.8)",
                    // Glow matching the incident type color
                    boxShadow: `0 0 8px ${TYPE_COLOR[m.type]}`,
                    position: "relative",
                  }}
                />
              </div>
            ))}

            {/* ── Map Legend ── */}
            {/* Bottom-left legend explaining the marker colors */}
            <div
              className="absolute bottom-5 left-5 flex gap-4 rounded-xl px-4 py-3 text-xs"
              style={{
                background: "rgba(10,12,16,0.85)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(6px)",
                color: "var(--text-secondary)",
              }}
            >
              {/* Fire legend entry */}
              <span><span style={{ color: "var(--red)" }}>●</span> Fire</span>
              {/* Flood legend entry */}
              <span><span style={{ color: "var(--blue)" }}>●</span> Flood</span>
              {/* Accident legend entry */}
              <span><span style={{ color: "var(--orange)" }}>●</span> Accident</span>
            </div>

            {/* Placeholder text shown in the center of the map */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Interactive map requires
                <br />
                GPS & maps integration
              </p>
            </div>
          </div>

          {/* ── Incident Feed Panel ── */}
          <div
            className="w-full lg:w-[360px] flex flex-col"
            style={{ borderLeft: "1px solid var(--border)" }}
          >
            {/* Panel header showing the count of active incidents */}
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {/* Panel label */}
              <span
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: "var(--text-secondary)" }}
              >
                Recent Incidents
              </span>

              {/* Count badge showing how many incidents are in the filtered list */}
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "var(--red-dim)", color: "var(--red)" }}
              >
                {filtered.length} active
              </span>
            </div>

            {/* Scrollable list of incident rows */}
            <div className="overflow-y-auto flex-1">
              {/* Render one row per filtered incident */}
              {filtered.map((inc) => (
                <div
                  key={inc.id}
                  className="px-5 py-4 flex items-start gap-3 cursor-pointer transition-colors duration-150"
                  style={{ borderBottom: "1px solid var(--border)" }}
                  // Highlight the row on hover to indicate it is clickable
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "transparent")
                  }
                >
                  {/* Colored dot matching the incident type */}
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: TYPE_COLOR[inc.type],
                      boxShadow: `0 0 6px ${TYPE_COLOR[inc.type]}`,
                    }}
                  />

                  {/* Incident title and location metadata */}
                  <div className="flex-1 min-w-0">
                    {/* Incident title — truncated if too long */}
                    <div className="text-sm font-medium mb-0.5 truncate">
                      {inc.title}
                    </div>
                    {/* Kasoa town and time since reported */}
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {inc.region} · {inc.createdAt}
                    </div>
                  </div>

                  {/* Status badge showing current workflow stage */}
                  <span className={STATUS_CLASS[inc.status]}>{inc.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
