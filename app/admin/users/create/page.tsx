"use client";

import { useState } from "react";
import { register } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { KASOA_TOWNS } from "@/lib/data";

export default function CreateUserPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
    region: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      router.push("/admin/users");
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== "superadmin") {
    return <div className="p-20 text-center">Access Denied</div>;
  }

  return (
    <div className="min-h-screen bg-bg text-white flex">
      <AdminSidebar />
      <main className="flex-1 ml-17.5 lg:ml-65 p-10 flex justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "Syne" }}>Register New User</h1>
            <p className="text-white/40 text-sm">Create a new administrative account for CIRP.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface border border-white/5 p-10 rounded-3xl space-y-6">
            {error && (
              <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-xl text-xs font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-bg border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-500 transition-colors"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full bg-bg border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-500 transition-colors"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Password</label>
              <input 
                required
                type="password" 
                className="w-full bg-bg border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-500 transition-colors"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Role</label>
                <select 
                  className="w-full bg-bg border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-500 transition-colors appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="responder">Responder</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Assigned Town</label>
                <select 
                  className="w-full bg-bg border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-red-500 transition-colors appearance-none"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                >
                  <option value="">Select Region</option>
                  {KASOA_TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-sm mt-4 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
