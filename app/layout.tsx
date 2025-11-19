// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://resonanceintelligencecore.com"),
  title: "Resonance Intelligence Core",
  description: "Deterministic inference, replayable legality.",
  icons: {
    icon: "/favicon.ico",                 // Chrome tab
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",      // iOS home screen
  },
  openGraph: {
    title: "Resonance Intelligence Core",
    description: "Deterministic inference, replayable legality.",
    images: [
      {
        url: "/og.svg",                  // lives in /public/og.svg
        width: 1200,
        height: 630,
        alt: "RIC",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resonance Intelligence Core",
    description: "Deterministic inference, replayable legality.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}