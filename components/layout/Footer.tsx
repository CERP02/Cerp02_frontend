// Import Next.js Link for navigation links in the footer
import Link from "next/link";

// Footer is the shared bottom section displayed on every page
export default function Footer() {
  // footerLinks defines the navigation links shown in the footer
  // Each entry is [label, href] for easy mapping
  const footerLinks: [string, string][] = [
    // Link to the about page explaining CERP's mission
    ["About CERP", "/about"],
    // Link to the report form for submitting incidents
    ["Report Incident", "/report"],
    // Link to the live dashboard
    ["Dashboard", "/dashboard"],
    // Link to the alerts page
    ["Alerts", "/alerts"],
    // Link to the citizen login page
    ["Sign In", "/login"],
    // Link to the admin command center login
    ["Admin Portal", "/admin/login"],
  ];

  return (
    // Semantic footer element with top border separating it from page content
    <footer
      className="py-12 px-10 text-center"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}
    >
      {/* Platform wordmark — CERP with the P in red */}
      <div
        className="text-xl font-extrabold mb-2"
        style={{ fontFamily: "Syne, sans-serif" }}
      >
        CER<span style={{ color: "var(--red)" }}>P</span>
      </div>

      {/* Platform tagline */}
      <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
        Community Emergency Reporting Platform
      </p>

      {/* Geographic focus description */}
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        Serving Kasoa and surrounding communities in the Central Region, Ghana
      </p>

      {/* Footer navigation links */}
      <ul className="flex gap-6 justify-center list-none flex-wrap mb-6">
        {/* Map over footerLinks and render each as a Link */}
        {footerLinks.map(([label, href]) => (
          <li key={label}>
            {/* Use Next.js Link for client-side navigation */}
            <Link
              href={href}
              // footer-link class handles hover styling via CSS in globals.css
              className="footer-link text-sm transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Copyright notice with dynamic current year */}
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} CERP — Community Emergency Reporting Platform. All rights reserved.
      </p>
    </footer>
  );
}
