// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resonance Intelligence Core",
  description: "Deterministic inference, replayable legality.",
  icons: {
    icon: "/ric-spiral.svg",
    shortcut: "/ric-spiral.svg",
    apple: "/ric-spiral.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-50">
        {children}
      </body>
    </html>
  );
}