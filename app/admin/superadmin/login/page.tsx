"use client";

// Import React hooks for managing superadmin authentication form state
import { useState } from "react";
// Import Next.js router for programmatic redirection to the superadmin dashboard
import { useRouter } from "next/navigation";
// Import the centralized login API function for backend credential verification
import { login } from "@/lib/api";
// Import the global authentication context to store the superadmin session securely
import { useAuth } from "@/context/AuthContext";
// Import Next.js Link for optimized navigation to the general citizen login page
import Link from "next/link";

// SuperadminLoginPage renders at the "/admin/superadmin/login" route of the CIRP application
// It serves as a secure entry point restricted to platform superadministrator personnel only
export default function SuperadminLoginPage() {
  // email stores the input value for the superadmin's account identifier
  const [email, setEmail] = useState("");
  // password stores the masked input value for the superadmin password
  const [password, setPassword] = useState("");
  // loading tracks the status of the asynchronous auth request to manage UI interaction
  const [loading, setLoading] = useState(false);
  // error holds descriptive failure messages returned from the authentication server
  const [error, setError] = useState("");

  // useRouter enables programmatic navigation control upon successful login
  const router = useRouter();
  // Extract the global login method to update the platform-wide authentication state
  const { login: authLogin } = useAuth();

  // handleLogin manages the submission and validation of superadmin credentials
  const handleLogin = async () => {
    // Reset any previous error states before initiating the login attempt
    setError("");
    // Enable the loading spinner/state to indicate an active network request
    setLoading(true);

    try {
      // Call the login API with the provided superadmin email and password
      const data = await login({ email, password });

      // Enforce strict role-based access control — only superadmins can access this route
      if (data.user.role !== "superadmin") {
        // Remove the newly issued token to prevent unauthorized session persistence
        localStorage.removeItem("cerp_token");
        // Set a descriptive error message explaining the access restriction
        setError("Access denied. This portal is strictly for StreetPulse superadministrators only.");
        // Terminate the login flow
        return;
      }

      // Populate the global authentication context with the validated superadmin user data
      authLogin(data.user);

      // Redirect the authenticated superadmin to the platform command center dashboard
      router.push("/admin");
    } catch (err: unknown) {
      // Handle potential API errors by displaying a helpful message to the user
      if (err instanceof Error) {
        // Use the specific error message provided by the server response
        setError(err.message);
      } else {
        // Provide a generic fallback message for unexpected authentication failures
        setError("Login failed. Please verify your superadmin credentials.");
      }
    } finally {
      // Ensure the loading state is disabled regardless of the authentication outcome
      setLoading(false);
    }
  };

  return (
    // Semantic main element wrapping the entire superadmin authentication portal
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* Full-height flexbox container for vertical and horizontal centering of the login card */}
      <div className="min-h-screen flex items-center justify-center px-4">
        {/* Authentication card container with surface background and consistent border styling */}
        <div
          className="w-full max-w-md rounded-2xl p-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Header section containing the portal logo, branding, and role indicator */}
          <div className="text-center mb-8">
            {/* Red logo badge with white crown icon to signify supreme authority */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--red)" }}>
              {/* Crown SVG icon distinguishes the superadmin portal from standard admin access */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 13l3.293-3.293a1 1 0 0 1 1.414 0l2.586 2.586a1 1 0 0 0 1.414 0l2.586-2.586a1 1 0 0 1 1.414 0L18 13" /><path d="M6 13H2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6h-4" /><path d="M6 5h12v2H6z" />
              </svg>
            </div>
            {/* Primary CIRP wordmark with brand emphasis on the platform initial */}
            <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              <span style={{ color: "#ffffff" }}>Street</span><span style={{ color: "var(--red)" }}>Pulse</span>
            </h1>
            {/* Red label explicitly marking this route as the superadmin portal */}
            <p className="text-sm font-semibold" style={{ color: "var(--red)" }}>Superadmin Portal</p>
            {/* Sub-label describing the function of the superadmin zone */}
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Platform Administration & Control</p>
          </div>

          {/* High-visibility warning banner to deter unauthorized access attempts */}
          <div
            className="rounded-xl px-4 py-3 mb-6 text-xs text-center"
            style={{ background: "var(--red-dim)", border: "1px solid rgba(255,59,59,0.25)", color: "#ff8080" }}
          >
            👑 Restricted access — authorized StreetPulse superadministrators only
          </div>

          {/* Form input area for superadmin credentials */}
          <div className="flex flex-col gap-4">
            {/* Input field for the superadmin's registered email address */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Superadmin Email</label>
              {/* Text input with placeholder bound to the email state variable */}
              <input type="email" className="form-input" placeholder="superadmin@cirp.gov.gh" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Input field for the superadmin's password */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Password</label>
              {/* Password type input with placeholder bound to the password state variable */}
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Error message display container shown only when an authentication failure occurs */}
            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "var(--red-dim)", color: "var(--red)" }}>
                {/* Display the dynamic error string returned by the logic */}
                {error}
              </p>
            )}

            {/* Primary submission button for superadmin sign-in */}
            <button onClick={handleLogin} disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base mt-2">
              {/* Toggle between loading and default action labels */}
              {loading ? "Authenticating…" : "Sign In to Platform"}
            </button>
          </div>

          {/* Navigation links providing exit paths to other portal entry points */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            Are you an admin?{" "}
            {/* Link to the standard admin login route */}
            <Link href="/admin/login" style={{ color: "var(--red)", textDecoration: "none" }}>
              Admin sign in →
            </Link>
          </p>
          <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Not a superadmin?{" "}
            {/* Link back to the citizen login route */}
            <Link href="/login" style={{ color: "var(--red)", textDecoration: "none" }}>
              Citizen sign in →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
