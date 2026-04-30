"use client";

// Import React hooks for state management and side effects
import { useEffect, useState } from "react";
// Import the API function to fetch incidents from the backend
import { getIncidents } from "@/lib/api";
// Import the Incident type from the API module
import type { Incident } from "@/lib/api";
// Import the auth context to check the logged-in responder
import { useAuth } from "@/context/AuthContext";
// Import Next.js router for redirecting unauthenticated users
import { useRouter } from "next/navigation";
// Import CitizenNavbar for navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the updateIncident API function to mark incidents as resolved
import { updateIncident } from "@/lib/api";

// TYPE_COLOR maps each incident type to its display color
const TYPE_COLOR: Record<string, string> = {
  flood: "var(--blue)",
  fire: "var(--red)",
  accident: "var(--orange)",
};

// ResponderPage renders at "/responder"
// It shows dispatched incidents assigned to the logged-in agency
export default function ResponderPage() {
  // incidents holds the list of dispatched incidents fetched from the backend
  const [incidents, setIncidents] = useState<Incident[]>([]);
  // loading is true while fetching incidents
  const [loading, setLoading] = useState(true);
  // updated tracks which incident was just marked resolved for UI feedback
  const [updated, setUpdated] = useState<string | null>(null);

  // Read the logged-in responder from auth context
  const { user } = useAuth();
  // Router for redirecting unauthenticated users
  const router = useRouter();

  // Redirect to login if not authenticated or not a responder
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role === "admin") {
      router.push("/admin");
    }
  }, [user, router]);

  // Fetch dispatched incidents from the backend when the page loads
  useEffect(() => {
    const fetch = async () => {
      try {
        // Get all dispatched incidents from the backend
        const data = await getIncidents({ status: "dispatched", limit: 100 });
        setIncidents(data.incidents);
      } catch {
        console.error("Failed to fetch incidents");
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "responder") fetch();
  }, [user]);

  // handleResolve marks an incident as resolved via the backend API
  const handleResolve = async (id: string) => {
    try {
      // Call PATCH /incidents/:id to update the status to resolved
      await updateIncident(id, { status: "resolved" });
      // Show confirmation message
      setUpdated(id);
      // Remove the resolved incident from the list after 2 seconds
      setTimeout(() => {
        setIncidents((prev) => prev.filter((i) => i.id !== id));
        setUpdated(null);
      }, 2000);
    } catch {
      alert("Failed to update. Make sure you are logged in.");
    }
  };

  // Filter incidents to show only those assigned to this responder's agency
  const myIncidents = incidents.filter((inc) =>
    inc.assigned_agency?.toLowerCase().includes(user?.name?.toLowerCase() || "")
  );

  // Don't render until we confirm the user is a responder
  if (!user || user.role === "admin") return null;

  return (
    // Semantic main element
    <main>
      {/* Citizen navbar for responders */}
      <CitizenNavbar />

      <div style={{ paddingTop: "96px", padding: "96px 40px 60px", maxWidth: "900px", margin: "0 auto" }}>
        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--red)", marginBottom: "8px" }}>
            Responder Portal
          </p>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, marginBottom: "8px", letterSpacing: "-0.02em" }}>
            {user.name}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Showing incidents dispatched to your agency
          </p>
        </div>

        {/* Summary count */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "16px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Count badge */}
          <div
            style={{
              background: "var(--red-dim)",
              color: "var(--red)",
              fontFamily: "Syne, sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {myIncidents.length}
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: "2px" }}>Active dispatched incidents</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Assigned to {user.name}
            </p>
          </div>
        </div>

        {/* Incident list */}
        {loading ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "40px" }}>
            Loading your incidents…
          </p>
        ) : myIncidents.length === 0 ? (
          // Empty state
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
              No active incidents
            </p>
            <p style={{ fontSize: "13px" }}>
              All incidents assigned to your agency have been resolved.
            </p>
          </div>
        ) : (
          // Render one card per dispatched incident
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {myIncidents.map((inc) => (
              <div
                key={inc.id}
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${updated === inc.id ? "var(--green)" : "var(--border)"}`,
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "border-color 0.3s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  {/* Incident details */}
                  <div style={{ flex: 1 }}>
                    {/* Type dot and title row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: TYPE_COLOR[inc.type] || "var(--red)",
                          boxShadow: `0 0 6px ${TYPE_COLOR[inc.type] || "var(--red)"}`,
                          flexShrink: 0,
                        }}
                      />
                      {/* Incident type badge */}
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: `${TYPE_COLOR[inc.type]}20`,
                          color: TYPE_COLOR[inc.type],
                        }}
                      >
                        {inc.type}
                      </span>
                      {/* Severity badge */}
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          background: inc.severity === "critical" ? "var(--red-dim)" : inc.severity === "moderate" ? "var(--orange-dim)" : "var(--green-dim)",
                          color: inc.severity === "critical" ? "var(--red)" : inc.severity === "moderate" ? "var(--orange)" : "var(--green)",
                        }}
                      >
                        {inc.severity}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontWeight: 600, fontSize: "15px", marginBottom: "6px", color: "var(--text-primary)" }}>
                      {inc.description}
                    </p>

                    {/* Location and town */}
                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>
                      📍 {inc.location_text} — {inc.region}
                    </p>

                    {/* Time reported */}
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Reported: {new Date(inc.created_at).toLocaleString()}
                    </p>
                  </div>

                  {/* Action button */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "160px" }}>
                    {updated === inc.id ? (
                      // Show confirmation when resolved
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
                        ✓ Marked Resolved
                      </div>
                    ) : (
                      // Mark as resolved button
                      <button
                        onClick={() => handleResolve(inc.id)}
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
                        ✅ Mark as Resolved
                      </button>
                    )}

                    {/* Reference number */}
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center", fontFamily: "monospace" }}>
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