"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Define the navigation items for the admin portal
const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊", roles: ["admin", "superadmin", "responder"] },
  { label: "Oversight", href: "/admin/oversight", icon: "🚨", roles: ["superadmin"] },
  { label: "Current Tasks", href: "/admin", icon: "🛠", roles: ["admin", "superadmin", "responder"] },
  { label: "Users", href: "/admin/users", icon: "👥", roles: ["superadmin"] },
  { label: "Alerts", href: "/alerts", icon: "📢", roles: ["admin", "superadmin"] },
  { label: "Audit Logs", href: "/admin/audit", icon: "📜", roles: ["superadmin"] },
  { label: "Settings", href: "/admin/settings", icon: "⚙️", roles: ["superadmin"] },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // If user is not an admin/superadmin/responder, don't show the sidebar
  if (!user || (user.role !== "admin" && user.role !== "superadmin" && user.role !== "responder")) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border pt-24 pb-10 flex flex-col z-20">
      <div className="px-6 mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-4">
          Management
        </p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.filter(item => item.roles.includes(user.role)).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-red-dim text-red shadow-sm" 
                    : "text-text-secondary hover:bg-surface2 hover:text-text-primary"
                }`}
              >
                <span className={`text-xl transition-transform duration-200 group-hover:scale-110 ${isActive ? "opacity-100" : "opacity-70"}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-6">
        <div className="p-4 rounded-2xl bg-surface2 border border-border">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">
            Logged in as
          </p>
          <p className="text-sm font-bold truncate">{user.name}</p>
          <p className="text-[10px] text-muted capitalize">{user.role}</p>
        </div>
      </div>
    </aside>
  );
}
