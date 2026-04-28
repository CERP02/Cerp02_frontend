"use client";

// Import Next.js Link for client-side navigation between admin pages
import Link from "next/link";
// Import Next.js usePathname to highlight the currently active sidebar link
import { usePathname } from "next/navigation";
// Import the auth context hook to access the logged-in admin and logout function
import { useAuth } from "@/context/AuthContext";
// Import Next.js router for redirecting after logout
import { useRouter } from "next/navigation";
// Import useState for managing the collapsed/expanded state of the sidebar
import { useState } from "react";

// NAV_ITEMS defines the admin-only navigation links shown in the sidebar
// These are never visible to citizens
const NAV_ITEMS = [
  // Dashboard link — the admin command center overview
  { label: "Dashboard", href: "/admin", icon: "🗺" },
  // Alerts link — for composing and broadcasting community alerts
  { label: "Alerts", href: "/alerts", icon: "🚨" },
  // Incidents link — full table view of all reported incidents
  { label: "All Incidents", href: "/dashboard", icon: "📋" },
  // About link — platform information
  { label: "About CERP", href: "/about", icon: "ℹ️" },
];

// AdminSidebar renders a fixed left-side navigation panel for admin users
// It replaces the top navbar when an admin is logged in
export default function AdminSidebar() {
  // Read the logged-in admin's profile and the logout function from auth context
  const { user, logout } = useAuth();
  // usePathname returns the current URL path for highlighting the active link
  const pathname = usePathname();
  // useRouter provides programmatic navigation after logout
  const router = useRouter();
  // collapsed controls whether the sidebar is shown in compact or full mode
  const [collapsed, setCollapsed] = useState(false);

  // handleLogout clears the admin session and redirects to the admin login page
  const handleLogout = () => {
    // Clear the token and user data from localStorage via the auth context
    logout();
    // Redirect to the admin login page
    router.push("/admin/login");
  };

  return (
    // Fixed sidebar panel on the left side of the screen
    <aside
      style={{
        // Sidebar is fixed so it stays in place as the page scrolls
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        // Width changes based on collapsed state — narrow when collapsed
        width: collapsed ? "64px" : "240px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        zIndex: 50,
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar Header ── */}
      <div
        className="flex items-center justify-between px-4 h-16 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        {/* Show CERP logo only when sidebar is expanded */}
        {!collapsed && (
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <span className="font-extrabold text-base tracking-wider" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
              CER<span style={{ color: "var(--red)" }}>P</span>
            </span>
          </Link>
        )}

        {/* Toggle button to collapse or expand the sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", padding: "4px" }}
        >
          {/* Show different icons for collapsed vs expanded state */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed
              ? <path d="M9 18l6-6-6-6" />
              : <path d="M15 18l-6-6 6-6" />
            }
          </svg>
        </button>
      </div>

      {/* ── Admin Profile Card ── */}
      {/* Only shown when the sidebar is expanded */}
      {!collapsed && user && (
        <div
          className="mx-3 mt-4 mb-2 rounded-xl p-3 flex-shrink-0"
          style={{ background: "var(--surface2)", border: "1px solid var(--border)" }}
        >
          {/* Admin avatar circle with first letter of name */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "var(--red)", color: "#fff" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              {/* Admin's full name */}
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{user.name}</p>
              {/* Admin role badge */}
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ background: "var(--red-dim)", color: "var(--red)" }}
              >
                Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Small avatar shown when sidebar is collapsed */}
      {collapsed && user && (
        <div className="flex justify-center mt-4 mb-2">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--red)", color: "#fff" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      {/* ── Navigation Links ── */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {/* Section label — only shown when expanded */}
        {!collapsed && (
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 px-2" style={{ color: "var(--text-muted)" }}>
            Admin Menu
          </p>
        )}

        {/* Render each admin navigation link */}
        {NAV_ITEMS.map((item) => {
          // Check if this link matches the current page URL
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none" }}
            >
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-150"
                style={{
                  // Highlight the active page link with a red background
                  background: isActive ? "var(--red-dim)" : "transparent",
                  color: isActive ? "var(--red)" : "var(--text-secondary)",
                }}
              >
                {/* Icon for this nav item */}
                <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
                {/* Label — hidden when sidebar is collapsed */}
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── Sign Out Button ── */}
      <div className="px-3 pb-4 flex-shrink-0" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--red)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
        >
          {/* Sign out icon */}
          <span style={{ fontSize: "16px", flexShrink: 0 }}>🚪</span>
          {/* Label — hidden when collapsed */}
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
