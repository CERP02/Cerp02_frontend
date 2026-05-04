"use client";

// Import React hooks for managing form state
import { useState } from "react";
// Import Next.js Link for navigation between pages
import Link from "next/link";
// Import Next.js router for redirecting after login
import { useRouter } from "next/navigation";
// Import the login and register API functions
import { login, register } from "@/lib/api";
// Import the CitizenNavbar for consistent navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the auth context hook to store the user after login
import { useAuth } from "@/context/AuthContext";
// Import the Kasoa towns list for the registration dropdown
import { KASOA_TOWNS } from "@/lib/data";

// CitizenLoginPage renders at "/login"
// It handles both Sign In and Register for citizen users
export default function CitizenLoginPage() {
  // mode controls which form is shown — login or register
  const [mode, setMode] = useState<"login" | "register">("login");
  // name is used only during registration
  const [name, setName] = useState("");
  // email is used in both login and register
  const [email, setEmail] = useState("");
  // password is used in both forms
  const [password, setPassword] = useState("");
  // town is the selected Kasoa community — used during registration only
  const [town, setTown] = useState("");
  // loading tracks whether an API request is in progress
  const [loading, setLoading] = useState(false);
  // error holds any error message returned from the server
  const [error, setError] = useState("");

  // useRouter allows redirecting to another page after successful login
  const router = useRouter();
  // Read the login function from auth context to store the user globally
  const { login: authLogin } = useAuth();

  // handleSubmit is called when the citizen submits the login or register form
  const handleSubmit = async () => {
    // Clear any previous error
    setError("");
    // Show loading state
    setLoading(true);

    try {
      // Declare data variable to hold the API response
      let data;

      // Call the appropriate API endpoint based on the current mode
      if (mode === "register") {
        // Register a new citizen account
        data = await register({ name, email, password, role: "citizen", region: town });
      } else {
        // Login with existing credentials
        data = await login({ email, password });
      }

      // Store the returned user profile in the global auth context
      authLogin(data.user);

      // Redirect citizen to the report page after successful authentication
      // Redirect based on user role after successful login
if (data.user.role === "admin") {
  router.push("/admin");
} else if (data.user.role === "responder") {
  router.push("/responder");
} else {
  router.push("/report");
}
    } catch (err: unknown) {
      // Display the error message from the server
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      // Always turn off loading when the request completes
      setLoading(false);
    }
  };

  return (
    // Semantic main element
    <main>
      {/* Citizen-facing navigation bar */}
      <CitizenNavbar />

      {/* Centered login card */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div
          className="w-full max-w-md rounded-2xl p-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Header with logo */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--red)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              CER<span style={{ color: "var(--red)" }}>P</span>
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Community Emergency Reporting Platform</p>
          </div>

          {/* Mode toggle — Sign In / Register */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "var(--bg)" }}>
            <button
              onClick={() => setMode("login")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ background: mode === "login" ? "var(--surface)" : "transparent", color: mode === "login" ? "var(--text-primary)" : "var(--text-muted)", border: "none", cursor: "pointer" }}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ background: mode === "register" ? "var(--surface)" : "transparent", color: mode === "register" ? "var(--text-primary)" : "var(--text-muted)", border: "none", cursor: "pointer" }}
            >
              Register
            </button>
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Name field — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                <input type="text" className="form-input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Email Address</label>
              <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Town dropdown — register only */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Your Kasoa Community</label>
                <select className="form-input" value={town} onChange={(e) => setTown(e.target.value)}>
                  <option value="">Select your town…</option>
                  {KASOA_TOWNS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {/* Error message */}
            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "var(--red-dim)", color: "var(--red)" }}>{error}</p>
            )}

            {/* Submit button */}
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base mt-2">
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Admin login link */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            Are you an admin?{" "}
            <Link href="/admin/login" style={{ color: "var(--red)", textDecoration: "none" }}>
              Admin sign in →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
