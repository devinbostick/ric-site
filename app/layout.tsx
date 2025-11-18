// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resonance Intelligence Core",
  description: "Deterministic inference, replayable legality.",
  icons: {
    icon: "/ric-icon.svg",
    shortcut: "/ric-icon.svg",
    apple: "/ric-icon.svg",
  },
  openGraph: {
    title: "Resonance Intelligence Core",
    description: "Deterministic inference, replayable legality.",
    images: [
      {
        url: "/og.png",
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
    images: ["/og.png"],
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