// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resonance Intelligence Core",
  description: "Deterministic inference substrate.",
  metadataBase: new URL("https://resonanceintelligencecore.com"),
  icons: {
    icon: "/favicon.svg", // point this at ric-spiral.svg or a copy of it
  },
  openGraph: {
    title: "Resonance Intelligence Core",
    description: "Deterministic inference, replayable legality.",
    url: "https://resonanceintelligencecore.com",
    siteName: "Resonance Intelligence Core",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonance Intelligence Core",
    description: "Deterministic inference, replayable legality.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-50 antialiased">
        {children}
      </body>
    </html>
  );
}