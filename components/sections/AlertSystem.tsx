"use client";

// Import React hooks for managing the send confirmation state
import { useState } from "react";

// channels defines the three delivery methods CERP uses to broadcast alerts
const channels = [
  {
    // Emoji icon for the SMS channel
    emoji: "📱",
    // Channel name shown in the UI
    name: "SMS Broadcast",
    // Brief description of how this channel reaches citizens
    desc: "Reaches all network subscribers in the target Kasoa area",
  },
  {
    emoji: "🔔",
    name: "Push Notification",
    desc: "Instant alerts to CERP mobile app users in Kasoa",
  },
  {
    emoji: "🌐",
    name: "Web Alert Banner",
    desc: "Full-screen warning shown when citizens visit the portal",
  },
];

// AlertSystem renders the alert delivery channels and a preview of a sample alert
// It is shown on the home page and the dedicated /alerts page
export default function AlertSystem() {
  // sent becomes true for 3 seconds after the admin clicks "Send Alert"
  const [sent, setSent] = useState(false);

  return (
    // Section with vertical padding and centered max width
    <section id="alerts" className="py-24 px-10 max-w-6xl mx-auto">
      {/* Small uppercase section label */}
      <p className="section-label">Public Alert System</p>

      {/* Section heading */}
      <h2 className="section-title mb-10">Reach everyone, everywhere</h2>

      {/* Two-column card: channels on left, alert preview on right */}
      <div
        className="rounded-2xl p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {/* ── Delivery Channels ── */}
        <div>
          {/* Sub-section heading */}
          <h3
            className="text-xl font-bold mb-5"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Delivery Channels
          </h3>

          {/* List of delivery channel cards */}
          <div className="flex flex-col gap-3">
            {/* Render one card per delivery channel */}
            {channels.map((ch) => (
              <div
                key={ch.name}
                className="flex items-center gap-4 rounded-xl px-5 py-4"
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Emoji icon in a red-tinted rounded square */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "var(--red-dim)" }}
                >
                  {ch.emoji}
                </div>

                {/* Channel name and description */}
                <div className="flex-1">
                  {/* Bold channel name */}
                  <strong className="block text-sm font-semibold mb-0.5">
                    {ch.name}
                  </strong>
                  {/* Muted description of how the channel works */}
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {ch.desc}
                  </span>
                </div>

                {/* Green dot indicating the channel is live and operational */}
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background: "var(--green)",
                    boxShadow: "0 0 6px var(--green)",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Alert Preview ── */}
        <div>
          {/* Sub-section heading */}
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Alert Preview
          </h3>

          {/* Explanation of how admins compose and send geo-fenced alerts */}
          <p
            className="text-sm mb-5 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Admins compose geo-fenced alerts that go out to specific Kasoa
            towns or radius-based audiences in seconds.
          </p>

          {/* Sample alert card showing what a broadcast looks like */}
          <div
            className="rounded-xl p-5 mb-5"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
            }}
          >
            {/* Alert header row with pulsing dot and alert label */}
            <div className="flex items-center gap-2 mb-3">
              {/* Pulsing red dot indicating a live active alert */}
              <span
                className="pulse-dot w-2 h-2 rounded-full"
                style={{ background: "var(--red)" }}
              />
              {/* Alert type label */}
              <strong
                className="text-xs font-semibold"
                style={{ color: "var(--red)" }}
              >
                ⚠ COMMUNITY EMERGENCY ALERT
              </strong>
            </div>

            {/* Sample alert message body */}
            <p
              className="text-sm leading-relaxed mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Flash flood warning active for{" "}
              {/* Bolded town name for emphasis */}
              <strong style={{ color: "var(--text-primary)" }}>
                Millennium City, Kasoa
              </strong>
              . Residents near low-lying areas should move to higher ground
              immediately. Avoid all flooded roads.
            </p>

            {/* Alert metadata: issuer, target area, radius, and time */}
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Issued by: Kasoa Command Center · Radius: 5 km · 2 min ago
            </p>
          </div>

          {/* Action buttons for sending and configuring alerts */}
          <div className="flex gap-3 flex-wrap">
            {/* Primary send button — shows confirmation for 3 seconds when clicked */}
            <button
              className="btn-primary px-5 py-2.5 rounded-xl text-sm"
              onClick={() => {
                // Set sent to true to show the confirmation state
                setSent(true);
                // Reset back to normal after 3 seconds
                setTimeout(() => setSent(false), 3000);
              }}
            >
              {/* Toggle between send label and confirmation label */}
              {sent ? "✅ Alert Sent!" : "Send Community Alert"}
            </button>

            {/* Secondary button for configuring the geo-fence boundary */}
            <button className="btn-ghost px-5 py-2.5 rounded-xl text-sm">
              Set Geo-Fence
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
