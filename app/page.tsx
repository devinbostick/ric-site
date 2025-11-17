import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="w-full border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/ric-spiral.svg"
              alt="RIC Spiral"
              width={34}
              height={34}
            />
            <div className="leading-tight">
              <p className="text-xs tracking-[0.18em] text-neutral-500">
                RESONANCE INTELLIGENCE
              </p>
              <p className="text-sm font-medium">Resonance Intelligence Core</p>
            </div>
          </Link>

          {/* Nav */}
          <nav className="flex gap-6 text-sm text-neutral-600">
            <Link href="/legality-demo" className="hover:text-black">
              Legality demo
            </Link>
            <Link href="/stem" className="hover:text-black">
              RIC-STEM v1
            </Link>
            <Link href="/ric-stem" className="hover:text-black">
              RIC-STEM overview
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Deterministic inference,
          <br />
          replayable legality.
        </h1>

        <p className="mt-6 text-lg max-w-3xl text-neutral-700 leading-relaxed">
          Resonance Intelligence Core (RIC) is a deterministic substrate for
          running models under hard rules. Every run is fixed-point, fully
          replayable, and produces a proof bundle you can audit later.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/demo"
            className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-90"
          >
            Open legality demo →
          </Link>
          <Link
            href="/stem"
            className="px-6 py-3 rounded-full border border-neutral-300 text-sm font-medium hover:bg-neutral-100"
          >
            Open RIC-STEM engine →
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 p-5">
            <p className="text-xs tracking-[0.17em] text-neutral-500 mb-2">
              SUBSTRATE
            </p>
            <p className="font-medium">Q32 deterministic core</p>
            <p className="text-sm text-neutral-600 mt-1">
              No floats. No randomness. Same input → same bits across machines.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-5">
            <p className="text-xs tracking-[0.17em] text-neutral-500 mb-2">
              LEGALITY
            </p>
            <p className="font-medium">Pre-emission gating</p>
            <p className="text-sm text-neutral-600 mt-1">
              RIC checks each candidate step against safety and legality rules
              before emitting.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 p-5">
            <p className="text-xs tracking-[0.17em] text-neutral-500 mb-2">
              STEM
            </p>
            <p className="font-medium">Deterministic math engine</p>
            <p className="text-sm text-neutral-600 mt-1">
              Linear ODEs and algebra over the substrate, with metrics and
              replayable runs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-200 py-10">
        <div className="mx-auto max-w-5xl px-6 text-sm text-neutral-500 flex flex-wrap gap-6">
          <Link href="/demo" className="hover:text-black">
            Legality demo →
          </Link>
          <Link href="/stem" className="hover:text-black">
            RIC-STEM v1 →
          </Link>
          <Link href="/ric-stem" className="hover:text-black">
            RIC-STEM overview →
          </Link>
          <span className="ml-auto">
            © {new Date().getFullYear()} Resonance Intelligence Core
          </span>
        </div>
      </footer>
    </main>
  );
}