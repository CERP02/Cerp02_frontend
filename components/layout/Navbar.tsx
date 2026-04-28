"use client";

// Import the Next.js Link component for client-side page navigation
import Link from "next/link";
// Import the useState hook to manage the mobile menu open/closed state
import { useState } from "react";

// Navbar is a fixed top navigation bar rendered on every page of the platform
export default function Navbar() {
  // mobileOpen tracks whether the mobile hamburger menu is expanded
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    // Fixed nav bar pinned to the top of the screen, sits above all page content
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16"
      style={{
        // Semi-transparent dark background with blur for a glass effect
        background: "rgba(10,12,16,0.85)",
        // Blur effect on the content behind the nav bar
        backdropFilter: "blur(12px)",
        // Subtle bottom border to separate nav from page content
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* ── Logo ── */}
      {/* Wrap logo in a Link so clicking it goes to the home page */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div className="flex items-center gap-2.5">
          {/* Red square badge containing the emergency icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--red)" }}
          >
            {/* SVG icon representing layered emergency data */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Platform wordmark — CERP with the P highlighted in red */}
          <span
            className="font-extrabold text-base tracking-wider"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            CER<span style={{ color: "var(--red)" }}>P</span>
          </span>
        </div>
      </Link>

      {/* ── Desktop Navigation Links ── */}
      {/* Hidden on mobile screens, shown on md and above */}
      <ul className="hidden md:flex gap-8 list-none">
        {/* Each pair is [label, href] — map over them to render nav links */}
        {[
          ["Home", "/"],
          ["Report Incident", "/report"],
          ["Dashboard", "/dashboard"],
          ["Alerts", "/alerts"],
          ["About", "/about"],
        ].map(([label, href]) => (
          <li key={label}>
            {/* Use Next.js Link for client-side navigation between pages */}
            <Link
              href={href}
              // nav-link class handles hover color change via CSS (no inline event handlers)
              className="nav-link text-sm transition-colors duration-200"
              style={{ textDecoration: "none" }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ── Action Buttons ── */}
      <div className="flex items-center gap-3">
        {/* Sign In button links to the citizen login page */}
        <Link href="/login">
          <button className="btn-ghost hidden md:block px-5 py-2 rounded-lg text-sm font-medium cursor-pointer">
            Sign In
          </button>
        </Link>

        {/* Report Now CTA button links directly to the report form page */}
        <Link href="/report">
          <button className="btn-primary px-5 py-2 rounded-lg text-sm font-medium">
            Report Now
          </button>
        </Link>

        {/* Hamburger button — only visible on mobile screens */}
        <button
          className="md:hidden ml-2"
          style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer" }}
          // Toggle the mobile menu open or closed on each click
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {/* Switch between X icon (open) and hamburger icon (closed) */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              // X icon shown when menu is open
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              // Hamburger icon shown when menu is closed
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {/* Only rendered when mobileOpen is true */}
      {mobileOpen && (
        <div
          className="absolute top-16 left-0 right-0 md:hidden"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {/* Same links as the desktop menu rendered vertically */}
          {[
            ["Home", "/"],
            ["Report Incident", "/report"],
            ["Dashboard", "/dashboard"],
            ["Alerts", "/alerts"],
            ["About", "/about"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block px-8 py-4 text-sm"
              style={{ color: "var(--text-secondary)", textDecoration: "none", borderBottom: "1px solid var(--border)" }}
              // Close the mobile menu when the user taps a link
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Sign In link pointing to the citizen login page */}
          <Link
            href="/login"
            className="block px-8 py-4 text-sm"
            style={{ color: "var(--red)", textDecoration: "none" }}
            onClick={() => setMobileOpen(false)}
          >
            Sign In →
          </Link>
        </div>
      )}
    </nav>
  );
}
