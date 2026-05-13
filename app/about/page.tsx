// Import the shared Navbar component for consistent navigation across the citizen portal
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the shared Footer component for the bottom of the page
import Footer from "@/components/layout/Footer";
// Import the user roles section to explain who uses the CIRP platform
import UserRoles from "@/components/sections/UserRoles";
// Import the workflow section to explain the community issue resolution process
import Workflow from "@/components/sections/Workflow";
// Import the roadmap section to show future deployment phases
import Roadmap from "@/components/sections/Roadmap";
// Import Metadata type for SEO configuration in Next.js
import type { Metadata } from "next";

// Set the browser tab title and description specifically for the CIRP About page
export const metadata: Metadata = {
  // Page-specific title shown in the browser tab for brand recognition
  title: "About — CIRP",
  // Meta description for search engine indexing and social sharing
  description: "Learn about the Community Issue Reporting Platform serving the Kasoa community.",
};

// AboutPage renders at the "/about" route of the application
// It explains what CIRP is, its mission for Kasoa, and the issue resolution process
export default function AboutPage() {
  return (
    // Semantic main element wrapping all page content for accessibility
    <main>
      {/* Shared navigation bar positioned at the top of the page */}
      <CitizenNavbar />

      {/* Page header section containing the main title and core mission statement */}
      <div className="pt-32 px-10 max-w-6xl mx-auto pb-0">
        {/* Small uppercase label above the heading to categorize the section */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--red)" }}
        >
          About CIRP
        </p>

        {/* Main page heading with responsive typography for modern display */}
        <h1
          className="font-extrabold mb-4"
          style={{
            // Use the Syne font for a bold, distinctive brand appearance
            fontFamily: "Syne, sans-serif",
            // Clamp ensures the font scales between 36px and 56px based on viewport
            fontSize: "clamp(36px,5vw,56px)",
            // Tight letter spacing for a compact, authoritative look
            letterSpacing: "-0.02em",
            // Reduced line height for display headings
            lineHeight: 1.1,
          }}
        >
          Built for the Kasoa Community
        </h1>

        {/* Primary mission statement paragraph explaining the CIRP platform purpose */}
        <p
          className="text-base max-w-2xl mb-6"
          style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
        >
          The Community Issue Reporting Platform (CIRP) is a digital civic engagement
          system designed specifically for the Kasoa community and its surrounding towns.
          It connects citizens directly to government and utility agencies —
          reducing the time between a community issue being spotted and it being resolved.
        </p>

        {/* Second paragraph explaining the value proposition of digitized reporting */}
        <p
          className="text-base max-w-2xl mb-16"
          style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
        >
          Traditional issue reporting relies on physical visits or phone calls that can be slow
          or unrecorded. CIRP replaces that with instant GPS-tagged reports, photo uploads,
          and automatic assignment to the right agency — such as GWCL, ECG, or the Police —
          ensuring full accountability and faster response.
        </p>
      </div>

      {/* Geographic coverage section listing the Kasoa towns served by the platform */}
      <div
        className="py-16 px-10"
        style={{
          // Surface background color to separate this section from the header
          background: "var(--surface)",
          // Subtle horizontal borders for visual structure
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)"
        }}
      >
        {/* Centered container for the coverage area content */}
        <div className="max-w-6xl mx-auto">
          {/* Section label in brand red */}
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--red)" }}
          >
            Coverage Area
          </p>
          {/* Section heading for the geographic list */}
          <h2
            className="font-extrabold mb-8"
            style={{ fontFamily: "Syne, sans-serif", fontSize: "32px" }}
          >
            Serving 10 Kasoa Communities
          </h2>

          {/* Grid layout for community town cards — 2 columns on mobile, 5 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Map over the static list of Kasoa community towns */}
            {[
              "Kasoa Central",
              "Akweley",
              "Opeikuma",
              "Millennium City",
              "Lamptey Mills",
              "Ofaakor",
              "Gomoa Pomadze",
              "Bawjiase",
              "Nyanyano",
              "Awutu Bereku",
            ].map((town) => (
              // Individual community town card with hover-ready styling
              <div
                key={town}
                className="rounded-xl px-4 py-3 text-sm font-medium text-center"
                style={{
                  // Secondary surface background color
                  background: "var(--surface2)",
                  // Subtle card border
                  border: "1px solid var(--border)",
                  // Muted text color for the town name
                  color: "var(--text-secondary)",
                }}
              >
                {/* Visual marker emoji followed by the town name */}
                📍 {town}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component explaining the three main user roles: citizen, responder, admin */}
      <UserRoles />

      {/* Component illustrating the 5-step issue reporting and resolution workflow */}
      <Workflow />

      {/* Component outlining the multi-phase deployment roadmap for the Kasoa area */}
      <Roadmap />

      {/* Global shared footer displayed at the bottom of the page */}
      <Footer />
    </main>
  );
}
