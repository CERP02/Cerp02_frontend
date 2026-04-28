// Import the shared Navbar component for consistent navigation
import CitizenNavbar from "@/components/layout/CitizenNavbar";
// Import the interactive ReportForm section component
import ReportForm from "@/components/sections/ReportForm";
// Import the shared Footer component
import Footer from "@/components/layout/Footer";
// Import Metadata type for SEO tags
import type { Metadata } from "next";

// Set the browser tab title and description for the report page
export const metadata: Metadata = {
  // Page-specific tab title
  title: "Report an Incident — CERP",
  // Meta description for search engine indexing
  description: "Submit a flood, fire, or road accident report to the Kasoa community command center.",
};

// ReportPage renders at the "/report" route
// Citizens use this page to file an emergency report
export default function ReportPage() {
  return (
    // Semantic main element wrapping all page content
    <main>
      {/* Fixed navigation bar */}
      <CitizenNavbar />

      {/* Page header with title and instructions */}
      <div className="pt-28 pb-0">
        <div className="max-w-4xl mx-auto px-10 pt-8">
          {/* Small uppercase label */}
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--red)" }}
          >
            Emergency Reporting
          </p>

          {/* Main page heading */}
          <h1
            className="font-extrabold mb-2"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Report an Incident
          </h1>

          {/* Supporting description for citizens */}
          <p
            className="text-base mb-0 max-w-lg"
            style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
          >
            Your report goes directly to the Kasoa Community Command Center for
            verification and dispatch. Fill in as much detail as possible to help
            responders reach you quickly.
          </p>
        </div>

        {/* The interactive report form with incident type, severity, location, and description fields */}
        <ReportForm />
      </div>

      {/* Shared footer */}
      <Footer />
    </main>
  );
}
