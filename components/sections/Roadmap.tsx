import { ROADMAP_PHASES } from "@/lib/data";

/**
 * Roadmap: Outlines the strategic phases of the platform rollout.
 */
export default function Roadmap() {
  return (
    <section className="py-24 px-10 max-w-6xl mx-auto">
      <p className="section-label">Roadmap</p>
      <h2 className="section-title">Deployment Phases</h2>
      <p className="section-sub">A practical Kasoa rollout designed for maximum community impact.</p>

      <div className="space-y-5">
        {ROADMAP_PHASES.map((phase) => (
          <div key={phase.number} className="bg-surface border border-white/5 rounded-2xl p-8 flex gap-8 items-start">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 bg-red-500/10 border border-red-500/20 text-red-500" style={{ fontFamily: "Syne" }}>
              {phase.number}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Syne" }}>
                {phase.title} {phase.timeline && <span className="text-sm font-normal opacity-40 ml-2">{phase.timeline}</span>}
              </h3>
              <p className="text-sm opacity-70 mb-5 leading-relaxed">{phase.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {phase.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md bg-surface2 border border-white/5 opacity-60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}