// Import the incident category data from the shared data file
import { INCIDENT_CATEGORIES } from "@/lib/data";

// IncidentTypes renders the three emergency category cards on the home and about pages
// Each card explains a type of incident and which agency handles it in Kasoa
export default function IncidentTypes() {
  return (
    // Section with vertical padding and centered max width
    <section id="about" className="py-24 px-10 max-w-6xl mx-auto">
      {/* Small uppercase section label */}
      <p className="section-label">Incident Categories</p>

      {/* Section heading */}
      <h2 className="section-title">
        Three critical
        <br />
        emergency types
      </h2>

      {/* Supporting description explaining automatic routing */}
      <p className="section-sub">
        CERP focuses on the highest-impact emergencies in the Kasoa community.
        Every report is automatically routed to the right agency.
      </p>

      {/* Three-column grid of incident type cards — stacks to one column on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Map over INCIDENT_CATEGORIES and render a card for each */}
        {INCIDENT_CATEGORIES.map((cat) => (
          <div
            key={cat.type}
            className="rounded-2xl p-8 relative overflow-hidden cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 group"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              // Colored top border indicates the incident type (blue=flood, red=fire, orange=accident)
              borderTop: `3px solid ${cat.color}`,
            }}
          >
            {/* Hover glow overlay — fades in on mouse over */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
              style={{ boxShadow: `inset 0 0 40px ${cat.dimColor}` }}
            />

            {/* Emoji icon in a colored rounded square */}
            <div
              className="rounded-xl flex items-center justify-center mb-5 text-2xl"
              style={{
                width: "52px",
                height: "52px",
                // Semi-transparent version of the category color as background
                background: cat.dimColor,
              }}
            >
              {/* Category emoji e.g. 🌊 🔥 🚗 */}
              {cat.emoji}
            </div>

            {/* Category name heading */}
            <h3
              className="text-xl font-bold mb-2.5"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              {cat.label}
            </h3>

            {/* Short description of the incident type and how it's handled in Kasoa */}
            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {cat.description}
            </p>

            {/* Agency badge showing which organisation responds to this incident type */}
            <span
              className="text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded"
              style={{
                // Semi-transparent category color as the badge background
                background: cat.dimColor,
                color: cat.color,
              }}
            >
              → {cat.agency}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
