"use client";

// Import React hooks and navigation utilities
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// Import the auth context to check user role
import { useAuth } from "@/context/AuthContext";
// Import the shared Navbar component used across all public pages
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the hero section with animated stats and CTA buttons
import Hero from "@/components/sections/Hero";
// Import the community issue type cards section
import IncidentTypes from "@/components/sections/IncidentTypes";
// Import the 5-step issue resolution workflow diagram
import Workflow from "@/components/sections/Workflow";
// Import the three user role cards (citizen, responder, admin)
import UserRoles from "@/components/sections/UserRoles";
// Import the KPI metrics strip
import KPIs from "@/components/sections/KPIs";
// Import the deployment roadmap phases section
import Roadmap from "@/components/sections/Roadmap";
// Import the shared Footer component
import Footer from "@/components/layout/Footer";

// Home is the default export rendered at the root route "/"
// It serves as the public landing page for the CERP community issue platform
export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is still loading, wait
    if (loading) return;

    // Redirect non-citizen users to their respective dashboards
    if (user) {
      if (user.role === "admin" || user.role === "superadmin") {
        router.push("/admin");
      } else if (user.role === "responder") {
        router.push("/responder");
      }
    }
  }, [user, loading, router]);

  // Show loading state or nothing while checking auth status
  if (loading) {
    return null;
  }

  // If user is admin/responder, they will be redirected above
  if (user && (user.role === "admin" || user.role === "superadmin" || user.role === "responder")) {
    return null;
  }

  return (
    // main wraps all page sections in a semantic HTML landmark element
    <main>
      {/* Fixed navigation bar shown at the top of every page */}
      <CitizenNavbar />
      {/* Full-height hero section with animated issue counters and CTA buttons */}
      <Hero />
      {/* Cards explaining the ten community issue categories CERP handles */}
      <IncidentTypes />
      {/* Visual diagram of the 5-step report-to-resolution workflow */}
      <Workflow />
      {/* Three cards describing the Citizen, Responder, and Admin user roles */}
      <UserRoles />
      {/* Strip of four key performance indicators with values and trends */}
      <KPIs />
      {/* Three-phase deployment roadmap for the Kasoa community rollout */}
      <Roadmap />
      {/* Footer with links and copyright */}
      <Footer />
    </main>
  );
}
