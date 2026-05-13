import { KPI_DATA } from "@/lib/data";

/**
 * KPIs: Displays performance metrics for the platform rollout.
 */
export default function KPIs() {
  const colors = ["var(--red)", "var(--orange)", "var(--green)", "var(--blue)"];

  return (
    <section className="py-24 px-10 border-y border-white/5 bg-surface">
      <div className="max-w-6xl mx-auto">
        <p className="section-label">Performance Indicators</p>
        <h2 className="section-title mb-10">Measuring what matters</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_DATA.map((kpi, i) => (
            <div key={kpi.label} className="bg-surface2 border border-white/5 rounded-2xl p-6">
              <div className="text-3xl lg:text-4xl font-extrabold mb-1" style={{ fontFamily: "Syne", color: colors[i] }}>
                {kpi.value}<span className="text-lg font-normal">{kpi.unit}</span>
              </div>
              <div className="text-xs opacity-50 mb-3">{kpi.label}</div>
              <div className="text-[11px] font-bold" style={{ color: kpi.up ? "var(--green)" : "var(--red)" }}>
                {kpi.up ? "↑" : "↓"} {kpi.trend}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}