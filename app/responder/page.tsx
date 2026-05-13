"use client";

// Import React hooks for managing state, effects, and redirection
import { useEffect, useState } from "react";
// Import the shared API functions for fetching and updating community issues
import { getIncidents, updateIncident } from "@/lib/api";
// Import the shared Incident type for data structure safety
import type { Incident } from "@/lib/api";
// Import the authentication context to verify the responder's session and agency identity
import { useAuth } from "@/context/AuthContext";
// Import Next.js router for programmatic redirection based on user roles
import { useRouter } from "next/navigation";
// Import the shared CitizenNavbar for consistent layout across responder pages
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the Mapbox dashboard component to visualize incident locations
import Dashboard from "@/components/sections/Dashboard";
// Import TypeScript types for issue category and severity level
import type { IssueType, SeverityLevel } from "@/lib/types";

// TYPE_COLOR maps each of the ten community issue categories to its display color
const TYPE_COLOR: Record<string, string> = {
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

// ResponderPage renders at the "/responder" route for agency field personnel
// It displays community issues assigned to the responder's agency for resolution
export default function ResponderPage() {
  // incidents stores the list of assigned or in-progress issues for the logged-in agency
  const [incidents, setIncidents] = useState<Incident[]>([]);
  // loading is a boolean flag indicating the status of the initial API fetch
  const [loading, setLoading] = useState(true);
  // updated stores the ID of a recently updated issue for transient UI confirmation
  const [updated, setUpdated] = useState<string | null>(null);

  // Extract the current user profile from the global authentication context
  const { user } = useAuth();
  // Instantiate the router for redirection logic
  const router = useRouter();

  // Redirect logic: ensure only responders (utility/agency staff) can access this page
  useEffect(() => {
    // If no user is authenticated, redirect to the general login page
    if (!user) {
      router.push("/login");
    } else if (user.role === "admin") {
      // If the user is an admin, redirect them to the command center portal
      router.push("/admin");
    }
    // Dependency array ensures this runs whenever the user or router objects change
  }, [user, router]);

  // Fetch relevant community issues from the backend when the responder is authenticated
  useEffect(() => {
    // Define the asynchronous fetch operation
    const fetch = async () => {
      try {
        // Request issues that are either newly 'assigned' or already 'in_progress'
        const assignedData = await getIncidents({ status: "assigned", limit: 50 });
        const inProgressData = await getIncidents({ status: "in_progress", limit: 50 });

        // Combine the results into a single task list for the responder
        setIncidents([...assignedData.incidents, ...inProgressData.incidents]);
      } catch {
        // Log an error if the network request or database query fails
        console.error("Failed to fetch tasks from the CIRP backend");
      } finally {
        // Disable the loading spinner once data retrieval is complete
        setLoading(false);
      }
    };
    // Only execute the fetch if the current user has the 'responder' role
    if (user?.role === "responder") fetch();
  }, [user]);

  // handleStatusUpdate manages the progression of an issue through the resolver workflow
  const handleStatusUpdate = async (id: string, nextStatus: "in_progress" | "resolved") => {
    try {
      // Call the API client to patch the issue record with the new status
      await updateIncident(id, { status: nextStatus });
      // Set the transient confirmation state to provide immediate visual feedback
      setUpdated(id);

      // If the issue was resolved, remove it from the list after a brief delay
      if (nextStatus === "resolved") {
        setTimeout(() => {
          // Filter out the resolved issue from the local incidents state
          setIncidents((prev) => prev.filter((i) => i.id !== id));
          // Reset the confirmation highlight
          setUpdated(null);
        }, 2000);
      } else {
        // If moved to in_progress, just refresh the local state status
        setIncidents((prev) => prev.map(inc => inc.id === id ? { ...inc, status: "in_progress" } : inc));
        // Reset confirmation after a second
        setTimeout(() => setUpdated(null), 1000);
      }
    } catch {
      // Alert the responder if the database update fails
      alert("Failed to update status. Please check your network connection.");
    }
  };

  // Filter the fetched issues to show only those matching this responder's agency name
  const myTasks = incidents.filter((inc) => {
    if (!inc.assigned_agency || !user?.name) return false;
    // Perform a robust case-insensitive match between assigned_agency and the responder's organization name
    const assigned = inc.assigned_agency.toLowerCase().trim();
    const responderName = user.name.toLowerCase().trim();
    // Allow matches if either string contains the other (e.g., "Electricity Company of Ghana" vs "Electricity Company of Ghana (ECG)")
    return assigned.includes(responderName) || responderName.includes(assigned);
  });

  // Security check: Don't render any content until the user identity is confirmed as a responder
  if (!user || user.role === "admin") return null;

  return (
    // Semantic main element containing the agency-specific task interface
    <main>
      {/* Standard platform navigation bar displayed at the top of the viewport */}
      <CitizenNavbar />

      {/* Main layout container with responsive padding and maximum width centering */}
      <div style={{ paddingTop: "96px", padding: "96px 40px 60px", maxWidth: "900px", margin: "0 auto" }}>
        {/* Page header displaying the agency name and context */}
        <div style={{ marginBottom: "32px" }}>
          {/* Small uppercase label identifying the current portal zone */}
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--red)", marginBottom: "8px" }}>
            Agency Responder Portal
          </p>
          {/* Main heading showing the name of the responding agency (e.g., GWCL) */}
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            {user.name}
          </h1>
          {/* Informative text describing the contents of the page */}
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Viewing community maintenance tasks assigned to your organization.
          </p>
        </div>

        {/* Summary metric card showing the current tally of active tasks */}
        <div
          style={{
            // Card background color matched to the system surface theme
            background: "var(--surface)",
            // Subtle card border
            border: "1px solid var(--border)",
            // Rounded corners for a modern UI feel
            borderRadius: "12px",
            // Layout spacing and alignment
            padding: "16px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* High-visibility count badge */}
          <div
            style={{
              // Highlight the badge in brand red
              background: "var(--red-dim)",
              color: "var(--red)",
              // Brand typography for the digit
              fontFamily: "Syne, sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              // Fixed dimensions for a perfectly circular or square appearance
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              // Center the count within the badge
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* The dynamic count of tasks assigned to this responder */}
            {myTasks.length}
          </div>
          <div>
            {/* Descriptive label for the task tally */}
            <p style={{ fontWeight: 600, marginBottom: "2px" }}>Pending Community Tasks</p>
            {/* Sub-label clarifying the scope of the count */}
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Actively assigned to {user.name}
            </p>
          </div>
        </div>

        {/* Map visualization of assigned tasks */}
        {!loading && myTasks.length > 0 && (
          <div style={{ height: "400px", marginBottom: "32px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <Dashboard incidents={myTasks} />
          </div>
        )}

        {/* Dynamic task list content based on the loading and data states */}
        {loading ? (
          // Loading placeholder text displayed during API communication
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
            Retrieving assigned tasks…
          </p>
        ) : myTasks.length === 0 ? (
          // Visual empty state shown when no tasks are currently assigned to the agency
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "60px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            {/* Large checkmark emoji signifying a cleared task queue */}
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            {/* Primary message text */}
            <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
              Task Queue Clear
            </p>
            {/* Secondary instruction or context text */}
            <p style={{ fontSize: "13px" }}>
              All issues assigned to your organization have been successfully resolved.
            </p>
          </div>
        ) : (
          // Iterate through the filtered tasks to generate individual task management cards
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myTasks.map((inc) => (
              // Individual task card with status-specific styling
              <div
                key={inc.id}
                style={{
                  background: "var(--surface)",
                  // Highlight the border color when an update has recently occurred
                  border: `1px solid ${updated === inc.id ? "var(--green)" : "var(--border)"}`,
                  borderRadius: "16px",
                  padding: "24px",
                  // Smooth transition for the border color change
                  transition: "border-color 0.3s",
                }}
              >
                {/* Flexbox layout for card contents allowing for responsive wrapping */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  {/* Left Column: Metadata and descriptive details of the community issue */}
                  <div style={{ flex: 1 }}>
                    {/* Header row containing the category indicator and workflow status */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      {/* Visual indicator colored by the issue category */}
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: TYPE_COLOR[inc.type] || "#7f8c8d",
                          boxShadow: `0 0 6px ${TYPE_COLOR[inc.type] || "#7f8c8d"}`,
                          flexShrink: 0,
                        }}
                      />
                      {/* Category badge showing the human-readable issue type */}
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: `${TYPE_COLOR[inc.type]}20`,
                          color: TYPE_COLOR[inc.type],
                        }}
                      >
                        {/* Remove underscores for display */}
                        {inc.type.replace(/_/g, " ")}
                      </span>
                      {/* Severity badge using semantic color coding */}
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: inc.severity === "critical" ? "var(--red-dim)" : inc.severity === "moderate" ? "var(--orange-dim)" : "var(--green-dim)",
                          color: inc.severity === "critical" ? "var(--red)" : inc.severity === "moderate" ? "var(--orange)" : "var(--green)",
                        }}
                      >
                        {inc.severity}
                      </span>
                      {/* Workflow status indicator badge */}
                      <span className={`badge badge-${inc.status}`} style={{ fontSize: "10px", padding: "2px 8px", height: "auto" }}>
                        {inc.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Primary textual description of the reported community issue */}
                    <p style={{ fontWeight: 600, fontSize: "15px", marginBottom: "6px", color: "var(--text-primary)" }}>
                      {inc.description}
                    </p>

                    {/* Location summary detailing the specific address and Kasoa town */}
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      📍 {inc.location_text} — {inc.region}
                    </p>

                    {/* Formatted timestamp showing when the task was initially reported by a citizen */}
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Reported: {new Date(inc.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Right Column: Workflow action buttons for the responder */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "180px" }}>
                    {updated === inc.id ? (
                      // Display a success confirmation after a status update is submitted
                      <div
                        style={{
                          background: "var(--green-dim)",
                          color: "var(--green)",
                          border: "1px solid var(--green)",
                          borderRadius: "10px",
                          padding: "10px 16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          textAlign: "center",
                        }}
                      >
                        ✓ Status Updated
                      </div>
                    ) : (
                      // Vertical list of available workflow actions for the active task
                      <div className="flex flex-col gap-2">
                        {/* Action: Mark as in progress — shown only for newly 'assigned' tasks */}
                        {inc.status === "assigned" && (
                          <button
                            onClick={() => handleStatusUpdate(inc.id, "in_progress")}
                            className="btn-primary"
                            style={{
                              padding: "10px 16px",
                              fontSize: "13px",
                              fontWeight: 600,
                              borderRadius: "10px",
                            }}
                          >
                            🛠 Start Work
                          </button>
                        )}
                        {/* Action: Mark as resolved — shown for issues where work has commenced */}
                        <button
                          onClick={() => handleStatusUpdate(inc.id, "resolved")}
                          style={{
                            background: "var(--green)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            padding: "10px 16px",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          ✅ Complete & Resolve
                        </button>
                      </div>
                    )}

                    {/* Reference number in monospace font for technical coordination */}
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", fontFamily: "monospace", marginTop: "4px" }}>
                      REF: {inc.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}