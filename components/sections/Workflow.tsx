import { WORKFLOW_STEPS } from "@/lib/data";

export default function Workflow() {
  return (
    <div style={{ padding: "96px 40px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p className="section-label">Response Workflow</p>
        <h2 className="section-title">From report to resolution</h2>
        <p className="section-sub">Every status change is logged with a timestamp. Zero ambiguity, full accountability.</p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0", position: "relative", overflowX: "auto", paddingBottom: "16px" }}>
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.number} style={{ flex: 1, textAlign: "center", position: "relative", minWidth: "140px" }}>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div style={{ position: "absolute", top: "20px", left: "calc(50% + 24px)", right: "-24px", height: "1px", background: "var(--border-mid)" }} />
              )}
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontFamily: "Syne, sans-serif", fontSize: "15px", fontWeight: "700", position: "relative", zIndex: 1, background: i === 0 ? "var(--red)" : "var(--surface)", border: `1px solid ${i === 0 ? "var(--red)" : "var(--border-mid)"}`, color: i === 0 ? "#fff" : "var(--text-secondary)", boxShadow: i === 0 ? "0 0 20px var(--red-glow)" : "none" }}>
                {step.number}
              </div>
              <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>{step.title}</h4>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, padding: "0 8px" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}