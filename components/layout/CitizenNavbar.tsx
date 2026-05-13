"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/**
 * CitizenNavbar: Primary navigation for residents and visitors.
 * Streamlined for better code visibility and reduced bundle size.
 */
export default function CitizenNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const navLinks = [
    ["Home", "/"], 
    ...(user && user.role !== "user" ? [] : [["Report Issue", "/report"]]), 
    ...(user && (user.role === "admin" || user.role === "superadmin" || user.role === "responder") ? [["Dashboard", "/dashboard"]] : []),
    ["About", "/about"]
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-16 bg-bg/90 backdrop-blur-xl border-b border-white/5">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-600 shadow-lg shadow-red-600/20">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-extrabold text-base tracking-widest text-white" style={{ fontFamily: "Syne" }}>CIRP</span>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 list-none">
        {navLinks.map(([label, href]) => (
          <li key={label}><Link href={href} className="nav-link text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity no-underline">{label}</Link></li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {!user ? (
          <Link href="/login" className="btn-ghost hidden md:block px-5 py-2 text-xs font-bold uppercase tracking-widest no-underline">Sign In</Link>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 bg-transparent border-none cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">{user.name[0]}</div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="opacity-50"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-surface border border-white/10 rounded-xl py-2 min-w-50 shadow-2xl">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs opacity-50">{user.email}</p>
                </div>
                <Link href="/report" className="block px-4 py-2 text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 no-underline text-white">📋 My Reports</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-500 bg-transparent border-none cursor-pointer hover:bg-white/5">🚪 Sign Out</button>
              </div>
            )}
          </div>
        )}
        {!user?.role || user?.role === "user" ? (
          <Link href="/report" className="btn-primary px-5 py-2 text-xs font-bold uppercase tracking-widest no-underline">Report Now</Link>
        ) : null}
        
        {/* Mobile Toggle */}
        <button className="md:hidden text-white/50 bg-transparent border-none" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 md:hidden bg-surface border-b border-white/10 flex flex-col p-6 gap-4">
          {navLinks.map(([label, href]) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest opacity-60 no-underline text-white">{label}</Link>
          ))}
          {!user && <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm font-bold uppercase tracking-widest text-red-500 no-underline">Sign In →</Link>}
        </div>
      )}
    </nav>
  );
}
