"use client";

// Import the shared Navbar component for consistent navigation across the portal
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the Dashboard section component which renders the interactive live map
import Dashboard from "@/components/sections/Dashboard";
// Import the shared Footer component for the bottom of the page
import Footer from "@/components/layout/Footer";
// Import the centralized API helper to fetch community issue data
import { getIncidents } from "@/lib/api";
// Import the shared Incident type definition for proper component typing
import type { Incident } from "@/lib/api";
// Import the shared IssueType and SeverityLevel types for the display colors
import type { IssueType, SeverityLevel } from "@/lib/types";
// Import React hooks for managing the dynamic incident list and search filtering
import { useEffect, useState } from "react";
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

// SEV_COLOR maps each severity level (low, moderate, critical) to its semantic color
const SEV_COLOR: Record<SeverityLevel, string> = {
  // Low severity indicated by a stable green
  low: "var(--green)",
  // Moderate severity indicated by a cautionary orange
  moderate: "var(--orange)",
  // Critical severity indicated by an urgent brand red
  critical: "var(--red)",
};

// DashboardPage renders at the "/dashboard" route of the CIRP application
// It serves as the primary public monitoring interface for the Kasoa community
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  // search stores the current text string typed into the table filter input
  const [search, setSearch] = useState("");
  // incidents stores the full array of community issues fetched from the backend API
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // useEffect hook to fetch the latest incident data and handle auth
  useEffect(() => {
    if (!loading && user?.role === "user") {
      router.push("/");
      return;
    }
    
    // Call the API helper to retrieve the 100 most recent community issue reports
    getIncidents({ limit: 100 }).then((data) => {
      // Update the incidents state with the results from the server
      setIncidents(data.incidents);
    });
  }, [user, loading, router]);

  if (loading || user?.role === "user") return <div className="min-h-screen bg-bg" />;

  // filtered generates a subset of the incidents array matching the current search term
  const filtered = incidents.filter(
    (inc) =>
      // Check if the issue description contains the search string (case-insensitive)
      inc.description?.toLowerCase().includes(search.toLowerCase()) ||
      // Check if the Kasoa town name contains the search string
      inc.region?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Semantic main element wrapping all page components for accessibility
    <main>
      {/* Shared fixed navigation bar at the top of the dashboard */}
      <CitizenNavbar />

      {/* Page header section with the dashboard title and context for citizens */}
      <div className="pt-32 pb-8 px-10 max-w-6xl mx-auto">
        {/* Small uppercase label identifying the dashboard context */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--red)" }}
        >
          Community Command Center
        </p>

        {/* Main page heading using the brand typography system */}
        <h1
          className="font-extrabold mb-2"
          style={{
            // Use the Syne font for a bold and modern brand look
            fontFamily: "Syne, sans-serif",
            // Responsive font size scaling
            fontSize: "clamp(36px,5vw,56px)",
            // Tight letter spacing for an authoritative display appearance
            letterSpacing: "-0.02em",
            // Compact line height for short headings
            lineHeight: 1.1,
          }}
        >
          Community Dashboard
        </h1>

        {/* Supporting description explaining the data being viewed */}
        <p
          className="text-base max-w-lg mb-0"
          style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
        >
          Live overview of all reported community issues across the Kasoa community.
          Data is verified and assigned to the relevant utility and municipal agencies.
        </p>
      </div>

      {/* ── Live Issue Map Component ── */}
      {/* The Dashboard section component renders the interactive Mapbox map */}
      <div className="px-10 max-w-6xl mx-auto mb-10">
        <Dashboard incidents={incidents} />
      </div>

      {/* ── Full Community Issue Table ── */}
      <div className="px-10 max-w-6xl mx-auto pb-24">
        {/* Table card container with surface background and border */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Table header area with title and search filtering input */}
          <div
            className="px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            {/* Table heading text */}
            <h2 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
              All Reported Issues
            </h2>

            {/* Search input for dynamic filtering of the issue table */}
            <input
              type="text"
              className="form-input text-sm"
              style={{ width: "260px" }}
              placeholder="Search by description or town…"
              value={search}
              // Update the search state on every keystroke
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Responsive table container with horizontal scroll for mobile devices */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              {/* Semantic table header with column definitions */}
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {/* Map through the column labels to generate header cells */}
                  {['ID', 'Type', 'Location', 'Kasoa Town', 'Severity', 'Status', 'Reported'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold tracking-wider uppercase"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {/* Display the uppercase column label */}
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table body — one row per filtered community issue report */}
              <tbody>
                {filtered.map((inc) => (
                  <tr
                    key={inc.id}
                    className="transition-colors duration-150 cursor-pointer"
                    style={{ borderBottom: "1px solid var(--border)" }}
                    // Highlight the row background when hovered
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "var(--surface2)")
                    }
                    // Reset the background when the mouse leaves the row
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "transparent")
                    }
                  >
                    {/* Unique issue ID in a monospace font for technical clarity */}
                    <td className="px-5 py-4 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                      {/* Show first 8 characters of the UUID for readability */}
                      {inc.id.slice(0, 8).toUpperCase()}
                    </td>

                    {/* Issue category badge with semantic background coloring */}
                    <td className="px-5 py-4">
                      <span
                        className="text-[10px] font-bold uppercase px-2 py-1 rounded"
                        style={{
                          // Apply a 12% transparent version of the category color as background
                          background: `${TYPE_COLOR[inc.type as IssueType]}20`,
                          // Apply the full category color to the text
                          color: TYPE_COLOR[inc.type as IssueType],
                        }}
                      >
                        {/* Display the human-friendly type string */}
                        {inc.type.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Textual location or landmark for the community issue */}
                    <td className="px-5 py-4 font-medium">{inc.location_text}</td>

                    {/* The specific Kasoa community town where the issue was reported */}
                    <td className="px-5 py-4" style={{ color: "var(--text-secondary)" }}>
                      {inc.region}
                    </td>

                    {/* Severity level colored according to the severity theme */}
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-semibold capitalize"
                        style={{ color: SEV_COLOR[inc.severity as SeverityLevel] }}
                      >
                        {/* Display the severity label */}
                        {inc.severity}
                      </span>
                    </td>

                    {/* Workflow status badge using predefined status-specific CSS classes */}
                    <td className="px-5 py-4">
                      <span className={`badge badge-${inc.status}`}>
                        {/* Display the current status in the workflow */}
                        {inc.status.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Formatted timestamp showing when the citizen reported the issue */}
                    <td className="px-5 py-4 text-xs" style={{ color: "var(--text-muted)" }}>
                      {/* Format the ISO date string to a localized date and time */}
                      {new Date(inc.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}

                {/* Feedback row shown when the filtered list is empty */}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {/* Message indicating no issues match the search criteria */}
                      No community issues match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Shared footer displayed at the bottom of the dashboard page */}
      <Footer />
    </main>
  );
}
