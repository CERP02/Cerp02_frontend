"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/**
 * Footer: Shared footer component with CIRP branding and key links.
 * Dynamically hides links based on user role.
 */
export default function Footer() {
  const { user } = useAuth();

  const links = [
    ["About StreetPulse", "/about"],
    ...(user && user.role !== "user" ? [] : [["Report Issue", "/report"]]),
    ...(user && (user.role === "admin" || user.role === "superadmin" || user.role === "responder") ? [["Dashboard", "/dashboard"]] : []),
    ["Notifications", "/alerts"],
    ["Sign In", "/login"],
    ["Admin Portal", "/admin/login"],
  ];

  return (
    <footer className="py-16 px-10 text-center bg-surface border-t border-white/5">
      <div className="text-2xl font-extrabold mb-2 tracking-tight" style={{ fontFamily: "Syne" }}>
        <span style={{ color: "#ffffff" }}>Street</span><span className="text-red-500">Pulse</span>
      </div>
      
      <p className="text-xs opacity-40 mb-1 font-bold uppercase tracking-widest">Community Issue Reporting Platform</p>
      <p className="text-[10px] opacity-30 mb-8 uppercase tracking-[0.2em]">Kasoa · Central Region · Ghana</p>

      <ul className="flex flex-wrap gap-6 justify-center list-none mb-8">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="text-[11px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-red-500 transition-all no-underline text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-[10px] opacity-20 font-bold uppercase tracking-widest">
        © {new Date().getFullYear()} StreetPulse. Built for the community.
      </p>
    </footer>
  );
}
