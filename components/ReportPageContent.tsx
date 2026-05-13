"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CitizenNavbar from "@/components/layout/CitizenNavbar";
import ReportForm from "@/components/sections/ReportForm";
import Footer from "@/components/layout/Footer";

/**
 * ReportPageContent: Protected content for the report page.
 * Redirects admins, superadmins, and responders away from the citizen reporting flow.
 */
export default function ReportPageContent() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is logged in but NOT a user, redirect to their appropriate dashboard
    if (!loading && user && user.role !== "user") {
      const target = user.role === "responder" ? "/responder" : "/admin";
      router.push(target);
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-bg" />;
  
  // Show nothing while redirecting non-users
  if (user && user.role !== "user") return <div className="min-h-screen bg-bg" />;

  return (
    <main>
      <CitizenNavbar />
      <div className="pt-28 pb-0">
        <div className="max-w-4xl mx-auto px-10 pt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-4">Community Issue Reporting</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tighter" style={{ fontFamily: "Syne" }}>
            Report an Issue
          </h1>
          <p className="text-base text-white/50 max-w-lg leading-relaxed mb-10">
            Your report goes directly to the Kasoa Command Center for verification. 
            Fill in all details to help agencies resolve the issue quickly.
          </p>
        </div>
        <ReportForm />
      </div>
      <Footer />
    </main>
  );
}
