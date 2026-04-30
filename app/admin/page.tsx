"use client";

// Import React and hooks for state management and side effects
import React, { useState, useEffect } from "react";
// Import the shared Navbar component for consistent navigation across pages
import Navbar from "@/components/layout/Navbar";
// Import the shared Footer component shown at the bottom of every page
import Footer from "@/components/layout/Footer";
// Import the list of Kasoa emergency agencies from the mock data file
import { MOCK_AGENCIES } from "@/lib/data";
// Import TypeScript types for incident category and severity level
import type { IncidentType, SeverityLevel } from "@/lib/types";
// Import the API functions used to fetch and update incidents from the backend
import { updateIncident, dispatchIncident, getIncidents } from "@/lib/api";
// Import the Incident type from the API file to type the fetched incident data
import type { Incident as APIIncident } from "@/lib/api";
// Import Next.js Link for navigating to the alerts page
import Link from "next/link";

// TYPE_COLOR maps each incident type to its corresponding display color
const TYPE_COLOR: Record<IncidentType, string> = {
  // Flood incidents are displayed in blue
  flood: "var(--blue)",
  // Fire incidents are displayed in red
  fire: "var(--red)",
  // Road accident incidents are displayed in orange
  accident: "var(--orange)",
};

// SEV_COLOR maps each severity level to its corresponding display color
const SEV_COLOR: Record<SeverityLevel, string> = {
  // Low severity incidents are shown in green
  low: "var(--green)",
  // Moderate severity incidents are shown in orange
  moderate: "var(--orange)",
  // Critical severity incidents are shown in red
  critical: "var(--red)",
};

// AdminPage is the main command center page rendered at the "/admin" route
export default function AdminPage() {
  // incidents holds the list of real incidents fetched from the backend database
  const [incidents, setIncidents] = useState<APIIncident[]>([]);
  // selected holds the incident currently open in the right detail panel
  const [selected, setSelected] = useState<APIIncident | null>(null);
  // search holds the text typed into the search input for filtering incidents
  const [search, setSearch] = useState<string>("");
  // selectedAgency holds the name of the agency chosen in the assign dropdown
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  // loading is true while the incidents are being fetched from the backend
  const [loading, setLoading] = useState(true);

  // useEffect runs fetchIncidents once when the admin page first loads
  useEffect(() => {
    // fetchIncidents calls the backend GET /incidents endpoint
    const fetchIncidents = async () => {
      try {
        // Call the getIncidents API function with a high limit to get all incidents
        const data = await getIncidents({ limit: 100 });
        // Store the fetched incidents in state so they appear in the list panel
        setIncidents(data.incidents);
      } catch {
        // Log an error to the console if the fetch fails
        console.error("Failed to fetch incidents from the backend");
      } finally {
        // Always turn off the loading state when the request finishes
        setLoading(false);
      }
    };
    // Call the fetch function immediately when the component mounts
    fetchIncidents();
  }, []);

  // advance moves the selected incident to the next status in the workflow
  const advance = async (id: string): Promise<void> => {
    // Find the current incident in the list by its ID
    const current = incidents.find((i) => i.id === id);
    // If the incident was not found, do nothing
    if (!current) return;

    // STATUS_NEXT maps each status to the next one in the workflow
    const STATUS_NEXT: Record<string, string> = {
      // New incidents move to dispatched when the admin verifies and assigns an agency
      new: "dispatched",
      // Dispatched incidents move to resolved when the responder closes the case
      dispatched: "resolved",
      // Resolved incidents stay resolved
      resolved: "resolved",
    };

    // Calculate the next status for this incident
    const nextStatus = STATUS_NEXT[current.status];

    try {
      // If an agency is selected and the incident is new, use the dispatch endpoint
      if (selectedAgency && current.status === "new") {
        // Call PATCH /incidents/:id/dispatch to assign the agency
        await dispatchIncident(id, selectedAgency);
      } else {
        // Otherwise just update the status using the standard update endpoint
        await updateIncident(id, { status: nextStatus });
      }
      // Refresh the full incidents list from the backend after the update
      const data = await getIncidents({ limit: 100 });
      // Update the incidents state with the fresh data from the database
      setIncidents(data.incidents);
      // Find the updated version of the currently selected incident
      const updated = data.incidents.find((i) => i.id === id);
      // Update the selected incident in the detail panel if it was found
      if (updated) setSelected(updated);
    } catch {
      // Show an alert if the update fails
      alert("Failed to update incident. Make sure you are logged in as admin.");
    }
  };

  // filtered is the subset of incidents that match the search text
  const filtered = incidents.filter(
    (inc) =>
      // Match on the incident description text
      inc.description?.toLowerCase().includes(search.toLowerCase()) ||
      // Match on the Kasoa community town name
      inc.region?.toLowerCase().includes(search.toLowerCase()) ||
      // Match on the location text
      inc.location_text?.toLowerCase().includes(search.toLowerCase())
  );

  // counts summarises how many incidents are in each status stage
  const counts = {
    // Count of new unreviewed incidents
    new: incidents.filter((i) => i.status === "new").length,
    // Count of incidents currently being responded to
    dispatched: incidents.filter((i) => i.status === "dispatched").length,
    // Count of fully resolved incidents
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    // Semantic main element wrapping all page content
    <main>
      {/* Shared fixed navigation bar */}
      <Navbar />

      {/* Page header with title and status count cards */}
      <div className="pt-32 px-10 max-w-6xl mx-auto pb-0">
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          {/* Page title block */}
          <div>
            {/* Small uppercase portal label */}
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--red)" }}>
              Admin Portal
            </p>
            {/* Main page heading */}
            <h1 className="font-extrabold" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Kasoa Command Center
            </h1>
          </div>

          {/* Three status summary count cards */}
          <div className="flex gap-3">
            {([
              // New count shown in red
              { label: "New", count: counts.new, color: "var(--red)" },
              // Dispatched count shown in orange
              { label: "Dispatched", count: counts.dispatched, color: "var(--orange)" },
              // Resolved count shown in green
              { label: "Resolved", count: counts.resolved, color: "var(--green)" },
            ] as { label: string; count: number; color: string }[]).map(({ label, count, color }) => (
              // Individual count card
              <div key={label} className="rounded-xl px-5 py-3 text-center min-w-22" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                {/* Large count number colored by status */}
                <div className="text-2xl font-extrabold" style={{ fontFamily: "Syne, sans-serif", color }}>{count}</div>
                {/* Status label below the count */}
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main two-panel command center layout */}
      <div className="px-10 max-w-6xl mx-auto pb-24">
        {/* Outer card containing the incident list and detail panel */}
        <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row" style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: "560px" }}>

          {/* ── Left Panel: Incident List ── */}
          <div className="flex-1 flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
            {/* Search input for filtering incidents */}
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              {/* Text input bound to the search state */}
              <input
                type="text"
                className="form-input text-sm"
                placeholder="Search incidents or Kasoa town…"
                value={search}
                // Update search state on every keystroke
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>

            {/* Scrollable incident list */}
            <div className="overflow-y-auto flex-1">
              {/* Loading state while fetching from the backend */}
              {loading ? (
                <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  Loading incidents from the database…
                </div>
              ) : filtered.length === 0 ? (
                // Empty state when no incidents match the search
                <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No incidents found.
                </div>
              ) : (
                // Render one row per filtered incident
                filtered.map((inc) => (
                  <div
                    key={inc.id}
                    // Open this incident in the detail panel when clicked
                    onClick={() => { setSelected(inc); setSelectedAgency(""); }}
                    className="px-5 py-4 flex items-start gap-3 cursor-pointer transition-colors duration-150"
                    style={{ borderBottom: "1px solid var(--border)", background: selected?.id === inc.id ? "var(--surface2)" : "transparent" }}
                  >
                    {/* Colored dot indicating the incident type */}
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: TYPE_COLOR[inc.type as IncidentType], boxShadow: `0 0 5px ${TYPE_COLOR[inc.type as IncidentType]}` }} />
                    {/* Incident description and metadata */}
                    <div className="flex-1 min-w-0">
                      {/* Description truncated if too long */}
                      <div className="text-sm font-medium mb-0.5 truncate">{inc.description}</div>
                      {/* Kasoa town and time reported */}
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{inc.region} · {new Date(inc.created_at).toLocaleTimeString()}</div>
                    </div>
                    {/* Status badge */}
                    <span className={`badge badge-${inc.status} shrink-0`}>{inc.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right Panel: Incident Detail ── */}
          <div className="w-full lg:w-95 flex flex-col">
            {/* Show detail view if an incident is selected, otherwise show empty state */}
            {selected ? (
              <div className="p-6 flex flex-col h-full">
                {/* Detail header with reference ID and close button */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    {/* Short reference ID derived from the UUID */}
                    <p className="text-xs font-mono mb-1" style={{ color: "var(--text-muted)" }}>{selected.id.slice(0, 8).toUpperCase()}</p>
                    {/* Incident description as the panel title */}
                    <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{selected.description}</h2>
                  </div>
                  {/* Close button to deselect the incident */}
                  <button onClick={() => setSelected(null)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                </div>

                {/* Metadata grid showing incident properties */}
                <div className="grid grid-cols-2 gap-3 mb-5 rounded-xl p-4" style={{ background: "var(--surface2)" }}>
                  {([
                    // Incident type with color coding
                    ["Type", selected.type],
                    // Kasoa town where it occurred
                    ["Town", selected.region],
                    // Severity level with color coding
                    ["Severity", selected.severity],
                    // Current workflow status
                    ["Status", selected.status],
                    // Street address or landmark
                    ["Location", selected.location_text],
                    // Assigned agency name or Unassigned
                    ["Agency", selected.assigned_agency ?? "Unassigned"],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label}>
                      {/* Field label */}
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                      {/* Field value with conditional color for type and severity */}
                      <p className="text-sm font-medium capitalize" style={{ color: label === "Type" ? TYPE_COLOR[selected.type as IncidentType] : label === "Severity" ? SEV_COLOR[selected.severity as SeverityLevel] : "var(--text-primary)" }}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* Agency assignment dropdown */}
                <div className="mb-5">
                  {/* Label for the agency selector */}
                  <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Assign Agency</p>
                  {/* Dropdown listing all Kasoa emergency agencies */}
                  <select className="form-input text-sm" value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}>
                    {/* Default empty option */}
                    <option value="">Select agency…</option>
                    {/* Render each agency as a selectable option */}
                    {MOCK_AGENCIES.map((a) => <option key={a.id}>{a.name}</option>)}
                  </select>
                </div>

                {/* Action buttons at the bottom of the detail panel */}
                <div className="mt-auto flex flex-col gap-2">
                  {/* Advance button shown only when incident is not yet resolved */}
                  {selected.status !== "resolved" && (
                    <button className="btn-primary w-full py-3 rounded-xl text-sm" onClick={() => advance(selected.id)}>
                      {/* Label changes based on current status */}
                      {selected.status === "new" ? "✅ Verify & Dispatch" : "✅ Mark as Resolved"}
                    </button>
                  )}
                  {/* Resolved confirmation banner shown when incident is closed */}
                  {selected.status === "resolved" && (
                    <div className="w-full py-3 rounded-xl text-sm text-center font-medium" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green)" }}>
                      ✓ Incident Resolved
                    </div>
                  )}
                  {/* Button to navigate to the alerts page */}
                  <Link href="/alerts">
                    <button className="btn-ghost w-full py-2.5 rounded-xl text-sm">🚨 Send Alert for This Incident</button>
                  </Link>
                </div>
              </div>
            ) : (
              // Empty state when no incident is selected
              <div className="flex-1 flex items-center justify-center text-center p-10" style={{ color: "var(--text-muted)" }}>
                <div>
                  {/* Clipboard emoji as a visual cue */}
                  <div className="text-4xl mb-3">📋</div>
                  {/* Instruction text */}
                  <p className="text-sm">Select an incident to review and manage</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shared footer */}
      <Footer />
    </main>
  );
}