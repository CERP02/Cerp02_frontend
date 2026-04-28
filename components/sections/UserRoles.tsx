const roles = [
  { emoji: "👤", title: "Citizens", bgColor: "var(--green-dim)", description: "Any community member can report an incident in seconds, no training required.", features: ["One-tap incident reporting", "Auto GPS location share", "Photo & video upload", "Receive evacuation alerts", "Track report status"] },
  { emoji: "🦺", title: "Responders", bgColor: "var(--orange-dim)", description: "Fire, ambulance, road safety, and disaster agencies on the ground in Kasoa.", features: ["View incidents by proximity", "Accept dispatch assignments", "Real-time status updates", "Coordinate with command center", "Offline-capable mobile view"] },
  { emoji: "🛡", title: "Command Center", bgColor: "var(--red-dim)", description: "Kasoa admins with full oversight and broadcast authority.", features: ["Verify & classify all reports", "Community live dashboard", "Multi-agency dispatch", "Geo-fenced alert broadcasts", "Audit logs & analytics"] },
];

export default function UserRoles() {
  return (
    <section id="users" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
      <p className="section-label">User Roles</p>
      <h2 className="section-title">Built for everyone in the chain</h2>
      <p className="section-sub">Three distinct portals — each tailored to what that user needs in an emergency moment.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {roles.map((role) => (
          <div key={role.title} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "32px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", marginBottom: "20px", background: role.bgColor }}>{role.emoji}</div>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>{role.title}</h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>{role.description}</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {role.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--text-muted)", flexShrink: 0 }} />{f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}