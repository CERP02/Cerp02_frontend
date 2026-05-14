import ReportPageContent from "@/components/ReportPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report an Issue — StreetPulse",
  description: "Submit a community maintenance or utility issue report to the Kasoa command center.",
};

/**
 * ReportPage: Entry point for community issue reporting.
 * Uses ReportPageContent to handle role-based access control.
 */
export default function ReportPage() {
  return <ReportPageContent />;
}
