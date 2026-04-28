"use client";

// Import React and hooks for state and side effects
import React, { useState, useEffect } from "react";
// Import the AdminSidebar component that replaces the top navbar for admins
import AdminSidebar from "@/components/layout/AdminSidebar";
// Import the list of Kasoa emergency agencies
import { MOCK_AGENCIES } from "@/lib/data";
// Import TypeScript types for incident properties
import type { IncidentType, SeverityLevel } from "@/lib/types";
// Import API functions for fetching and updating incidents
import { updateIncident, dispatchIncident, getIncidents } from "@/lib/api";
// Import the Incident type from the API module
import type { Incident as APIIncident } from "@/lib/api";
// Import Next.js Link for navigation to the alerts page
import Link from "next/link";
// Import the auth context to check if the user is an admin
import { useAuth } from "@/context/AuthContext";
// Import Next.js router for redirecting unauthenticated users
import { useRouter } from "next/navigation";

// TYPE_COLOR maps each incident type to its display color
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

// AdminPage is the command center rendered at the "/admin" route
export default function AdminPage() {
  // incidents holds the real incidents fetched from the backend
  const [incidents, setIncidents] = useState<APIIncident[]>([]);
  // selected holds the incident open in the detail panel
  const [selected, setSelected] = useState<APIIncident | null>(null);
  // search holds the filter text typed into the search input
  const [search, setSearch] = useState<string>("");
  // selectedAgency holds the agency chosen in the assign dropdown
  const [selectedAgency, setSelectedAgency] = useState<string>("");
  // loading is true while fetching incidents from the backend
  const [loading, setLoading] = useState(true);

  // Read the logged-in user from auth context
  const { user } = useAuth();
  // useRouter for redirecting non-admin users
  const router = useRouter();

  // Redirect to admin login if not authenticated or not an admin
  useEffect(() => {
    if (!user) {
      // Redirect to admin login if no user is logged in
      router.push("/admin/login");
    } else if (user.role !== "admin") {
      // Redirect citizens to the home page
      router.push("/");
    }
  }, [user, router]);

  // Fetch real incidents from the backend when the page loads
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        // Call GET /incidents with a high limit to retrieve all incidents
        const data = await getIncidents({ limit: 100 });
        // Store the fetched incidents in state
        setIncidents(data.incidents);
      } catch {
        console.error("Failed to fetch incidents");
      } finally {
        // Turn off loading when done
        setLoading(false);
      }
    };
    // Only fetch if the user is confirmed as admin
    if (user?.role === "admin") fetchIncidents();
  }, [user]);

  // advance moves an incident to the next status in the workflow
  const advance = async (id: string): Promise<void> => {
    const current = incidents.find((i) => i.id === id);
    if (!current) return;

    const STATUS_NEXT: Record<string, string> = {
      new: "dispatched",
      dispatched: "resolved",
      resolved: "resolved",
    };

    const nextStatus = STATUS_NEXT[current.status];

    try {
      // Use dispatch endpoint if an agency is selected and incident is new
      if (selectedAgency && current.status === "new") {
        await dispatchIncident(id, selectedAgency);
      } else {
        // Otherwise update status only
        await updateIncident(id, { status: nextStatus });
      }
      // Refresh the incident list from the backend
      const data = await getIncidents({ limit: 100 });
      setIncidents(data.incidents);
      // Update the selected incident in the detail panel
      const updated = data.incidents.find((i) => i.id === id);
      if (updated) setSelected(updated);
    } catch {
      alert("Failed to update incident. Make sure you are logged in as admin.");
    }
  };

  // filtered is the subset of incidents matching the search text
  const filtered = incidents.filter(
    (inc) =>
      inc.description?.toLowerCase().includes(search.toLowerCase()) ||
      inc.region?.toLowerCase().includes(search.toLowerCase()) ||
      inc.location_text?.toLowerCase().includes(search.toLowerCase())
  );

  // counts summarises how many incidents are in each status
  const counts = {
    new: incidents.filter((i) => i.status === "new").length,
    dispatched: incidents.filter((i) => i.status === "dispatched").length,
    resolved: incidents.filter((i) => i.status === "resolved").length,
  };

  // Don't render until we confirm the user is an admin
  if (!user || user.role !== "admin") return null;

  return (
    // Page wrapper — uses flex to sit the content beside the sidebar
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Fixed left-side admin sidebar navigation */}
      <AdminSidebar />

      {/* Main content area — offset to the right of the sidebar */}
      <main
        className="flex-1 overflow-auto"
        style={{
          // Offset matches the default sidebar width of 240px
          marginLeft: "240px",
          padding: "32px 40px",
          transition: "margin-left 0.2s ease",
        }}
      >
        {/* Page header with title and status counts */}
        <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--red)" }}>Admin Portal</p>
            <h1 className="font-extrabold" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,3vw,42px)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Kasoa Command Center
            </h1>
          </div>

          {/* Status count cards */}
          <div className="flex gap-3">
            {([
              { label: "New", count: counts.new, color: "var(--red)" },
              { label: "Dispatched", count: counts.dispatched, color: "var(--orange)" },
              { label: "Resolved", count: counts.resolved, color: "var(--green)" },
            ] as { label: string; count: number; color: string }[]).map(({ label, count, color }) => (
              <div key={label} className="rounded-xl px-5 py-3 text-center min-w-[88px]" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="text-2xl font-extrabold" style={{ fontFamily: "Syne, sans-serif", color }}>{count}</div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-panel incident command center */}
        <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row" style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: "560px" }}>

          {/* Left: Incident list panel */}
          <div className="flex-1 flex flex-col" style={{ borderRight: "1px solid var(--border)" }}>
            {/* Search input */}
            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <input
                type="text"
                className="form-input text-sm"
                placeholder="Search incidents or Kasoa town…"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </div>

            {/* Scrollable incident rows */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>Loading incidents…</div>
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>No incidents found.</div>
              ) : (
                filtered.map((inc) => (
                  <div
                    key={inc.id}
                    onClick={() => { setSelected(inc); setSelectedAgency(""); }}
                    className="px-5 py-4 flex items-start gap-3 cursor-pointer transition-colors duration-150"
                    style={{ borderBottom: "1px solid var(--border)", background: selected?.id === inc.id ? "var(--surface2)" : "transparent" }}
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: TYPE_COLOR[inc.type as IncidentType], boxShadow: `0 0 5px ${TYPE_COLOR[inc.type as IncidentType]}` }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium mb-0.5 truncate">{inc.description}</div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>{inc.region} · {new Date(inc.created_at).toLocaleTimeString()}</div>
                    </div>
                    <span className={`badge badge-${inc.status} flex-shrink-0`}>{inc.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Incident detail panel */}
          <div className="w-full lg:w-[380px] flex flex-col">
            {selected ? (
              <div className="p-6 flex flex-col h-full">
                {/* Detail header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-mono mb-1" style={{ color: "var(--text-muted)" }}>{selected.id.slice(0, 8).toUpperCase()}</p>
                    <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{selected.description}</h2>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                </div>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-3 mb-5 rounded-xl p-4" style={{ background: "var(--surface2)" }}>
                  {([
                    ["Type", selected.type],
                    ["Town", selected.region],
                    ["Severity", selected.severity],
                    ["Status", selected.status],
                    ["Location", selected.location_text],
                    ["Agency", selected.assigned_agency ?? "Unassigned"],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label}>
                      <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
                      <p className="text-sm font-medium capitalize" style={{ color: label === "Type" ? TYPE_COLOR[selected.type as IncidentType] : label === "Severity" ? SEV_COLOR[selected.severity as SeverityLevel] : "var(--text-primary)" }}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* Agency assignment */}
                <div className="mb-5">
                  <p className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Assign Agency</p>
                  <select className="form-input text-sm" value={selectedAgency} onChange={(e) => setSelectedAgency(e.target.value)}>
                    <option value="">Select agency…</option>
                    {MOCK_AGENCIES.map((a) => <option key={a.id}>{a.name}</option>)}
                  </select>
                </div>

                {/* Action buttons */}
                <div className="mt-auto flex flex-col gap-2">
                  {selected.status !== "resolved" && (
                    <button className="btn-primary w-full py-3 rounded-xl text-sm" onClick={() => advance(selected.id)}>
                      {selected.status === "new" ? "✅ Verify & Dispatch" : "✅ Mark as Resolved"}
                    </button>
                  )}
                  {selected.status === "resolved" && (
                    <div className="w-full py-3 rounded-xl text-sm text-center font-medium" style={{ background: "var(--green-dim)", color: "var(--green)", border: "1px solid var(--green)" }}>
                      ✓ Incident Resolved
                    </div>
                  )}
                  <Link href="/alerts">
                    <button className="btn-ghost w-full py-2.5 rounded-xl text-sm">🚨 Send Alert for This Incident</button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-10" style={{ color: "var(--text-muted)" }}>
                <div>
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-sm">Select an incident to review and manage</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
