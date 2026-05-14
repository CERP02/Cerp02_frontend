"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers, updateUser, deleteUser, AuthUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { KASOA_TOWNS } from "@/lib/data";

export default function UserManagementPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "superadmin") fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUser(userId, { role: newRole });
      setMessage(`Updated ${users.find(u => u.id === userId)?.name}'s role to ${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegionChange = async (userId: string, newRegion: string) => {
    try {
      await updateUser(userId, { region: newRegion });
      setMessage("Region updated successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(userId);
      setMessage("User deleted successfully");
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    if (!confirm(`Are you sure you want to ${newStatus === "suspended" ? "suspend" : "activate"} this user?`)) return;
    try {
      const token = localStorage.getItem("cerp_token");
      await fetch(`http://localhost:4000/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      setMessage(`User ${newStatus === "suspended" ? "suspended" : "activated"} successfully`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superadmin": return "var(--red)";
      case "admin": return "var(--orange)";
      case "responder": return "var(--blue)";
      default: return "var(--green)";
    }
  };

  if (currentUser?.role !== "superadmin") {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-10">
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="opacity-50 text-sm">Only Superadmins can access the user management console.</p>
          <Link href="/admin"><button className="btn-ghost mt-6 px-6 py-2">Return to Dashboard</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-white flex">
      <AdminSidebar />
      <main className="flex-1 ml-17.5 lg:ml-65 p-6 lg:p-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2">Administrative Console</p>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2" style={{ fontFamily: "Syne" }}>User Management</h1>
            <p className="text-white/40 text-sm max-w-md">Oversee platform roles, region assignments, and security across the Kasoa StreetPulse network.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="bg-surface border border-white/10 rounded-xl px-5 py-3 text-sm outline-none focus:border-red-500 transition-all flex-1 lg:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link href="/admin/users/create" className="shrink-0">
              <button className="btn-primary px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest">Add User</button>
            </Link>
          </div>
        </div>

        {message && (
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_var(--green)]" />
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">{message}</span>
          </div>
        )}

        <div className="bg-surface border border-white/5 rounded-4xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Identity</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">System Role</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Assigned Region</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40 text-right">Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={4} className="p-20 text-center opacity-30 italic">Synchronizing user directory...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center opacity-30 italic">No users match your current search criteria.</td></tr>
                ) : filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/2 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-sm font-bold border border-white/5 group-hover:border-red-500/30 transition-all">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm tracking-tight">{u.name}</div>
                          <div className="text-[10px] opacity-40 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: getRoleColor(u.role), boxShadow: `0 0 8px ${getRoleColor(u.role)}` }} />
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-transparent border-none p-0 text-xs font-bold uppercase tracking-widest outline-none cursor-pointer hover:text-red-500 transition-colors"
                          style={{ color: getRoleColor(u.role) }}
                        >
                          <option value="user" className="bg-surface text-white">User</option>
                          <option value="responder" className="bg-surface text-white">Responder</option>
                          <option value="admin" className="bg-surface text-white">Admin</option>
                          <option value="superadmin" className="bg-surface text-white">Superadmin</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-6">
                      <select
                        value={u.region || ""}
                        onChange={(e) => handleRegionChange(u.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest focus:border-red-500 outline-none transition-all cursor-pointer"
                      >
                        <option value="" className="bg-surface">No Region</option>
                        {KASOA_TOWNS.map(t => <option key={t} value={t} className="bg-surface">{t}</option>)}
                      </select>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusToggle(u.id, (u as any).status || "active")}
                          disabled={u.id === currentUser.id}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${(u as any).status === "suspended"
                              ? "bg-green/10 border-green/30 text-green hover:bg-green/20"
                              : "bg-orange/10 border-orange/30 text-orange hover:bg-orange/20"
                            }`}
                        >
                          {(u as any).status === "suspended" ? "Activate" : "Suspend"}
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          disabled={u.id === currentUser.id}
                          className="btn-ghost px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-red-500/50 hover:text-red-500 hover:border-red-500/50 transition-all disabled:opacity-0"
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
