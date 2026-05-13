import { ISSUE_CATEGORIES } from "@/lib/data";

/**
 * IncidentTypes: Displays the community issue category cards.
 * Highlighting the responsible agencies for each issue type.
 */
export default function IncidentTypes() {
  return (
    <section id="about" className="py-24 px-10 max-w-6xl mx-auto">
      <p className="section-label">Issue Categories</p>
      <h2 className="section-title">Community issues<br />we handle</h2>
      <p className="section-sub">
        CIRP covers the most common community issues in Kasoa. Every report is automatically routed to the right government agency.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ISSUE_CATEGORIES.map((cat) => (
          <div
            key={cat.type}
            className="rounded-2xl p-8 relative overflow-hidden transition-transform duration-200 hover:-translate-y-1 group"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderTop: `3px solid ${cat.color}`,
            }}
          >
            {/* Glow Overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: `inset 0 0 40px ${cat.dimColor}` }}
            />

            <div
              className="w-[52px] h-[52px] rounded-xl flex items-center justify-center mb-6 text-2xl"
              style={{ background: cat.dimColor }}
            >
              {cat.emoji}
            </div>

            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Syne" }}>{cat.label}</h3>

            <p className="text-sm opacity-70 mb-6 leading-relaxed">{cat.description}</p>

            <span
              className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded"
              style={{ background: cat.dimColor, color: cat.color }}
            >
              → {cat.agency}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
