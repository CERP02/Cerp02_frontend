// Import the Metadata type from Next.js for defining page meta tags
import type { Metadata } from "next";

// Import the global CSS file that sets CSS variables and Tailwind base styles
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

// metadata is exported so Next.js can inject the correct <title> and <meta> tags
export const metadata: Metadata = {
  // Browser tab title and SEO title for the platform
  title: "CERP — Community Emergency Reporting Platform",
  // Meta description used by search engines and social sharing previews
  description:
    "Report floods, fires and road accidents in Kasoa. Connect community members to first responders fast.",
};

// RootLayout wraps every page in the application with the shared HTML shell
export default function RootLayout({
  // children represents the content of whichever page is currently being rendered
  children,
}: {
  // TypeScript type for the children prop — any valid React content
  children: React.ReactNode;
}) {
  return (
    // Set the page language to English for accessibility and SEO
    <html lang="en">
  <body>
    <AuthProvider>
      {children}
    </AuthProvider>
  </body>
</html>
  );
}
