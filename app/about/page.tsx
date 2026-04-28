// Import the shared Navbar component for consistent navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the shared Footer component
import Footer from "@/components/layout/Footer";
// Import the user roles section to explain who uses the platform
import UserRoles from "@/components/sections/UserRoles";
// Import the workflow section to explain the response process
import Workflow from "@/components/sections/Workflow";
// Import the roadmap section to show future plans
import Roadmap from "@/components/sections/Roadmap";
// Import Metadata type for SEO configuration
import type { Metadata } from "next";

// Set the browser tab title and description specifically for the About page
export const metadata: Metadata = {
  // Page-specific title shown in the browser tab
  title: "About — CERP",
  // Meta description for search engine indexing
  description: "Learn about the Community Emergency Reporting Platform serving the Kasoa community.",
};

// AboutPage renders at the "/about" route
// It explains what CERP is, who it serves, and the response process
export default function AboutPage() {
  return (
    // Semantic main element wrapping all page content
    <main>
      {/* Shared navigation bar */}
      <CitizenNavbar />

      {/* Page header section with title and mission statement */}
      <div className="pt-32 px-10 max-w-6xl mx-auto pb-0">
        {/* Small uppercase label above the heading */}
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-3"
          style={{ color: "var(--red)" }}
        >
          About CERP
        </p>

        {/* Main page heading */}
        <h1
          className="font-extrabold mb-4"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(36px,5vw,56px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Built for the Kasoa Community
        </h1>

        {/* Mission statement paragraph */}
        <p
          className="text-base max-w-2xl mb-6"
          style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
        >
          The Community Emergency Reporting Platform (CERP) is a digital emergency
          response system designed specifically for the Kasoa community and its
          surrounding towns. It connects citizens directly to first responders —
          reducing the time between an emergency occurring and help arriving.
        </p>

        {/* Second paragraph explaining the problem being solved */}
        <p
          className="text-base max-w-2xl mb-16"
          style={{ color: "var(--text-secondary)", lineHeight: "1.8" }}
        >
          Traditional emergency reporting relies on phone calls that can be slow,
          lost, or misdirected. CERP replaces that with instant GPS-tagged reports,
          photo uploads, and automatic dispatch to the right agency — all from a
          smartphone or computer.
        </p>
      </div>

      {/* Kasoa towns coverage section */}
      <div
        className="py-16 px-10"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--red)" }}
          >
            Coverage Area
          </p>
          {/* Section heading */}
          <h2
            className="font-extrabold mb-8"
            style={{ fontFamily: "Syne, sans-serif", fontSize: "32px" }}
          >
            Serving 10 Kasoa Communities
          </h2>

          {/* Grid of Kasoa community town cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Map over the list of Kasoa towns and render a card for each */}
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
              // Individual town card
              <div
                key={town}
                className="rounded-xl px-4 py-3 text-sm font-medium text-center"
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                {/* Pin emoji and town name */}
                📍 {town}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who uses CERP — citizen, responder, admin role cards */}
      <UserRoles />

      {/* How the response process works — 5-step workflow */}
      <Workflow />

      {/* Deployment roadmap — the three phases of the project */}
      <Roadmap />

      {/* Shared footer */}
      <Footer />
    </main>
  );
}
