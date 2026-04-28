import { KPI_DATA } from "@/lib/data";

const kpiColors = ["var(--red)", "var(--orange)", "var(--green)", "var(--blue)"];

export default function KPIs() {
  return (
    <div style={{ padding: "96px 40px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p className="section-label">Key Performance Indicators</p>
        <h2 className="section-title" style={{ marginBottom: "40px" }}>Measuring what matters</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {KPI_DATA.map((kpi, i) => (
            <div key={kpi.label} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 800, marginBottom: "4px", color: kpiColors[i] }}>
                {kpi.value}<span style={{ fontSize: "18px" }}>{kpi.unit}</span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>{kpi.label}</div>
              <div style={{ fontSize: "12px", fontWeight: 500, color: kpi.up ? "var(--green)" : "var(--red)" }}>
                {kpi.up ? "↑" : "↓"} {kpi.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}