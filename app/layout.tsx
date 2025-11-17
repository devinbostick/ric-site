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