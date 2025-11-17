// app/page.tsx

"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white text-neutral-900">
      <div className="mx-auto flex max-w-6xl flex-col px-4 pb-20 pt-16 md:pt-24">
        {/* Hero */}
        <header className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-start">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-neutral-900 text-white px-3 py-1 text-[11px] font-medium">
              Deterministic substrate • Replayable reasoning
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
              Resonance Intelligence Core
            </h1>

            <p className="text-base md:text-lg text-neutral-700 leading-relaxed max-w-xl">
              RIC is a deterministic reasoning substrate for systems that cannot
              guess. Every run uses fixed-point arithmetic, produces the same
              answer for the same input, and can be replayed bit-for-bit with a
              signed proof bundle.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                View legality demo
              </Link>
              <Link
                href="/stem"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Try RIC-STEM v1
              </Link>
            </div>

            <p className="text-xs text-neutral-500">
              Building for legal tech, STEM reasoning, and safety-critical
              infrastructure.
            </p>

            <p className="text-xs text-neutral-500">
              Or see RIC act as a deterministic filter in the{" "}
              <Link href="/demo" className="underline underline-offset-2">
                legality demo →
              </Link>
            </p>
          </div>

          {/* API access / email capture */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold mb-1.5">
              Want API access?
            </h2>
            <p className="text-xs text-neutral-600 mb-4">
              Share your email and use case. We’re giving early access to a
              small set of partners who need deterministic reasoning and audit.
            </p>

            <form
              action="https://formspree.io/f/mvgbybpa"
              method="POST"
              className="space-y-3"
            >
              <input
                type="text"
                name="_gotcha"
                className="hidden"
                autoComplete="off"
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-medium text-neutral-700">
                  Work email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-medium text-neutral-700">
                  What do you want to use RIC for?
                </label>
                <textarea
                  name="use_case"
                  rows={3}
                  placeholder="e.g. legal claims engine, STEM reasoning, compliance audit…"
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <input type="hidden" name="_subject" value="RIC API access request" />
              <input type="hidden" name="_next" value="/thanks" />

              <button
                type="submit"
                className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Request API access
              </button>

              <p className="text-[11px] text-neutral-500 text-center">
                Low-volume updates. No sharing, no spam.
              </p>
            </form>
          </div>
        </header>

        {/* What RIC does */}
        <section className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-1.5">Deterministic runs</h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              No randomness in the core. Same request always yields the same
              answer, across machines and operating systems.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-1.5">Replay & audit</h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Every run is replayable bit-for-bit and can be wrapped in a
              cryptographic proof bundle for compliance, audit, or dispute
              resolution.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-1.5">STEM-grade numerics</h3>
            <p className="text-xs text-neutral-700 leading-relaxed">
              Fixed-point Q32 numerics, linear ODE integration, and linear
              algebra are live today via the RIC-STEM engine.
            </p>
          </div>
        </section>

        {/* Links row */}
        <section className="mt-12 border-t border-neutral-200 pt-6 text-xs text-neutral-600 flex flex-wrap gap-4 justify-between">
          <div className="space-x-4">
            <Link href="/demo" className="underline underline-offset-2">
              Legality demo
            </Link>
            <Link href="/stem" className="underline underline-offset-2">
              RIC-STEM v1
            </Link>
            <Link href="/ric-stem" className="underline underline-offset-2">
              RIC-STEM overview
            </Link>
          </div>
          <p className="text-[11px] text-neutral-500">
            © {new Date().getFullYear()} Resonance Intelligence Core
          </p>
        </section>
      </div>
    </main>
  );
}