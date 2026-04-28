// Import the shared Navbar component used across all pages
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the hero section with animated stats and CTA buttons
import Hero from "@/components/sections/Hero";
// Import the three incident type cards (flood, fire, accident)
import IncidentTypes from "@/components/sections/IncidentTypes";
// Import the 5-step dispatch workflow diagram
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
// It serves as the public landing page for the CERP platform
export default function Home() {
  return (
    // main wraps all page sections in a semantic HTML landmark element
    <main>
      {/* Fixed navigation bar shown at the top of every page */}
      <CitizenNavbar />
      {/* Full-height hero section with animated incident counters and CTA buttons */}
      <Hero />
      {/* Cards explaining the three emergency categories CERP handles */}
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
