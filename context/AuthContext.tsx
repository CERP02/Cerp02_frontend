"use client";

// Import React hooks and types needed to create and use the auth context
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Import the AuthUser type that describes the logged-in user's profile
import type { AuthUser } from "@/lib/api";

// AuthContextType defines the shape of the data and functions the context provides
interface AuthContextType {
  // user holds the currently logged-in user's profile, or null if not logged in
  user: AuthUser | null;
  // login is called after a successful login/register to store the user in context
  login: (user: AuthUser) => void;
  // logout clears the user from context and removes the token from localStorage
  logout: () => void;
  // loading is true while the app checks localStorage for a saved session on startup
  loading: boolean;
}

// AuthContext is the React context object shared across all components
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider wraps the entire app so all pages can access auth state
export function AuthProvider({ children }: { children: ReactNode }) {
  // user holds the currently authenticated user's profile data
  const [user, setUser] = useState<AuthUser | null>(null);
  // loading is true on first render while we check for a saved token
  const [loading, setLoading] = useState(true);

  // On first load, check if there is a saved user profile in localStorage
  useEffect(() => {
    try {
      // Try to read the saved user profile string from localStorage
      const saved = localStorage.getItem("cerp_user");
      // If a saved profile exists, parse it and restore the session
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // If parsing fails, clear the corrupted data
      localStorage.removeItem("cerp_user");
    } finally {
      // Always mark loading as complete so the UI can render
      setLoading(false);
    }
  }, []);

  // login stores the user profile in state and persists it to localStorage
  const login = (userData: AuthUser) => {
    // Update the in-memory user state so all components re-render
    setUser(userData);
    // Save the user profile to localStorage so the session survives page refreshes
    localStorage.setItem("cerp_user", JSON.stringify(userData));
  };

  // logout clears the user from state and removes all auth data from localStorage
  const logout = () => {
    // Clear the user from in-memory state
    setUser(null);
    // Remove the JWT token so future API requests are unauthenticated
    localStorage.removeItem("cerp_token");
    // Remove the saved user profile
    localStorage.removeItem("cerp_user");
  };

  return (
    // Provide the auth state and functions to all child components
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth is a custom hook that gives any component easy access to the auth context
export function useAuth() {
  // Read the context value set by AuthProvider
  const ctx = useContext(AuthContext);
  // Throw a clear error if useAuth is called outside of AuthProvider
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  // Return the context value so the calling component can use user, login, logout
  return ctx;
}
