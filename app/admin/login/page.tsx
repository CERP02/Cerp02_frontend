"use client";

// Import React hooks for form state management
import { useState } from "react";
// Import Next.js router for redirecting after login
import { useRouter } from "next/navigation";
// Import the login API function
import { login } from "@/lib/api";
// Import the auth context hook to store the admin user globally
import { useAuth } from "@/context/AuthContext";
// Import Next.js Link for the citizen login redirect
import Link from "next/link";

// AdminLoginPage renders at "/admin/login"
// Only users with the admin role can log in here
export default function AdminLoginPage() {
  // email holds the value typed into the email input
  const [email, setEmail] = useState("");
  // password holds the value typed into the password input
  const [password, setPassword] = useState("");
  // loading tracks whether the login request is in progress
  const [loading, setLoading] = useState(false);
  // error holds any error message returned from the server
  const [error, setError] = useState("");

  // useRouter allows redirecting to the admin dashboard after login
  const router = useRouter();
  // Read the login function from auth context to store the admin user globally
  const { login: authLogin } = useAuth();

  // handleLogin authenticates the admin and redirects to the dashboard
  const handleLogin = async () => {
    // Clear any previous error
    setError("");
    // Show loading state on the button
    setLoading(true);

    try {
      // Call the backend login API with the admin's credentials
      const data = await login({ email, password });

      // Reject login if the authenticated user is not an admin
      if (data.user.role !== "admin") {
        // Remove the token that was stored by the login function
        localStorage.removeItem("cerp_token");
        setError("Access denied. This portal is for administrators only.");
        return;
      }

      // Store the admin user profile in the global auth context
      authLogin(data.user);

      // Redirect to the admin command center dashboard
      router.push("/admin");
    } catch (err: unknown) {
      // Display the server error message
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      // Always turn off loading
      setLoading(false);
    }
  };

  return (
    // Semantic main element
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Full-height centered card layout */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="w-full max-w-md rounded-2xl p-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Header with shield icon and admin label */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--red)" }}>
              {/* Shield SVG icon distinguishes admin from citizen portal */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              CER<span style={{ color: "var(--red)" }}>P</span>
            </h1>
            {/* Red label clearly marking this as the admin portal */}
            <p className="text-sm font-semibold" style={{ color: "var(--red)" }}>Admin Portal</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Command Center Access</p>
          </div>

          {/* Restricted access warning banner */}
          <div
            className="rounded-xl px-4 py-3 mb-6 text-xs"
            style={{ background: "var(--red-dim)", border: "1px solid rgba(255,59,59,0.25)", color: "#ff8080" }}
          >
            🔒 Restricted access — authorised personnel only
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Admin email input */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Admin Email</label>
              <input type="email" className="form-input" placeholder="admin@cerp.gov.gh" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "var(--red-dim)", color: "var(--red)" }}>{error}</p>
            )}

            {/* Sign In button */}
            <button onClick={handleLogin} disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base mt-2">
              {loading ? "Authenticating…" : "Sign In to Command Center"}
            </button>
          </div>

          {/* Link back to citizen login */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            Not an admin?{" "}
            <Link href="/login" style={{ color: "var(--red)", textDecoration: "none" }}>Citizen sign in →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
