"use client";

// Import React and hooks for managing state, side effects, and lifecycle
import React, { useState, useEffect } from "react";
// Import the shared Navbar component for consistent navigation across the admin portal
import Navbar from "@/components/layout/Navbar";
// Import the shared Footer component for the bottom of the page
import Footer from "@/components/layout/Footer";
// Import the list of Ghanaian utility and community agencies from the shared data file
import { COMMUNITY_AGENCIES } from "@/lib/data";
// Import TypeScript types for community issue categories and severity levels
import type { IssueType, SeverityLevel } from "@/lib/types";
// Import the API client functions used to fetch, update, and dispatch community issues
import { updateIncident, dispatchIncident, getIncidents } from "@/lib/api";
// Import the Incident type from the API definition for proper typing of fetched data
import type { Incident as APIIncident } from "@/lib/api";
// Import Next.js Link for optimized navigation to other administrative tools
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// TYPE_COLOR maps each of the ten community issue types to its branded display color
const TYPE_COLOR: Record<IssueType, string> = {
  // Traffic congestion highlighted in red-accent
  traffic_congestion: "#e74c3c",
  // Burst water pipe highlighted in blue
  burst_water_pipe: "#3498db",
  // Electrical fault highlighted in yellow-orange
  electrical_fault: "#f39c12",
  // Weak bridge highlighted in purple
  weak_bridge: "#8e44ad",
  // Pothole / bad road highlighted in dark orange
  pothole_bad_road: "#d35400",
  // Illegal dumping highlighted in green
  illegal_dumping: "#27ae60",
  // Streetlight outage highlighted in dark blue-grey
  streetlight_outage: "#2c3e50",
  // Open manhole highlighted in teal
  open_manhole: "#16a085",
  // Noise complaint highlighted in dark red
  noise_complaint: "#c0392b",
  // Other issues highlighted in grey
  other: "#7f8c8d",
};

// SEV_COLOR maps each semantic severity level (low, moderate, critical) to its display color
const SEV_COLOR: Record<SeverityLevel, string> = {
  // Low severity indicated by a stable green
  low: "var(--green)",
  // Moderate severity indicated by a cautionary orange
  moderate: "var(--orange)",
  // Critical severity indicated by an urgent brand red
  critical: "var(--red)",
};

// AdminPage serves as the primary command and control interface for CIRP operators
// It allows for the review, verification, agency assignment, and resolution of community issues
export default function AdminPage() {
  // incidents stores the complete collection of community issue reports retrieved from the backend
  const [incidents, setIncidents] = useState<APIIncident[]>([]);
  // selected holds the specific issue currently being viewed or edited in the detail panel
  const [selected, setSelected] = useState<APIIncident | null>(null);
  // search stores the active text filter string for the issue list
  const [search, setSearch] = useState<string>("");
  // selectedAgency holds the target agency name selected from the assignment dropdown
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  // loading is a boolean flag indicating whether the initial data fetch is in progress
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // useEffect hook to initialize the dashboard data on the first component render
  useEffect(() => {
    if (!authLoading && (!user || (user.role !== "admin" && user.role !== "superadmin" && user.role !== "responder"))) {
      router.push("/");
      return;
    }

    // Define an internal asynchronous function to fetch the latest issue reports
    const fetchIncidents = async () => {
      try {
        // Request the 100 most recent community issue reports from the API
        const data = await getIncidents({ limit: 100 });
        // Update the incidents state variable with the server's response
        setIncidents(data.incidents);
      } catch {
        // Log a console error if the network request or database query fails
        console.error("Failed to fetch community issues from the backend database");
      } finally {
        // Ensure the loading state is disabled once the request has completed
        setLoading(false);
      }
    };
    
    if (!authLoading && user) {
      fetchIncidents();
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || (user.role !== "admin" && user.role !== "superadmin" && user.role !== "responder")) {
    return <div className="min-h-screen bg-bg" />;
  }

  // advance manages the progression of a community issue through the resolution workflow
  const advance = async (id: string): Promise<void> => {
    // Locate the current issue record in the state by its unique ID
    const current = incidents.find((i) => i.id === id);
    // Exit the function if the record cannot be found
    if (!current) return;

    // STATUS_NEXT defines the logical sequence of stages in the issue resolution process
    const STATUS_NEXT: Record<string, string> = {
      // 'new' reports must be 'assigned' to a responding utility or agency
      new: "assigned",
      // 'assigned' or 'dispatched' issues move to 'in_progress' once work starts
      assigned: "in_progress",
      dispatched: "in_progress",
      // 'in_progress' issues are moved to 'resolved' upon physical completion of repairs
      in_progress: "resolved",
      // 'resolved' is the final terminal state for any community issue
      resolved: "resolved",
    };

    // Calculate the subsequent status based on the current record state
    const nextStatus = STATUS_NEXT[current.status];

    try {
      // If an agency is currently selected and the issue is still in 'new' status, trigger a dispatch
      if (selectedAgency && current.status === "new") {
        // Call the dispatch endpoint to link the issue to the chosen Ghanaian agency
        await dispatchIncident(id, selectedAgency);
      } else {
        // For all other transitions, update the status field directly
        await updateIncident(id, { status: nextStatus });
      }
      // Refresh the local incident collection from the server to ensure UI consistency
      const data = await getIncidents({ limit: 100 });
      // Update the main incidents state array with the fresh records
      setIncidents(data.incidents);
      // Re-select the updated record to refresh the detail panel view
      const updated = data.incidents.find((i) => i.id === id);
      // Update the 'selected' state if the fresh record was found
      if (updated) setSelected(updated);
    } catch {
      // Alert the operator if the update fails due to auth or network issues
      alert("Failed to update issue status. Please verify your administrative credentials.");
    }
  };

  // filtered generates a subset of issues that match the operator's current search query
  const filtered = incidents.filter(
    (inc) =>
      // Perform case-insensitive matching on the issue description text
      inc.description?.toLowerCase().includes(search.toLowerCase()) ||
      // Perform case-insensitive matching on the Kasoa community town name
      inc.region?.toLowerCase().includes(search.toLowerCase()) ||
      // Perform case-insensitive matching on the specific location or landmark string
      inc.location_text?.toLowerCase().includes(search.toLowerCase())
  );

  // counts aggregates the number of community issues at each stage of the resolution workflow
  const counts = {
    // Tally of unreviewed issues submitted by citizens
    new: incidents.filter((i) => i.status === "new").length,
    // Tally of issues currently assigned or dispatched to a responding agency
    assigned: incidents.filter((i) => i.status === "assigned" || i.status === "dispatched").length,
    // Tally of issues where work has actively commenced on site
    in_progress: incidents.filter((i) => i.status === "in_progress").length,
    // Tally of community issues that have been successfully resolved
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  return (
    // Semantic main element containing the administrative command center interface
    <main>
      {/* Standard platform navigation bar displayed at the top of the viewport */}
      <Navbar />

      {/* Header section containing the dashboard title and real-time status metric cards */}
      <div className="pt-32 px-10 max-w-6xl mx-auto pb-0">
        {/* Layout container for the title block and the metric cards */}
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          {/* Dashboard primary title block */}
          <div>
            {/* Small uppercase label identifying the current portal context */}
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--red)" }}>
              CIRP Admin Portal
            </p>
            {/* Main heading for the command center with brand typography */}
            <h1 className="font-extrabold" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(32px,4vw,48px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Kasoa Command Center
            </h1>
          </div>

          {/* Row of four status summary count cards for quick operational assessment */}
          <div className="flex gap-3">
            {([
              // New issues highlighted in brand red
              { label: "New", count: counts.new, color: "var(--red)" },
              // Assigned issues highlighted in cautionary orange
              { label: "Assigned", count: counts.assigned, color: "var(--orange)" },
              // Active work issues highlighted in blue
              { label: "Active", count: counts.in_progress, color: "var(--blue)" },
              // Resolved issues highlighted in success green
              { label: "Resolved", count: counts.resolved, color: "var(--green)" },
            ] as { label: string; count: number; color: string }[]).map(({ label, count, color }) => (
              // Individual metric card with surface background and status color
              <div key={label} className="rounded-xl px-5 py-3 text-center min-w-22" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                {/* Large bold digit showing the current tally for the status */}
                <div className="text-2xl font-extrabold" style={{ fontFamily: "Syne, sans-serif", color }}>{count}</div>
                {/* Descriptive label for the status tally */}
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main two-column dashboard layout for list viewing and detailed management */}
      <div className="px-10 max-w-6xl mx-auto pb-24">
        {/* Outer card container splitting the screen into list (left) and detail (right) views */}
        <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row" style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: "600px" }}>

          {/* ── Left Sidebar: Searchable Community Issue List ── */}
          <div className="flex-1 flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
            {/* Search area with text input for filtering the visible issue records */}
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              {/* Text input component bound to the dashboard search state */}
              <input
                type="text"
                className="form-input text-sm"
                placeholder="Search by description or Kasoa town…"
                value={search}
                // Update the local search state on every keystroke
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>

            {/* Scrollable container for the filtered list of community issue reports */}
            <div className="overflow-y-auto flex-1">
              {/* Conditional rendering for the loading state during database fetch */}
              {loading ? (
                <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  Retrieving community issues from the database…
                </div>
              ) : filtered.length === 0 ? (
                // Feedback message shown when the search query yields no results
                <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No community issues match your current search criteria.
                </div>
              ) : (
                // Iterate through the filtered issues to generate individual list items
                filtered.map((inc) => (
                  <div
                    key={inc.id}
                    // Select the clicked issue for viewing in the right-hand detail panel
                    onClick={() => { setSelected(inc); setSelectedAgency(""); }}
                    // Flexible layout for the list item with hover transitions
                    className="px-5 py-4 flex items-start gap-3 cursor-pointer transition-colors duration-150"
                    // Highlight the item if it is currently selected in the detail panel
                    style={{ borderBottom: "1px solid var(--border)", background: selected?.id === inc.id ? "var(--surface2)" : "transparent" }}
                  >
                    {/* Visual dot indicator colored by the issue category */}
                    <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: TYPE_COLOR[inc.type as IssueType] || "#7f8c8d", boxShadow: `0 0 5px ${TYPE_COLOR[inc.type as IssueType] || "#7f8c8d"}` }} />
                    {/* Primary metadata: description, town, and report time */}
                    <div className="flex-1 min-w-0">
                      {/* Truncated description text for a clean list appearance */}
                      <div className="text-sm font-medium mb-0.5 truncate">{inc.description}</div>
                      {/* Region and timestamp details in a muted secondary color */}
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{inc.region} · {new Date(inc.created_at).toLocaleTimeString()}</div>
                    </div>
                    {/* Status badge representing the current workflow stage */}
                    <span className={`badge badge-${inc.status} shrink-0 text-[10px]`}>{inc.status.replace(/_/g, " ")}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right Column: Detailed Community Issue Management Panel ── */}
          <div className="w-full lg:w-95 flex flex-col">
            {/* Render the management interface only if an issue record is selected */}
            {selected ? (
              <div className="p-6 flex flex-col h-full">
                {/* Detail header area with the issue ID and a panel close button */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    {/* Mono-spaced reference ID derived from the database UUID */}
                    <p className="text-xs font-mono mb-1" style={{ color: "var(--text-muted)" }}>ID: {selected.id.slice(0, 8).toUpperCase()}</p>
                    {/* Primary heading displaying the full issue description */}
                    <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{selected.description}</h2>
                  </div>
                  {/* Icon button to deselect the current issue and return to empty state */}
                  <button onClick={() => setSelected(null)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                </div>

                {/* Structured metadata grid showing all relevant issue properties */}
                <div className="grid grid-cols-2 gap-3 mb-5 rounded-xl p-4" style={{ background: "var(--surface2)" }}>
                  {([
                    // Mapped category of the community issue
                    ["Category", selected.type.replace(/_/g, " ")],
                    // Target Kasoa community region
                    ["Town", selected.region],
                    // Urgency/Severity level as reported by the citizen
                    ["Severity", selected.severity],
                    // Current stage in the CIRP workflow
                    ["Status", selected.status.replace(/_/g, " ")],
                    // Specific landmark or street address
                    ["Location", selected.location_text],
                    // Linked Ghanaian agency or 'Unassigned' fallback
                    ["Agency", selected.assigned_agency ?? "Unassigned"],
                  ] as [string, string][]).map(([label, val]) => (
                    // Individual field container with label and value
                    <div key={label}>
                      {/* Secondary field label in muted typography */}
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                      {/* Primary field value with conditional color highlighting for categories and severity */}
                      <p className="text-sm font-medium capitalize" style={{ color: label === "Category" ? (TYPE_COLOR[selected.type as IssueType] || "var(--text-primary)") : label === "Severity" ? SEV_COLOR[selected.severity as SeverityLevel] : "var(--text-primary)" }}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* Agency assignment control — only relevant for 'new' unassigned issues */}
                <div className="mb-5">
                  {/* Descriptive label for the agency selection dropdown */}
                  <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Assign Agency</p>
                  {/* Select menu populated from the centralized Ghanaian agency registry */}
                  <select className="form-input text-sm" value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}>
                    {/* Default selection prompt */}
                    <option value="">Select Ghanaian agency…</option>
                    {/* Iterate through agencies like GWCL, ECG, etc. to generate options */}
                    {COMMUNITY_AGENCIES.map((a) => <option key={a.id}>{a.name}</option>)}
                  </select>
                </div>

                {/* Workflow management action buttons pinned to the bottom of the panel */}
                <div className="mt-auto flex flex-col gap-2">
                  {/* Show the primary action button only for active (non-resolved) issues */}
                  {selected.status !== "resolved" && (
                    <button className="btn-primary w-full py-3 rounded-xl text-sm" onClick={() => advance(selected.id)}>
                      {/* Dynamically update the button label based on the current workflow stage */}
                      {selected.status === "new" ? "🚀 Verify & Assign Agency" : selected.status === "assigned" ? "🛠 Acknowledge Work" : "✅ Mark as Resolved"}
                    </button>
                  )}
                  {/* Display a permanent confirmation banner once an issue reaches terminal status */}
                  {selected.status === "resolved" && (
                    <div className="w-full py-3 rounded-xl text-sm text-center font-medium" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green)" }}>
                      ✓ Issue Successfully Resolved
                    </div>
                  )}
                  {/* Secondary utility link to broadcast a public notification regarding this issue */}
                  <Link href="/alerts">
                    <button className="btn-ghost w-full py-2.5 rounded-xl text-sm">📢 Send Notice regarding this Issue</button>
                  </Link>
                </div>
              </div>
            ) : (
              // Visual placeholder state shown when no community issue is currently selected
              <div className="flex-1 flex items-center justify-center text-center p-10" style={{ color: "var(--text-muted)" }}>
                <div>
                  {/* Large clipboard emoji to suggest administrative oversight */}
                  <div className="text-4xl mb-3">📋</div>
                  {/* Instruction text for the operator */}
                  <p className="text-sm">Select a community issue from the list to review and manage</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global shared footer displayed at the bottom of the administrative dashboard */}
      <Footer />
    </main>
  );
}