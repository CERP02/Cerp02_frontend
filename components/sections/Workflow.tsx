import { WORKFLOW_STEPS } from "@/lib/data";

/**
 * Workflow: Visualizes the 5-step community issue resolution process.
 */
export default function Workflow() {
  return (
    <section className="py-24 px-10 border-y border-white/5" style={{ background: "var(--surface)" }}>
      <div className="max-w-6xl mx-auto">
        <p className="section-label">Resolution Workflow</p>
        <h2 className="section-title">From report to resolution</h2>
        <p className="section-sub">Every status change is logged. Zero ambiguity, full accountability.</p>

        <div className="flex flex-nowrap overflow-x-auto pb-8 relative gap-0">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.number} className="flex-1 min-w-[160px] text-center relative px-2">
              {/* Connector Line */}
              {i < WORKFLOW_STEPS.length - 1 && (
                <div className="absolute top-5 left-[calc(50%+24px)] right-[-24px] h-[1px] bg-white/10 z-0" />
              )}
              
              {/* Step Number Circle */}
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-5 font-bold relative z-10 transition-all"
                style={{ 
                  background: i === 0 ? "var(--red)" : "var(--surface)", 
                  border: `1px solid ${i === 0 ? "var(--red)" : "var(--border-mid)"}`,
                  color: i === 0 ? "white" : "var(--text-secondary)",
                  boxShadow: i === 0 ? "0 0 20px var(--red-glow)" : "none"
                }}
              >
                {step.number}
              </div>

              <h4 className="text-sm font-bold mb-2">{step.title}</h4>
              <p className="text-[11px] opacity-50 leading-relaxed max-w-[140px] mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}