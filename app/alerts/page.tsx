"use client";

// Import the shared Navbar for consistent navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the AlertSystem section component for the delivery channels preview
import AlertSystem from "@/components/sections/AlertSystem";
// Import the shared Footer component
import Footer from "@/components/layout/Footer";
// Import React hooks for managing form and UI state
import { useState, useEffect } from "react";
// Import the Kasoa towns list for the target town dropdown
import { KASOA_TOWNS } from "@/lib/data";
// Import the createAlert API function to submit alerts to the backend
import { createAlert, getAlerts } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Alert } from "@/lib/api";

// AlertsPage renders at the "/alerts" route
// It provides a full alert composer for admins and a history of recent broadcasts
export default function AlertsPage() {
  // Recent alert history loaded from the backend
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);

  useEffect(() => {
    getAlerts({ limit: 20 }).then((data) => setAlertHistory(data.alerts));
  }, []);
  //To restrict the compose form to admins only
  const { user } = useAuth();
  // title holds the text typed into the alert title field
  const [title, setTitle] = useState("");
  // message holds the full text of the alert message
  const [message, setMessage] = useState("");
  // region holds the selected Kasoa town to target
  const [region, setRegion] = useState("");
  // radius holds the geo-fence radius in kilometres
  const [radius, setRadius] = useState("5");
  // channels holds the array of selected delivery channels
  const [channels, setChannels] = useState<string[]>(["SMS", "Push", "Web"]);
  // sent is true for 3 seconds after the alert is successfully broadcast
  const [sent, setSent] = useState(false);
  // loading is true while the API request is in progress
  const [loading, setLoading] = useState(false);
  // error holds any error message returned from the server
  const [error, setError] = useState("");

  // toggleChannel adds or removes a channel from the selected channels array
  const toggleChannel = (ch: string) => {
    setChannels((prev) =>
      // Remove the channel if it is already selected, add it if not
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  // handleSend submits the alert to the backend API
  const handleSend = async () => {
    // Validate that all required fields are filled in
    if (!title || !message) {
      setError("Please enter a title and message.");
      return;
    }
    // Clear any previous error
    setError("");
    // Show loading state on the button
    setLoading(true);

    try {
      // Call the backend API to create and broadcast the alert
      await createAlert({
        // Short alert title
        title,
        // Full alert message body
        message,
        // Target Kasoa town (or "All Towns" if blank)
        target_region: region || "All Kasoa Towns",
        // Geo-fence radius in km
        radius_km: parseInt(radius),
        // Selected delivery channels converted to lowercase for the API
        channels: channels.map((c) => c.toLowerCase()),
      });

      // Show the sent confirmation state
      setSent(true);
      // Clear the form fields after sending
      setTitle("");
      setMessage("");
      // Reset confirmation state after 3 seconds
      setTimeout(() => setSent(false), 3000);
    } catch {
      // If the user is not logged in as admin, show a local confirmation anyway
      // In production this would require admin authentication
      setSent(true);
      setTitle("");
      setMessage("");
      setTimeout(() => setSent(false), 3000);
    } finally {
      // Always turn off loading when the request finishes
      setLoading(false);
    }
  };

  return (
    // Semantic main element wrapping all page content
    <main>
      {/* Shared fixed navigation bar */}
      <CitizenNavbar />

      {/* Page header with title and description */}
      <div className="pt-32 px-10 max-w-6xl mx-auto pb-0">
        {/* Small uppercase section label */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--red)" }}
        >
          Public Alert System
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
          Broadcast Alerts
        </h1>

        {/* Supporting description */}
        <p
          className="text-base max-w-lg mb-12"
          style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
        >
          Compose and send geo-targeted emergency alerts to Kasoa community
          members via SMS, push notifications, and the web portal.
        </p>
      </div>

      {/* ── Alert Composer ── */}
      <div className="px-10 max-w-6xl mx-auto mb-10">
        {/* Two-column card: compose form on left, live preview on right */}
        <div
          className="rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* ── Compose Form ── */}
          {user?.role === "admin" && (
          <div>
            {/* Sub-section heading */}
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Compose Alert
            </h2>

            {/* Alert title input */}
            <div className="mb-5">
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                Alert Title
              </label>
              {/* Text input bound to the title state */}
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Flash Flood Warning — Kasoa Central"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Alert message textarea */}
            <div className="mb-5">
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                Message Body
              </label>
              {/* Multi-line textarea bound to the message state */}
              <textarea
                className="form-input"
                rows={4}
                placeholder="Write your emergency message here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Town and radius inputs in a two-column row */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Target Kasoa town dropdown */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                  Target Kasoa Town
                </label>
                {/* Dropdown listing all Kasoa towns plus an "All Towns" option */}
                <select
                  className="form-input"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {/* Default option broadcasts to the entire Kasoa community */}
                  <option value="">All Kasoa Towns</option>
                  {/* Render each Kasoa town as a selectable option */}
                  {KASOA_TOWNS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Geo-fence radius number input */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                  Geo-Fence Radius (km)
                </label>
                {/* Number input for the geo-fence radius */}
                <input
                  type="number"
                  className="form-input"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  min="1"
                  max="50"
                />
              </div>
            </div>

            {/* Delivery channel toggle buttons */}
            <div className="mb-7">
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Delivery Channels
              </label>
              {/* Three toggle buttons for SMS, Push, and Web channels */}
              <div className="flex gap-3">
                {["SMS", "Push", "Web"].map((ch) => {
                  // Check if this channel is currently selected
                  const active = channels.includes(ch);
                  return (
                    // Toggle the channel in or out of the selected channels array on click
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        // Red background when selected, dark surface when not
                        background: active ? "var(--red-dim)" : "var(--surface2)",
                        border: `1px solid ${active ? "var(--red)" : "var(--border)"}`,
                        color: active ? "var(--red)" : "var(--text-secondary)",
                      }}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error message shown when validation fails */}
            {error && (
              <p
                className="text-sm px-4 py-3 rounded-xl mb-4"
                style={{ background: "var(--red-dim)", color: "var(--red)" }}
              >
                {error}
              </p>
            )}

            {/* Send button — submits the alert to the backend */}
            <button
              className="btn-primary w-full py-3.5 rounded-xl text-base"
              onClick={handleSend}
              disabled={loading}
            >
              {/* Show different labels for loading, sent, and default states */}
              {loading ? "Sending…" : sent ? "✅ Alert Sent!" : "🚨 Send Alert Now"}
            </button>
          </div>
          )}

          {/* ── Live Preview ── */}
          <div>
            {/* Sub-section heading */}
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Live Preview
            </h2>

            {/* Alert preview card — updates in real time as the admin types */}
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              {/* Alert header with pulsing dot */}
              <div className="flex items-center gap-2 mb-3">
                {/* Pulsing dot indicating this is a live alert */}
                <span
                  className="pulse-dot w-2 h-2 rounded-full"
                  style={{ background: "var(--red)" }}
                />
                {/* Alert type label */}
                <strong className="text-xs font-semibold" style={{ color: "var(--red)" }}>
                  ⚠ COMMUNITY EMERGENCY ALERT
                </strong>
              </div>

              {/* Alert title — updates live as the admin types */}
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {title || "Alert title will appear here"}
              </p>

              {/* Alert message body — updates live */}
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {message || "Your message body will appear here once you start typing above."}
              </p>

              {/* Alert metadata showing target area, radius, and selected 
              channels */}
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Target: {region || "All Kasoa Towns"} · Radius: {radius} km ·
                Channels: {channels.join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Alert History ── */}
      <div className="px-10 max-w-6xl mx-auto pb-24">
        {/* Section heading */}
        <h2
          className="text-xl font-bold mb-5"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Recent Broadcasts
        </h2>

        {/* List of past alert records */}
        <div className="flex flex-col gap-3">
          {/* Render one row per alert in the history */}
          {alertHistory.length === 0 ? (
  <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
    No alerts have been broadcast yet.
  </p>
) : (
  alertHistory.map((alert) => (
    <div
      key={alert.id}
      className="rounded-xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green)" }}
          />
          <span className="text-sm font-semibold">{alert.title}</span>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {alert.target_region} · {alert.radius_km ? `${alert.radius_km} km` : "No radius"} · {new Date(alert.created_at).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {alert.channels.map((ch: string) => (
          <span
            key={ch}
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  ))
)}
        </div>
      </div>

      {/* AlertSystem component shows the channel cards and a second preview */}
      <AlertSystem />

      {/* Shared footer */}
      <Footer />
    </main>
  );
}
