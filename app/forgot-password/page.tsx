"use client";

import { useState } from "react";
import { forgotPassword } from "@/lib/api";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [demoToken, setDemoToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      if (data.token) setDemoToken(data.token);
    } catch (err: any) {
      setError(err.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <CitizenNavbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md rounded-2xl p-10 bg-surface border border-white/5">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold mb-2" style={{ fontFamily: "Syne" }}>Forgot Password?</h1>
            <p className="text-sm opacity-50">Enter your email and we'll send you a reset link.</p>
          </div>

          {!message ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Email Address</label>
                <input 
                  required type="email" className="form-input" placeholder="you@example.com" 
                  value={email} onChange={(e) => setEmail(e.target.value)} 
                />
              </div>

              {error && <p className="text-xs p-3 bg-red-500/10 text-red-500 rounded-xl">{error}</p>}

              <button disabled={loading} className="btn-primary w-full py-4 rounded-xl text-sm font-bold uppercase">
                {loading ? "Processing..." : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-sm">
                {message}
              </div>
              
              {demoToken && (
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-4">Demo Mode Only:</p>
                  <p className="text-xs opacity-60 mb-4 italic">Since email delivery is not configured, please use this token to reset your password manually:</p>
                  <div className="bg-bg p-3 rounded-lg font-mono text-xs text-red-500 break-all mb-6">{demoToken}</div>
                  <Link href={`/reset-password?token=${demoToken}`} className="btn-primary inline-block px-6 py-2 text-[10px]">
                    Go to Reset Page
                  </Link>
                </div>
              )}

              <Link href="/login" className="block text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity no-underline">
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
