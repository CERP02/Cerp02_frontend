/**
 * UserRoles: Profiles the three user personas within the CIRP ecosystem.
 */
export default function UserRoles() {
  const roles = [
    { emoji: "👤", title: "Citizens", bgColor: "var(--green-dim)", description: "Report local issues in seconds. No training required.", features: ["One-tap reporting", "Auto GPS sharing", "Photo/video upload", "Track status"] },
    { emoji: "🦺", title: "Responders", bgColor: "var(--orange-dim)", description: "Utility agency field workers addressing issues on the ground.", features: ["View by proximity", "Accept tasks", "Update status", "Offline support"] },
    { emoji: "🛡", title: "Command Center", bgColor: "var(--red-dim)", description: "Kasoa admins with oversight and agency assignment authority.", features: ["Verify reports", "Full dashboard", "Multi-agency assignment", "Audit logs"] },
  ];

  return (
    <section id="users" className="py-24 px-10 max-w-6xl mx-auto">
      <p className="section-label">User Roles</p>
      <h2 className="section-title">Built for everyone in the chain</h2>
      <p className="section-sub">Three distinct portals tailored to each user's specific operational needs.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.title} className="rounded-2xl p-8 bg-surface border border-white/5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6" style={{ background: role.bgColor }}>
              {role.emoji}
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Syne" }}>{role.title}</h3>
            <p className="text-sm opacity-60 mb-6 leading-relaxed">{role.description}</p>
            <ul className="space-y-3">
              {role.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-xs opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}