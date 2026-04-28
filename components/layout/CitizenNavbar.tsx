"use client";

// Import Next.js Link component for client-side page navigation
import Link from "next/link";
// Import React hooks for managing mobile menu and dropdown state
import { useState, useRef, useEffect } from "react";
// Import the auth context hook to read the logged-in user and logout function
import { useAuth } from "@/context/AuthContext";
// Import Next.js router for redirecting after logout
import { useRouter } from "next/navigation";

// CitizenNavbar is the navigation bar shown to citizens and unauthenticated visitors
// It only shows: Home, Report Incident, About — no admin-only links
export default function CitizenNavbar() {
  // mobileOpen controls whether the hamburger menu is expanded on small screens
  const [mobileOpen, setMobileOpen] = useState(false);
  // dropdownOpen controls whether the user account dropdown is visible
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // dropdownRef is used to detect clicks outside the dropdown to close it
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read the currently logged-in user and the logout function from auth context
  const { user, logout } = useAuth();
  // useRouter allows programmatic navigation after logout
  const router = useRouter();

  // Close the dropdown when the user clicks anywhere outside of it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // If the click was outside the dropdown container, close it
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    // Attach the click listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);
    // Remove the listener when the component unmounts to prevent memory leaks
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handleLogout clears the session and redirects to the home page
  const handleLogout = () => {
    // Call the logout function from the auth context to clear token and user data
    logout();
    // Close the dropdown
    setDropdownOpen(false);
    // Redirect to the home page after signing out
    router.push("/");
  };

  // Get the first letter of the user's name to display as the avatar initial
  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    // Fixed nav bar pinned to the top of every citizen-facing page
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16"
      style={{
        // Semi-transparent dark background with a blur effect
        background: "rgba(10,12,16,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* ── Logo ── */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div className="flex items-center gap-2.5">
          {/* Red icon badge */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--red)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          {/* Platform wordmark */}
          <span className="font-extrabold text-base tracking-wider" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
            CER<span style={{ color: "var(--red)" }}>P</span>
          </span>
        </div>
      </Link>

      {/* ── Citizen Navigation Links (desktop) ── */}
      {/* Only Home, Report Incident, and About are shown to citizens */}
      <ul className="hidden md:flex gap-8 list-none">
        {[
          ["Home", "/"],
          ["Report Incident", "/report"],
          ["About", "/about"],
        ].map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="nav-link text-sm transition-colors duration-200" style={{ textDecoration: "none" }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Right Side: Auth Buttons or User Account ── */}
      <div className="flex items-center gap-3">
        {/* Show Sign In button only when no user is logged in */}
        {!user && (
          <Link href="/login">
            <button className="btn-ghost hidden md:block px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">
              Sign In
            </button>
          </Link>
        )}

        {/* Show Report Now button always */}
        <Link href="/report">
          <button className="btn-primary px-5 py-2 rounded-lg text-sm font-medium">
            Report Now
          </button>
        </Link>

        {/* Show user account avatar and dropdown when logged in */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            {/* Circular avatar button showing the user's initial */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer"
              style={{ background: "none", border: "none" }}
            >
              {/* Avatar circle with user's initial */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "var(--red)", color: "#fff" }}
              >
                {initial}
              </div>
              {/* Chevron icon indicating dropdown */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown menu — shown when avatar is clicked */}
            {dropdownOpen && (
              <div
                className="absolute right-0 top-12 rounded-xl py-2 min-w-[200px] z-50"
                style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              >
                {/* User name and email header */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user.email}</p>
                  {/* Role badge */}
                  <span
                    className="inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1"
                    style={{ background: "var(--red-dim)", color: "var(--red)" }}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Dropdown menu items */}
                <div className="py-1">
                  {/* My Reports link */}
                  <Link
                    href="/report"
                    className="block px-4 py-2 text-sm transition-colors"
                    style={{ color: "var(--text-secondary)", textDecoration: "none" }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    📋 My Reports
                  </Link>

                  {/* Profile settings placeholder */}
                  <div className="px-4 py-2 text-sm" style={{ color: "var(--text-muted)", cursor: "not-allowed" }}>
                    ⚙️ Profile Settings
                  </div>
                </div>

                {/* Sign Out button at the bottom of the dropdown */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "8px" }}>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm transition-colors"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--red)" }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hamburger button for mobile screens */}
        <button
          className="md:hidden ml-2"
          style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-0 right-0 md:hidden"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          {/* Citizen-only links in mobile menu */}
          {[["Home", "/"], ["Report Incident", "/report"], ["About", "/about"]].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block px-8 py-4 text-sm"
              style={{ color: "var(--text-secondary)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Show Sign In link in mobile if not logged in */}
          {!user && (
            <Link
              href="/login"
              className="block px-8 py-4 text-sm"
              style={{ color: "var(--red)", textDecoration: "none" }}
              onClick={() => setMobileOpen(false)}
            >
              Sign In →
            </Link>
          )}

          {/* Show Sign Out in mobile if logged in */}
          {user && (
            <button
              onClick={handleLogout}
              className="block w-full text-left px-8 py-4 text-sm"
              style={{ color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}
            >
              🚪 Sign Out ({user.name})
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
