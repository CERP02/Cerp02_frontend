"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) setToken(t);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await resetPassword({ token, newPassword });
      setMessage(data.message);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl p-10 bg-surface border border-white/5">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "Syne" }}>Set New Password</h1>
        <p className="text-sm opacity-50">Choose a secure password for your account.</p>
      </div>

      {!message ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Reset Token</label>
            <input 
              required type="text" className="form-input opacity-60" placeholder="Paste your token here" 
              value={token} onChange={(e) => setToken(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest opacity-40 mb-2">New Password</label>
            <input 
              required type="password" className="form-input" placeholder="••••••••" 
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Confirm Password</label>
            <input 
              required type="password" className="form-input" placeholder="••••••••" 
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>

          {error && <p className="text-xs p-3 bg-red-500/10 text-red-500 rounded-xl">{error}</p>}

          <button disabled={loading} className="btn-primary w-full py-4 rounded-xl text-sm font-bold uppercase">
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-sm font-bold uppercase tracking-widest">
            {message}
          </div>
          <p className="text-xs opacity-50 italic">Redirecting you to login...</p>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main>
      <CitizenNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
