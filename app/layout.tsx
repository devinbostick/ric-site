export const metadata = { title: "Resonance Intelligence Core", description: "Deterministic inference substrate." };
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <main>{children}</main>
      </body>
    </html>
  );
}
