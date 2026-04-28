import { ROADMAP_PHASES } from "@/lib/data";

export default function Roadmap() {
  return (
    <section style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <p className="section-label">Roadmap</p>
      <h2 className="section-title">Deployment Phases</h2>
      <p className="section-sub">A practical Kasoa rollout in three phases designed for scale and resilience.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {ROADMAP_PHASES.map((phase) => (
          <div key={phase.number} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", padding: "28px 32px", display: "flex", gap: "28px", alignItems: "flex-start" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0, background: "var(--red-dim)", border: "1px solid rgba(255,59,59,0.2)", color: "var(--red)", fontFamily: "Syne, sans-serif" }}>
              {phase.number}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                {phase.title}{" "}
                {phase.timeline && <span style={{ fontSize: "13px", fontWeight: 400, color: "var(--text-muted)", fontFamily: "Space Grotesk, sans-serif" }}>{phase.timeline}</span>}
              </h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "12px" }}>{phase.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {phase.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "6px", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}