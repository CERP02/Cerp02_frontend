// Import the Metadata type from Next.js for defining page-level SEO tags
import type { Metadata } from "next";

// Import the global CSS file using the correct relative path with "./"
import "./globals.css";

// Import the AuthProvider so every page in the app has access to auth state
import { AuthProvider } from "@/context/AuthContext";

// metadata is exported so Next.js injects the correct title and description tags
export const metadata: Metadata = {
  // Browser tab title shown in all pages of the platform
  title: "CERP — Community Emergency Reporting Platform",
  // Meta description for search engines and social media previews
  description:
    "Report floods, fires and road accidents in Kasoa. Connect community members to first responders fast.",
};

// RootLayout wraps every page in the application with the shared HTML structure
export default function RootLayout({
  // children represents the content of whichever page is currently rendered
  children,
}: {
  // TypeScript type for the children prop
  children: React.ReactNode;
}) {
  return (
    // Set the document language to English for accessibility and SEO
    <html lang="en">
      <body>
        {/* AuthProvider gives every page access to the logged-in user's state */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
