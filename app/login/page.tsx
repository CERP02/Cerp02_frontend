"use client";

// Import React hooks for managing form state and mode toggling
import { useState } from "react";
// Import Next.js Link for optimized navigation between platform pages
import Link from "next/link";
// Import Next.js router for programmatic redirecting after successful authentication
import { useRouter } from "next/navigation";
// Import the login and register API functions for backend communication
import { login, register } from "@/lib/api";
// Import the CitizenNavbar for consistent layout and navigation across the portal
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the auth context hook to globally store and manage the user session
import { useAuth } from "@/context/AuthContext";
// Import the list of Kasoa towns for populating the registration community dropdown
import { KASOA_TOWNS } from "@/lib/data";

// CitizenLoginPage renders at the "/login" route of the CIRP application
// It provides a unified interface for both Signing In and Creating a new account
export default function CitizenLoginPage() {
  // mode determines which form is currently visible to the user — sign in or registration
  const [mode, setMode] = useState<"login" | "register">("login");
  // name stores the full name of the user — required only during account creation
  const [name, setName] = useState("");
  // email stores the user's registered email address — required for both forms
  const [email, setEmail] = useState("");
  // password stores the plain-text password — hashed securely on the server
  const [password, setPassword] = useState("");
  // town stores the selected Kasoa community town — used during registration for geo-tagging
  const [town, setTown] = useState("");
  // loading tracks the status of the asynchronous API request to disable buttons
  const [loading, setLoading] = useState(false);
  // error holds any descriptive error messages returned from the backend validation
  const [error, setError] = useState("");

  // useRouter provides programmatic navigation control after auth success
  const router = useRouter();
  // Extract the global login function to update the authentication state
  const { login: authLogin } = useAuth();

  // handleSubmit is triggered when the user clicks the primary action button
  const handleSubmit = async () => {
    // Clear any previous error messages before starting a new attempt
    setError("");
    // Enable the loading state to provide visual feedback and prevent multiple clicks
    setLoading(true);

    try {
      // Define a variable to hold the successful authentication data
      let data;

      // Select the correct API endpoint based on the current form mode
      if (mode === "register") {
        // Submit a request to create a new user account with region metadata
        data = await register({ name, email, password, role: "user", region: town });
      } else {
        // Submit a request to authenticate with existing email/password credentials
        data = await login({ email, password });
      }

      // Enforce role-based access control — only users can access this portal
      if (mode === "login" && data.user.role === "admin") {
        // Remove the newly issued token to prevent unauthorized session persistence
        localStorage.removeItem("cerp_token");
        // Set a descriptive error message explaining the access restriction
        setError("Access denied. Admins must use the Admin Portal. Use the link below to sign in.");
        // Terminate the login flow
        return;
      }

      if (mode === "login" && data.user.role === "responder") {
        // Remove the newly issued token to prevent unauthorized session persistence
        localStorage.removeItem("cerp_token");
        // Set a descriptive error message directing responders to their portal
        setError("Responders must use the dedicated responder portal. Use the link below.");
        // Terminate the login flow
        return;
      }

      if (mode === "login" && data.user.role === "superadmin") {
        // Remove the newly issued token to prevent unauthorized session persistence
        localStorage.removeItem("cerp_token");
        // Set a descriptive error message directing superadmins to their portal
        setError("Superadmins must use the Superadmin Portal. Use the link below to sign in.");
        // Terminate the login flow
        return;
      }

      // Update the global auth context with the returned user profile and token
      authLogin(data.user);

      // Redirect general citizens to the issue reporting page
      router.push("/report");
    } catch (err: unknown) {
      // Handle potential API errors by displaying the message to the user
      if (err instanceof Error) {
        // Use the error message provided by the server
        setError(err.message);
      } else {
        // Provide a generic fallback error for unexpected failures
        setError("Something went wrong. Please try again.");
      }
    } finally {
      // Always reset the loading state regardless of the outcome
      setLoading(false);
    }
  };

  return (
    // Semantic main element wrapping the authentication interface
    <main>
      {/* Standard citizen navigation bar at the top of the page */}
      <CitizenNavbar />

      {/* Flexbox container for centering the authentication card on the screen */}
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        {/* Authentication card with surface background and consistent border */}
        <div
          className="w-full max-w-md rounded-2xl p-10"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          {/* Brand header section with platform logo and title */}
          <div className="text-center mb-8">
            {/* Red logo badge with white brand icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--red)" }}>
              {/* SVG icon representing layered data structure */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            {/* High-visibility CIRP branding */}
            <h1 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
              CIR<span style={{ color: "var(--red)" }}>P</span>
            </h1>
            {/* Descriptive platform name suffix */}
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>Community Issue Reporting Platform</p>
          </div>

          {/* Form mode switcher — allows users to toggle between Login and Registration */}
          <div className="flex rounded-xl p-1 mb-8" style={{ background: "var(--bg)" }}>
            {/* Login mode toggle button */}
            <button
              onClick={() => setMode("login")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                // Background color applies only when active
                background: mode === "login" ? "var(--surface)" : "transparent",
                // Text color darkens when active
                color: mode === "login" ? "var(--text-primary)" : "var(--text-muted)",
                border: "none",
                cursor: "pointer"
              }}
            >
              Sign In
            </button>
            {/* Registration mode toggle button */}
            <button
              onClick={() => setMode("register")}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                // Background color applies only when active
                background: mode === "register" ? "var(--surface)" : "transparent",
                // Text color darkens when active
                color: mode === "register" ? "var(--text-primary)" : "var(--text-muted)",
                border: "none",
                cursor: "pointer"
              }}
            >
              Register
            </button>
          </div>

          {/* Dynamic form input area containing role-specific fields */}
          <div className="flex flex-col gap-4">
            {/* Name input field — visible only during registration mode */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Full Name</label>
                {/* Text input bound to the name state variable */}
                <input type="text" className="form-input" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}

            {/* Email input field — used for both authentication modes */}
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Email Address</label>
              {/* Email input with placeholder bound to the email state */}
              <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password input field — masked characters for security */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold tracking-wider uppercase" style={{ color: "var(--text-secondary)" }}>Password</label>
                {mode === "login" && (
                  <Link href="/forgot-password" style={{ color: "var(--red)", fontSize: "11px", fontWeight: "bold", textDecoration: "none" }}>
                    Forgot Password?
                  </Link>
                )}
              </div>
              {/* Password type input bound to the password state */}
              <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Community town selection dropdown — visible only during registration mode */}
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Your Kasoa Community</label>
                {/* Dropdown menu populated from the KASOA_TOWNS data array */}
                <select className="form-input" value={town} onChange={(e) => setTown(e.target.value)}>
                  {/* Default empty selection prompt */}
                  <option value="">Select your town…</option>
                  {/* Mapping towns to option elements for the dropdown */}
                  {KASOA_TOWNS.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}

            {/* Visual error message container displayed when an authentication failure occurs */}
            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: "var(--red-dim)", color: "var(--red)" }}>
                {/* Display the dynamic error string */}
                {error}
              </p>
            )}

            {/* Primary authentication submission button */}
            <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-base mt-2">
              {/* Dynamic button text based on loading state and form mode */}
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>

          {/* Admin portal entry point for specialized system users */}
          <p className="text-center text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            Are you an admin?{" "}
            {/* Link to the dedicated administrative login route */}
            <Link href="/admin/login" style={{ color: "var(--red)", textDecoration: "none" }}>
              Admin sign in →
            </Link>
          </p>

          {/* Responder portal entry point for emergency response personnel */}
          <p className="text-center text-xs mt-2" style={{ color: "var(--text-muted)" }}>
            Are you a responder?{" "}
            {/* Link to the dedicated responder login route */}
            <Link href="/responder/login" style={{ color: "var(--red)", textDecoration: "none" }}>
              Responder sign in →
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
