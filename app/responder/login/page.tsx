"use client";

// Import React hooks for managing responder authentication form state
import { useState } from "react";
// Import Next.js router for programmatic redirection to the responder dashboard
import { useRouter } from "next/navigation";
// Import the centralized login API function for backend credential verification
import { login } from "@/lib/api";
// Import the global authentication context to store the responder session securely
import { useAuth } from "@/context/AuthContext";
// Import Next.js Link for optimized navigation to the general citizen login page
import Link from "next/link";

// ResponderLoginPage renders at the "/responder/login" route of the CIRP application
// It serves as a secure entry point restricted to emergency responder personnel
export default function ResponderLoginPage() {
  // email stores the input value for the responder's account identifier
  const [email, setEmail] = useState("");
  // password stores the masked input value for the responder password
  const [password, setPassword] = useState("");
  // loading tracks the status of the asynchronous auth request to manage UI interaction
  const [loading, setLoading] = useState(false);
  // error holds descriptive failure messages returned from the authentication server
  const [error, setError] = useState("");

  // useRouter enables programmatic navigation control upon successful login
  const router = useRouter();
  // Extract the global login method to update the platform-wide authentication state
  const { login: authLogin } = useAuth();

  // handleLogin manages the submission and validation of responder credentials
  const handleLogin = async () => {
    // Reset any previous error states before initiating the login attempt
    setError("");
    // Enable the loading spinner/state to indicate an active network request
    setLoading(true);

    try {
      // Call the login API with the provided responder email and password
      const data = await login({ email, password });

      // Enforce strict role-based access control — only responders can access this route
      if (data.user.role !== "responder") {
        // Remove the newly issued token to prevent unauthorized session persistence
        localStorage.removeItem("cerp_token");
        // Set a descriptive error message explaining the access restriction
        setError("Access denied. This portal is strictly for StreetPulse responder personnel only.");
        // Terminate the login flow
        return;
      }

      // Populate the global authentication context with the validated responder user data
      authLogin(data.user);

      // Redirect the authenticated responder to the task management dashboard
      router.push("/responder");
    } catch (err: unknown) {
      // Handle potential API errors by displaying a helpful message to the user
      if (err instanceof Error) {
        // Use the specific error message provided by the server response
        setError(err.message);
      } else {
        // Provide a generic fallback message for unexpected authentication failures
        setError("Login failed. Please verify your responder credentials.");
      }
    } finally {
      // Ensure the loading state is disabled regardless of the authentication outcome
      setLoading(false);
    }
  };

  return (
    // Semantic main element wrapping the entire responder authentication portal
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
            {/* Red logo badge with white siren icon to signify emergency response */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--red)" }}>
              {/* Siren/alert SVG icon distinguishes the responder portal from the citizen entry point */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /><path d="M10 9l-1 8" /><path d="M14 9l1 8" /><path d="M9 17h6" /><path d="M5 4v3m14-3v3" />
              </svg>
            </div>
            {/* Primary CIRP wordmark with brand emphasis on the platform initial */}
            <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              <span style={{ color: "#ffffff" }}>Street</span><span style={{ color: "var(--red)" }}>Pulse</span>
            </h1>
            {/* Red label explicitly marking this route as the responder portal */}
            <p className="text-sm font-semibold" style={{ color: "var(--red)" }}>Responder Portal</p>
            {/* Sub-label describing the function of the responder zone */}
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Emergency Response Operations</p>
          </div>

          {/* High-visibility warning banner to deter unauthorized access attempts */}
          <div
            className="rounded-xl px-4 py-3 mb-6 text-xs text-center"
            style={{ background: "var(--red-dim)", border: "1px solid rgba(255,59,59,0.25)", color: "#ff8080" }}
          >
            🚨 Restricted access — authorized StreetPulse responder personnel only
          </div>

          {/* Form input area for responder credentials */}
          <div className="flex flex-col gap-4">
            {/* Input field for the responder's registered email address */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Responder Email</label>
              {/* Text input with placeholder bound to the email state variable */}
              <input type="email" className="form-input" placeholder="responder@cirp.gov.gh" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Input field for the responder's password */}
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

            {/* Primary submission button for responder sign-in */}
            <button onClick={handleLogin} disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base mt-2">
              {/* Toggle between loading and default action labels */}
              {loading ? "Authenticating…" : "Sign In to Operations"}
            </button>
          </div>

          {/* Navigation link providing an exit path back to the public citizen portal */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            Not a responder?{" "}
            {/* optimized Next.js link to the citizen login route */}
            <Link href="/login" style={{ color: "var(--red)", textDecoration: "none" }}>Citizen sign in →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
