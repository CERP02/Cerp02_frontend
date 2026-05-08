"use client";

// Import the shared Navbar component for consistent navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the Dashboard section component with the live map and incident feed
import Dashboard from "@/components/sections/Dashboard";
// Import the shared Footer component
import Footer from "@/components/layout/Footer";
// Import mock incidents and Kasoa towns for the searchable table
import { KASOA_TOWNS } from "@/lib/data";
import { getIncidents } from "@/lib/api";
import type { Incident } from "@/lib/api";
// Import TypeScript types for incident properties
import type { IncidentType, SeverityLevel } from "@/lib/types";
// Import React hooks for managing search state
import { useEffect, useState } from "react";

// TYPE_COLOR maps each incident type to its display color for the table badges
const TYPE_COLOR: Record<IncidentType, string> = {
  flood: "var(--blue)",
  fire: "var(--red)",
  accident: "var(--orange)",
};

// SEV_COLOR maps each severity level to its display color
const SEV_COLOR: Record<SeverityLevel, string> = {
  low: "var(--green)",
  moderate: "var(--orange)",
  critical: "var(--red)",
};

// DashboardPage renders at the "/dashboard" route
// It shows the live map component followed by a full searchable incident table
export default function DashboardPage() {
  // search holds the current text typed into the search input
  const [search, setSearch] = useState("");

  // filtered is the subset of incidents whose title or town matches the search text
  const [incidents, setIncidents] = useState<Incident[]>([]);

useEffect(() => {
  getIncidents({ limit: 100 }).then((data) => setIncidents(data.incidents));
}, []);

const filtered = incidents.filter(
  (inc) =>
    inc.description?.toLowerCase().includes(search.toLowerCase()) ||
    inc.region?.toLowerCase().includes(search.toLowerCase())
);

  return (
    // Semantic main element wrapping all page content
    <main>
      {/* Shared fixed navigation bar */}
      <CitizenNavbar />

      {/* Page header with title and description */}
      <div className="pt-32 pb-8 px-10 max-w-6xl mx-auto">
        {/* Small uppercase section label */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--red)" }}
        >
          Command Center
        </p>

        {/* Main page heading */}
        <h1
          className="font-extrabold mb-2"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(36px,5vw,56px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Community Dashboard
        </h1>

        {/* Supporting description */}
        <p
          className="text-base max-w-lg mb-0"
          style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
        >
          Live overview of all reported incidents across the Kasoa community towns.
        </p>
      </div>

      {/* ── Live Map Component ── */}
      {/* The Dashboard section component renders the map and incident feed */}
      <div className="px-10 max-w-6xl mx-auto">
        <Dashboard incidents={[]} />
      </div>

      {/* ── Full Incident Table ── */}
      <div className="px-10 max-w-6xl mx-auto pb-24">
        {/* Table card container */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Table header with title and search input */}
          <div
            className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            {/* Table heading */}
            <h2 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
              All Incidents
            </h2>

            {/* Search input to filter incidents by description or Kasoa town */}
            <input
              type="text"
              className="form-input text-sm"
              style={{ width: "260px" }}
              placeholder="Search by description or Kasoa town…"
              value={search}
              // Update search state on every keystroke
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Scrollable table with horizontal overflow for small screens */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              {/* Table column headers */}
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {/* Render each column header */}
                  {['ID', 'Type', 'Location', 'Kasoa Town', 'Severity', 'Status', 'Reported'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table body — one row per filtered incident */}
              <tbody>
                {filtered.map((inc) => (
                  <tr
                    key={inc.id}
                    className="transition-colors duration-150 cursor-pointer"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    // Highlight row on hover
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "transparent")
                    }
                  >
                    {/* Incident ID in monospace font */}
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {inc.id}
                    </td>

                    {/* Incident type badge colored by type */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold uppercase px-2 py-1 rounded"
                        style={{
                          background: `${TYPE_COLOR[inc.type]}20`,
                          color: TYPE_COLOR[inc.type],
                        }}
                      >
                        {inc.type}
                      </span>
                    </td>

                    {/* Incident location summary */}
                    <td className="px-5 py-4 font-medium">{inc.location_text}</td>

                    {/* The Kasoa community town where this incident occurred */}
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                      {inc.region}
                    </td>

                    {/* Severity level colored by severity */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold capitalize"
                        style={{ color: SEV_COLOR[inc.severity] }}
                      >
                        {inc.severity}
                      </span>
                    </td>

                    {/* Status badge using the shared badge CSS classes */}
                    <td className="px-5 py-4">
                      <span className={`badge badge-${inc.status}`}>
                        {inc.status}
                      </span>
                    </td>

                    {/* Relative time since the incident was reported */}
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-muted)" }}>
                      {inc.created_at}
                    </td>
                  </tr>
                ))}

                {/* Empty state row shown when no incidents match the search */}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No incidents match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shared footer */}
      <Footer />
    </main>
  );
}
