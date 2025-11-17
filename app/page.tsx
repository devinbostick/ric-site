// app/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 md:py-16">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full bg-white/5 shadow-[0_0_60px_rgba(255,255,255,0.18)] flex items-center justify-center overflow-hidden">
              {/* Logo mark */}
              <Image
                src="/ric-spiral.svg"
                alt="Resonance Intelligence Core"
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                Resonance Intelligence
              </span>
              <span className="text-sm font-semibold text-neutral-100">
                Resonance Intelligence Core
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-4 text-xs md:flex text-neutral-300">
            <Link href="/demo" className="hover:text-white">
              Legality demo
            </Link>
            <Link href="/stem" className="hover:text-white">
              RIC-STEM
            </Link>
            <Link href="/ric-stem" className="hover:text-white">
              Docs
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="mt-14 flex flex-1 flex-col gap-10 md:mt-20 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Deterministic inference,
              <br />
              replayable legality.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-neutral-300 md:text-base">
              Resonance Intelligence Core (RIC) is a deterministic substrate for
              running models under hard rules. Every run is fixed-point, fully
              replayable, and produces a proof bundle you can audit later.
            </p>

            <div className="grid gap-3 text-xs text-neutral-200 md:grid-cols-3 md:text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Substrate
                </div>
                <div className="mt-1 font-medium">
                  Q32 deterministic core
                </div>
                <p className="mt-1 text-[11px] text-neutral-300">
                  No floats, no randomness. Same input → same bits across
                  machines.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Legality
                </div>
                <div className="mt-1 font-medium">Pre-emission gating</div>
                <p className="mt-1 text-[11px] text-neutral-300">
                  RIC checks each candidate step against safety and legality
                  rules before emitting.
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  STEM
                </div>
                <div className="mt-1 font-medium">Deterministic math engine</div>
                <p className="mt-1 text-[11px] text-neutral-300">
                  Linear ODEs and algebra over the substrate, with metrics and
                  replayable runs.
                </p>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="mt-2 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-md hover:bg-neutral-100"
              >
                Open legality demo
              </Link>
              <Link
                href="/stem"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                Open RIC-STEM engine
              </Link>
            </div>
          </div>

          {/* Right column: email + quick facts */}
          <div className="mt-8 w-full max-w-sm space-y-4 md:mt-0 md:w-80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-300">
                API access
              </p>
              <p className="mt-1 text-sm text-neutral-100">
                Want access to the RIC API or a pilot integration?
              </p>

              <form
                action="https://formspree.io/f/mvgbybpa"
                method="POST"
                className="mt-4 space-y-2"
              >
                <input
                  type="text"
                  name="_gotcha"
                  className="hidden"
                  autoComplete="off"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                  className="w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-white/60"
                />
                <input
                  type="hidden"
                  name="_subject"
                  value="New RIC API interest"
                />
                <input type="hidden" name="_next" value="/thanks" />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-xl bg-white py-2.5 text-sm font-semibold text-black hover:bg-neutral-100"
                >
                  Request API access
                </button>
                <p className="text-[10px] text-neutral-400">
                  One or two emails as we open pilots. No spam.
                </p>
              </form>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs text-neutral-300">
              <div className="font-semibold text-neutral-100">
                Live endpoints
              </div>
              <ul className="mt-1 space-y-1.5 font-mono text-[11px]">
                <li>
                  <span className="text-neutral-400">STEM:</span> POST
                  /stem/run, POST /algebra/run
                </li>
                <li>
                  <span className="text-neutral-400">Legality core:</span> POST
                  /run, POST /replay
                </li>
                <li>
                  <span className="text-neutral-400">Metrics:</span> GET
                  /metrics
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-xs text-neutral-600">
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
            <span>© 2025 Resonance Intelligence Core</span>
          </div>
        </footer>
      </div>
    </main>
  );
}