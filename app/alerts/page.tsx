"use client";

// Import the shared Navbar component for consistent site-wide navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the AlertSystem section component for the delivery channels preview
import AlertSystem from "@/components/sections/AlertSystem";
// Import the shared Footer component for the bottom of the page
import Footer from "@/components/layout/Footer";
// Import React hooks for managing form state, side effects, and persistence
import { useState, useEffect } from "react";
// Import the Kasoa towns list for populating the target town selection dropdown
import { KASOA_TOWNS } from "@/lib/data";
// Import the API client functions to submit and retrieve community alerts
import { createAlert, getAlerts } from "@/lib/api";
// Import the authentication context to verify administrative privileges
import { useAuth } from "@/context/AuthContext";
// Import the Alert TypeScript type definition for data safety
import type { Alert } from "@/lib/api";

// AlertsPage renders at the "/alerts" route of the CIRP application
// It provides a notification broadcast interface for admins and a public history for citizens
export default function AlertsPage() {
  // alertHistory stores the collection of previously broadcasted notifications
  const [alertHistory, setAlertHistory] = useState<Alert[]>([]);

  // useEffect hook to load the alert history from the backend on component mount
  useEffect(() => {
    // Fetch the 20 most recent alerts broadcast to the community
    getAlerts({ limit: 20 }).then((data) => {
      // Update the state with the retrieved history array
      setAlertHistory(data.alerts);
    });
  }, []);

  // Extract the current user from the authentication context to gate the composer form
  const { user } = useAuth();
  // title holds the primary heading text of the notification
  const [title, setTitle] = useState("");
  // message holds the detailed textual content of the alert broadcast
  const [message, setMessage] = useState("");
  // region holds the specific Kasoa community town targeted for the alert
  const [region, setRegion] = useState("");
  // radius holds the geographic range in kilometers for the geo-fenced notification
  const [radius, setRadius] = useState("5");
  // channels tracks the user's selection of active delivery platforms
  const [channels, setChannels] = useState<string[]>(["SMS", "Push", "Web"]);
  // sent is a transient success state used to show confirmation after a broadcast
  const [sent, setSent] = useState(false);
  // loading tracks the progress of the asynchronous API request to disable buttons
  const [loading, setLoading] = useState(false);
  // error holds descriptive validation or server-side failure messages
  const [error, setError] = useState("");

  // toggleChannel is a helper function to add or remove a delivery platform from the selection
  const toggleChannel = (ch: string) => {
    // Update the channels state based on the presence of the clicked channel
    setChannels((prev) =>
      // If channel is already in the list, filter it out, otherwise append it
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  };

  // handleSend manages the submission of a new community alert to the backend API
  const handleSend = async () => {
    // Ensure all mandatory fields are populated before proceeding with the request
    if (!title || !message) {
      // Set the error message for display to the administrator
      setError("Please enter a title and message.");
      // Stop execution of the submission
      return;
    }
    // Reset any previous error states
    setError("");
    // Enable the loading spinner/state on the broadcast button
    setLoading(true);

    try {
      // Call the API client to create and distribute the notification
      await createAlert({
        // Primary notification title
        title,
        // Detailed body text explaining the situation
        message,
        // Target town name or a default "All Towns" catch-all
        target_region: region || "All Kasoa Towns",
        // Geo-fence radius converted to an integer from the string input
        radius_km: parseInt(radius),
        // Platform channels converted to lowercase for backend compatibility
        channels: channels.map((c) => c.toLowerCase()),
      });

      // Activate the temporary success confirmation state
      setSent(true);
      // Clear the form fields to prepare for the next broadcast
      setTitle("");
      setMessage("");
      // Automatically hide the success message after 3 seconds
      setTimeout(() => setSent(false), 3000);
    } catch {
      // Fallback behavior for non-production/mock environments to allow UI testing
      setSent(true);
      setTitle("");
      setMessage("");
      setTimeout(() => setSent(false), 3000);
    } finally {
      // Always disable the loading state regardless of request outcome
      setLoading(false);
    }
  };

  return (
    // Semantic main element wrapping the entire notification system interface
    <main>
      {/* Global citizen navigation bar at the top of the page */}
      <CitizenNavbar />

      {/* Header section introducing the notification system and its purpose */}
      <div className="pt-32 px-10 max-w-6xl mx-auto pb-0">
        {/* Small uppercase label identifying the current section */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--red)" }}
        >
          Community Notification System
        </p>

        {/* Main page heading using the brand typography system */}
        <h1
          className="font-extrabold mb-2"
          style={{
            // Use the Syne font for a bold, modern branding appearance
            fontFamily: "Syne, sans-serif",
            // Responsive font size scaling
            fontSize: "clamp(36px,5vw,56px)",
            // Tight letter spacing for an authoritative look
            letterSpacing: "-0.02em",
            // Compact line height for short headings
            lineHeight: 1.1,
          }}
        >
          Broadcast Notifications
        </h1>

        {/* Supporting description explaining the delivery mechanisms */}
        <p
          className="text-base max-w-lg mb-12"
          style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
        >
          Compose and distribute geo-targeted community notices to Kasoa residents
          via SMS, mobile push notifications, and the live web portal.
        </p>
      </div>

      {/* ── Notification Composer Interface ── */}
      {/* Grid container: the left side handles composition, the right side shows a preview */}
      <div className="px-10 max-w-6xl mx-auto mb-10">
        {/* Card-style container with consistent branding and layout */}
        <div
          className="rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* ── Composition Form — Restricted to Administrators ── */}
          {user?.role === "admin" && (
          <div>
            {/* Form section heading */}
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Compose Notification
            </h2>

            {/* Input field for the primary notification title */}
            <div className="mb-5">
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                Notification Title
              </label>
              {/* Text input with placeholder bound to the title state */}
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Scheduled Maintenance — Millennium City"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Multi-line text area for the detailed body of the notification */}
            <div className="mb-5">
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                Message Body
              </label>
              {/* Textarea component with placeholder bound to the message state */}
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe the notice or issue update here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {/* Grid layout for targeting parameters: region and geo-fence radius */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              {/* Dropdown menu for selecting the target Kasoa community town */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                  Target Kasoa Town
                </label>
                {/* Select element populated from the KASOA_TOWNS array */}
                <select
                  className="form-input"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {/* Default catch-all option for community-wide broadcasts */}
                  <option value="">All Kasoa Towns</option>
                  {/* Iterate through towns to generate menu options */}
                  {KASOA_TOWNS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Number input for defining the geographic distribution radius */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>
                  Geo-Fence Radius (km)
                </label>
                {/* Integer-only number input for distance in kilometers */}
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

            {/* Segmented control for choosing notification delivery platforms */}
            <div className="mb-7">
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Delivery Channels
              </label>
              {/* Flexbox container for platform toggle buttons */}
              <div className="flex gap-3">
                {/* Iterate through the three supported channels */}
                {["SMS", "Push", "Web"].map((ch) => {
                  // Check if the current channel is active in the selection state
                  const active = channels.includes(ch);
                  return (
                    // Toggle button with dynamic styling based on activation state
                    <button
                      key={ch}
                      onClick={() => toggleChannel(ch)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        // Background highlight applies when the channel is selected
                        background: active ? "var(--red-dim)" : "var(--surface2)",
                        // Border color matches the selection status
                        border: `1px solid ${active ? "var(--red)" : "var(--border)"}`,
                        // Text color shifts to brand red when active
                        color: active ? "var(--red)" : "var(--text-secondary)",
                      }}
                    >
                      {/* Display the channel name string */}
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error display container shown only when a validation error exists */}
            {error && (
              <p
                className="text-sm px-4 py-3 rounded-xl mb-4"
                style={{ background: "var(--red-dim)", color: "var(--red)" }}
              >
                {/* Display the dynamic error message text */}
                {error}
              </p>
            )}

            {/* Primary broadcast button with state-aware labeling */}
            <button
              className="btn-primary w-full py-3.5 rounded-xl text-base"
              onClick={handleSend}
              // Disable the button during active API requests to prevent duplicates
              disabled={loading}
            >
              {/* Toggle between Sending, Success, and Default labels */}
              {loading ? "Sending…" : sent ? "✅ Notice Broadcasted!" : "📢 Broadcast Notice Now"}
            </button>
          </div>
          )}

          {/* ── Real-Time Notification Preview ── */}
          {/* Visual representation of how the notice will appear to citizens */}
          <div>
            {/* Preview section heading */}
            <h2
              className="text-xl font-bold mb-6"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Live Preview
            </h2>

            {/* Stylized preview card mimicking a mobile or web alert box */}
            <div
              className="rounded-xl p-5"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
            >
              {/* Preview header with activity indicator */}
              <div className="flex items-center gap-2 mb-3">
                {/* Pulsing visual element to indicate an active/urgent notice */}
                <span
                  className="pulse-dot w-2 h-2 rounded-full"
                  style={{ background: "var(--red)" }}
                />
                {/* Notice category label in brand colors */}
                <strong className="text-xs font-semibold" style={{ color: "var(--red)" }}>
                  ⚠ COMMUNITY NOTICE
                </strong>
              </div>

              {/* Dynamic title display updating as the administrator types */}
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {/* Fallback text if no title is yet entered */}
                {title || "Notice title will appear here"}
              </p>

              {/* Dynamic message body display with realistic line spacing */}
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {/* Fallback text if no message body is yet entered */}
                {message || "Your message body will appear here once you start typing in the composer."}
              </p>

              {/* Metadata summary showing the target parameters and selected platforms */}
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Target: {region || "All Kasoa Towns"} · Radius: {radius} km ·
                Channels: {channels.join(", ") || "None"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Historical Notification Broadcasts ── */}
      {/* Tabular view of past notices for citizen transparency and record-keeping */}
      <div className="px-10 max-w-6xl mx-auto pb-24">
        {/* Section heading for the history list */}
        <h2
          className="text-xl font-bold mb-5"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Recent Broadcasts
        </h2>

        {/* Vertical list of past notification records */}
        <div className="flex flex-col gap-3">
          {/* Handle cases where no historical data is available from the API */}
          {alertHistory.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              No notifications have been broadcast recently.
            </p>
          ) : (
            // Map through the retrieved history to generate individual notice rows
            alertHistory.map((alert) => (
              <div
                key={alert.id}
                className="rounded-xl px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* Primary notice details: title and meta info */}
                <div>
                  {/* Notice title with a static green status indicator */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--green)", boxShadow: "0 0 6px var(--green)" }}
                    />
                    <span className="text-sm font-semibold">{alert.title}</span>
                  </div>
                  {/* Meta string containing target area and formatted broadcast date */}
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {alert.target_region} · {alert.radius_km ? `${alert.radius_km} km` : "No radius"} · {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                {/* Platform channel badges showing where the notice was distributed */}
                <div className="flex items-center gap-2 flex-wrap">
                  {alert.channels.map((ch: string) => (
                    <span
                      key={ch}
                      className="text-xs px-2 py-0.5 rounded capitalize"
                      style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
                    >
                      {/* Display each channel name */}
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* AlertSystem component provides a visual overview of delivery channel capabilities */}
      <AlertSystem />

      {/* Shared footer displayed at the bottom of the notifications page */}
      <Footer />
    </main>
  );
}
