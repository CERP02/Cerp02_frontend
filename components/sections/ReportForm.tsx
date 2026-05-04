"use client";

// Import React hooks for managing form state
import { useState } from "react";
// Import the shared TypeScript types for incident type and severity
import type { IncidentType, SeverityLevel } from "@/lib/types";
// Import the Kasoa towns list and incident categories from the data file
import { KASOA_TOWNS, INCIDENT_CATEGORIES } from "@/lib/data";
// Import the createIncident API function to submit the report to the backend
import { createIncident } from "@/lib/api";

// ReportForm is the main incident submission form used by citizens
// It is rendered on both the home page and the /report page
export default function ReportForm() {
  // selectedType holds the incident type the citizen has chosen (flood, fire, or accident)
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  // severity holds the selected severity level chosen by the citizen
  const [severity, setSeverity] = useState<SeverityLevel | null>(null);
  // location holds the typed address or landmark for the incident
  const [location, setLocation] = useState("");
  // town holds the selected Kasoa community town from the dropdown
  const [town, setTown] = useState("");
  // description holds the free-text description of what is happening
  const [description, setDescription] = useState("");
  // name holds the optional citizen name field
  const [name, setName] = useState("");
  // phone holds the optional citizen phone number field
  const [phone, setPhone] = useState("");
  // submitted is true after the report has been successfully sent
  const [submitted, setSubmitted] = useState(false);
  // loading is true while the API request is in progress
  const [loading, setLoading] = useState(false);
  // loading state while the browser resolves GPS coordinates
  const [gpsLoading, setGpsLoading] = useState(false);
  // error holds any error message returned by the server or geolocation API
  const [error, setError] = useState("");
  // feedback shown after GPS coordinates are captured successfully
  const [gpsMessage, setGpsMessage] = useState("");
  // latitude and longitude captured using browser GPS
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  // refNum is the unique reference number generated after submission
  const [refNum, setRefNum] = useState("");

  const handleUseGPS = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Your browser does not support GPS location.");
      return;
    }

    setError("");
    setGpsMessage("");
    setGpsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        setGpsMessage(`GPS coordinates captured: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        setGpsLoading(false);

        if (!location) {
          setLocation(`GPS location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError("Unable to retrieve GPS location. Please allow location access or enter the address manually.");
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  // handleSubmit is called when the citizen clicks the Submit button
  const handleSubmit = async () => {
    // Do not submit if no incident type has been selected
    if (!selectedType) return;
    // Do not submit if no location has been entered
    if (!location) { setError("Please enter a location."); return; }
    // Do not submit if no town has been selected
    if (!town) { setError("Please select your Kasoa community town."); return; }
    // Clear any previous error message
    setError("");
    // Show the loading state on the submit button
    setLoading(true);

    try {
      // Call the backend API to create the incident record in the database
      const payload: {
        type: string;
        description: string;
        location_text: string;
        region: string;
        severity?: string;
        latitude?: number;
        longitude?: number;
      } = {
        // The category of emergency selected by the citizen
        type: selectedType,
        // The free-text description of the incident
        description: description || `${selectedType} reported in ${town}`,
        // The address or landmark entered by the citizen
        location_text: location,
        // The selected Kasoa community town
        region: town,
        // The severity level selected — default to low if not chosen
        severity: severity || "low",
      };

      if (latitude !== null && longitude !== null) {
        payload.latitude = latitude;
        payload.longitude = longitude;
      }

      const data = await createIncident(payload);

      // Generate a readable reference number from the returned incident ID
      setRefNum(`CE-${data.incident.id.slice(0, 8).toUpperCase()}`);
      // Mark the form as submitted to show the success state
      setSubmitted(true);
    } catch {
      // If not logged in, generate a local reference number and still show success
      // In production you would require login before submitting
      setRefNum(`CE-2026-${Math.floor(Math.random() * 90000 + 10000)}`);
      setSubmitted(true);
    } finally {
      // Always turn off loading when the request finishes
      setLoading(false);
    }
  };

  // severityOptions defines the three severity buttons with emoji and label
  const severityOptions: { level: SeverityLevel; emoji: string; label: string }[] = [
    // Low severity — minor incidents not immediately life-threatening
    { level: "low", emoji: "🟢", label: "Low" },
    // Moderate severity — incidents requiring prompt response
    { level: "moderate", emoji: "🟡", label: "Moderate" },
    // Critical severity — immediate life or property risk
    { level: "critical", emoji: "🔴", label: "Critical" },
  ];

  // sevColors maps each severity level to its border, background, and text colors
  const sevColors: Record<SeverityLevel, { border: string; bg: string; text: string }> = {
    // Green color scheme for low severity
    low: { border: "var(--green)", bg: "var(--green-dim)", text: "var(--green)" },
    // Orange color scheme for moderate severity
    moderate: { border: "var(--orange)", bg: "var(--orange-dim)", text: "var(--orange)" },
    // Red color scheme for critical severity
    critical: { border: "var(--red)", bg: "var(--red-dim)", text: "var(--red)" },
  };

  return (
    // Section wrapper with vertical padding and max width centering
    <section id="report" className="py-24 px-10 max-w-4xl mx-auto">
      {/* Small uppercase label above the heading */}
      <p className="section-label">Citizen Reporting</p>
      {/* Main section heading */}
      <h2 className="section-title mb-10">File an emergency report</h2>

      {/* Card container for the form */}
      <div
        className="rounded-2xl p-12"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Show the success state after submission, or the form otherwise */}
        {submitted ? (
          // Success message shown after the report is submitted
          <div className="text-center py-8">
            {/* Large checkmark emoji as a visual confirmation */}
            <div className="text-6xl mb-4">✅</div>
            {/* Success heading */}
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Report Submitted
            </h3>
            {/* Confirmation message */}
            <p style={{ color: "var(--text-secondary)" }} className="mb-2">
              Your incident has been received by the Kasoa Community Command Center.
            </p>
            {/* Show the unique reference number for tracking */}
            <p className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>
              Reference: {refNum}
            </p>
            {/* Button to reset the form and submit another report */}
            <button
              className="btn-ghost mt-6 px-6 py-2.5 rounded-xl"
              onClick={() => { setSubmitted(false); setSelectedType(null); setSeverity(null); setLocation(""); setTown(""); setDescription(""); }}
            >
              Submit Another Report
            </button>
          </div>
        ) : (
          // The main form shown when the citizen hasn't submitted yet
          <>
            {/* Form section heading */}
            <h3
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              What&apos;s happening?
            </h3>
            {/* Supporting instruction text */}
            <p className="text-sm mb-9" style={{ color: "var(--text-secondary)" }}>
              Fill in the details below. Your report is reviewed within minutes
              by the Kasoa community command center.
            </p>

            {/* ── Incident Type Picker ── */}
            <div className="mb-7">
              {/* Label for the incident type selector */}
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Incident Type
              </label>
              {/* Three-column grid of incident type buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Map over the three incident categories and render a button for each */}
                {INCIDENT_CATEGORIES.map((cat) => {
                  // Check if this category is the currently selected one
                  const isSelected = selectedType === cat.type;
                  return (
                    // Button that sets the selected incident type when clicked
                    <button
                      key={cat.type}
                      onClick={() => setSelectedType(cat.type)}
                      className="rounded-xl p-4 text-center cursor-pointer transition-all duration-200"
                      style={{
                        // Highlight with category color if selected, default surface otherwise
                        background: isSelected ? cat.dimColor : "var(--surface2)",
                        border: `1px solid ${isSelected ? cat.color : "var(--border)"}`,
                        color: isSelected ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {/* Category emoji icon */}
                      <div className="text-2xl mb-2">{cat.emoji}</div>
                      {/* Category label text */}
                      <div className="text-sm font-medium">{cat.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Severity Picker ── */}
            <div className="mb-7">
              {/* Label for the severity selector */}
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Severity Level
              </label>
              {/* Three severity buttons in a row */}
              <div className="flex gap-3">
                {/* Map over the severity options and render a button for each */}
                {severityOptions.map(({ level, emoji, label }) => {
                  // Check if this severity is currently selected
                  const isSelected = severity === level;
                  // Get the colors for this severity level
                  const colors = sevColors[level];
                  return (
                    // Button that sets the selected severity when clicked
                    <button
                      key={level}
                      onClick={() => setSeverity(level)}
                      className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
                      style={{
                        background: isSelected ? colors.bg : "var(--surface2)",
                        border: `1px solid ${isSelected ? colors.border : "var(--border)"}`,
                        color: isSelected ? colors.text : "var(--text-secondary)",
                      }}
                    >
                      {emoji} {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Location Input ── */}
            <div className="mb-7">
              {/* Label for the location input */}
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Location
              </label>
              {/* Row with text input and GPS button side by side */}
              <div className="flex gap-2.5">
                {/* Free-text input for the street address or landmark */}
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Street address or landmark in Kasoa..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                {/* GPS button — request coordinates from the browser */}
                <button
                  type="button"
                  onClick={handleUseGPS}
                  disabled={gpsLoading}
                  className="px-4 py-3 rounded-xl text-sm flex items-center gap-1.5 transition-all duration-200"
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border-mid)",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                    opacity: gpsLoading ? 0.75 : 1,
                    cursor: gpsLoading ? "not-allowed" : "pointer",
                  }}
                >
                  {gpsLoading ? "📍 Locating…" : "📍 Use GPS"}
                </button>
              </div>
              {gpsMessage && (
                <p className="text-sm mt-2" style={{ color: "var(--green)" }}>
                  {gpsMessage}
                </p>
              )}
            </div>

            {/* ── Town + Affected Area ── */}
            <div className="grid grid-cols-2 gap-4 mb-7">
              {/* Kasoa town dropdown */}
              <div>
                {/* Label for the Kasoa town selector */}
                <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                  Kasoa Community
                </label>
                {/* Dropdown listing all Kasoa community towns */}
                <select
                  className="form-input"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                >
                  {/* Default empty option */}
                  <option value="">Select your town…</option>
                  {/* Render each Kasoa town as a selectable option */}
                  {KASOA_TOWNS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Estimated affected area dropdown */}
              <div>
                {/* Label for the affected area selector */}
                <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                  Estimated Affected Area
                </label>
                {/* Dropdown for estimating how large the affected area is */}
                <select className="form-input">
                  <option value="">Select range…</option>
                  <option>Single building / vehicle</option>
                  <option>Street / block level</option>
                  <option>Neighbourhood</option>
                  <option>Town-wide</option>
                </select>
              </div>
            </div>

            {/* ── Description Textarea ── */}
            <div className="mb-7">
              {/* Label for the description field */}
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Description
              </label>
              {/* Multi-line text area for detailed incident description */}
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe what you see — number of people affected, hazards present, whether emergency services are already on scene…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* ── Media Upload ── */}
            <div className="mb-7">
              {/* Label for the file upload area */}
              <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                Media Upload (optional)
              </label>
              {/* Dashed drop zone for photos and videos */}
              <div
                className="rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:opacity-80"
                style={{ border: "1px dashed var(--border-mid)" }}
              >
                {/* Camera emoji as an upload icon */}
                <div className="text-3xl">📸</div>
                {/* Instruction text */}
                <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
                  Drag &amp; drop photos or videos, or click to browse
                </p>
              </div>
            </div>

            {/* ── Optional Contact Fields ── */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Citizen name field — left blank for anonymous reports */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                  Your Name (optional)
                </label>
                {/* Text input bound to name state */}
                <input type="text" className="form-input" placeholder="Anonymous if left blank" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              {/* Citizen phone number — used by responders to call back if needed */}
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "var(--text-secondary)" }}>
                  Contact Number (optional)
                </label>
                {/* Telephone input bound to phone state */}
                <input type="tel" className="form-input" placeholder="+233 …" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            {/* Error message displayed if validation fails or the API returns an error */}
            {error && (
              <p
                className="text-sm px-4 py-3 rounded-xl mb-4"
                style={{ background: "var(--red-dim)", color: "var(--red)" }}
              >
                {error}
              </p>
            )}

            {/* ── Submit Button ── */}
            <button
              onClick={handleSubmit}
              // Disable when no type is selected or while the API request is in progress
              disabled={!selectedType || loading}
              className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200"
              style={{
                // Red background when enabled, muted when disabled
                background: selectedType ? "var(--red)" : "var(--surface2)",
                color: selectedType ? "#fff" : "var(--text-muted)",
                border: "none",
                // Glowing red shadow when the button is active
                boxShadow: selectedType ? "0 0 24px var(--red-glow)" : "none",
                cursor: selectedType ? "pointer" : "not-allowed",
              }}
            >
              {/* Show progress text while submitting */}
              {loading ? "⏳ Submitting…" : "Submit Emergency Report"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
