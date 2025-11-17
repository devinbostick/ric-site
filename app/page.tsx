// app/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16 flex flex-col gap-16">
        {/* Brand + simple nav */}
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-full border border-neutral-700/80 bg-neutral-900/80 flex items-center justify-center">
              <Image
                src="/ric-spiral.svg"
                alt="Resonance Intelligence Core spiral"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold tracking-[0.22em] text-neutral-400 uppercase">
                Resonance Intelligence
              </span>
              <span className="text-sm font-medium text-neutral-100">
                Resonance Intelligence Core
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
            <Link href="/demo" className="hover:text-neutral-100">
              Legality demo
            </Link>
            <Link href="/stem" className="hover:text-neutral-100">
              RIC-STEM v1
            </Link>
            <Link href="/ric-stem" className="hover:text-neutral-100">
              RIC-STEM overview
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Resonance Intelligence Core
            </h1>
            <p className="text-lg md:text-xl text-neutral-300">
              Deterministic inference, replayable legality.
            </p>
            <p className="text-sm md:text-base text-neutral-400 max-w-2xl">
              RIC is a deterministic substrate for running models under hard
              rules. Every run is fixed-point, fully replayable, and produces a
              proof bundle you can audit later.
            </p>
          </div>

          {/* Three-pill stack */}
          <div className="grid gap-4">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
                Substrate
              </div>
              <div className="mt-1 md:mt-0">
                <div className="text-sm font-medium text-neutral-50">
                  Q32 deterministic core
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  No floats, no randomness. Same input → same bits across
                  machines.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
                Legality
              </div>
              <div className="mt-1 md:mt-0">
                <div className="text-sm font-medium text-neutral-50">
                  Pre-emission gating
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  RIC checks each candidate step against safety and legality
                  rules before emitting.
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-[11px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
                STEM
              </div>
              <div className="mt-1 md:mt-0">
                <div className="text-sm font-medium text-neutral-50">
                  Deterministic math engine
                </div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Linear ODEs and algebra over the substrate, with metrics and
                  replayable runs.
                </div>
              </div>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full bg-neutral-50 text-neutral-950 px-6 py-2.5 text-sm font-semibold hover:bg-neutral-200 transition"
            >
              Open legality demo
            </Link>
            <Link
              href="/stem"
              className="inline-flex items-center justify-center rounded-full border border-neutral-600 bg-neutral-950 px-6 py-2.5 text-sm font-semibold text-neutral-50 hover:border-neutral-300 transition"
            >
              Open RIC-STEM engine
            </Link>
          </div>
        </section>

        {/* API access */}
        <section className="mt-4 rounded-2xl border border-neutral-800 bg-neutral-900/70 px-4 py-6 md:px-6 md:py-7">
          <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-neutral-400">
            API access
          </h2>
          <p className="mt-2 text-sm text-neutral-300">
            Want access to the RIC API or a pilot integration?
          </p>

          <form
            action="https://formspree.io/f/mvgbybpa"
            method="POST"
            className="mt-4 flex flex-col sm:flex-row gap-3"
          >
            <input type="text" name="_gotcha" className="hidden" autoComplete="off" />

            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-50 placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300"
            />
            <input type="hidden" name="_subject" value="RIC API access request" />
            <input type="hidden" name="_next" value="/thanks" />

            <button
              type="submit"
              className="rounded-xl bg-neutral-50 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-200 transition"
            >
              Request API access
            </button>
          </form>

          <p className="mt-2 text-[11px] text-neutral-500">
            One or two emails as we open pilots. No spam.
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-900 pt-6 mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex flex-wrap gap-4">
            <Link href="/demo" className="underline underline-offset-2">
              Legality demo
            </Link>
            <Link href="/legality-demo" className="underline underline-offset-2">
              Legality overview
            </Link>
            <Link href="/stem" className="underline underline-offset-2">
              RIC-STEM v1
            </Link>
            <Link href="/ric-stem" className="underline underline-offset-2">
              RIC-STEM overview
            </Link>
          </div>
          <div>© {new Date().getFullYear()} Resonance Intelligence Core</div>
        </footer>
      </div>
    </main>
  );
}