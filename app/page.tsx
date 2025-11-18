// app/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 md:py-10">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
              RIC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Resonance
              </span>
              <span className="text-sm font-medium text-neutral-800">
                Intelligence Core
              </span>
            </div>
          </Link>

          <nav className="hidden gap-4 text-xs md:flex md:text-sm">
            <Link
              href="/demo"
              className="text-neutral-700 hover:text-neutral-900 underline-offset-4 hover:underline"
            >
              Legality demo
            </Link>
            <Link
              href="/stem"
              className="text-neutral-700 hover:text-neutral-900 underline-offset-4 hover:underline"
            >
              RIC-STEM
            </Link>
            <Link
              href="/ric-stem"
              className="text-neutral-700 hover:text-neutral-900 underline-offset-4 hover:underline"
            >
              STEM overview
            </Link>
            <Link
              href="/legality-demo"
              className="text-neutral-700 hover:text-neutral-900 underline-offset-4 hover:underline"
            >
              Legality overview
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <div className="w-full max-w-3xl space-y-6">
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Deterministic inference for models and STEM.
            </h1>

            <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
              Resonance Intelligence Core (RIC) is a deterministic inference
              substrate. It sits between your application and your models or
              math, checks every step, and produces the same answer every time
              with a replayable proof of what happened.
            </p>

            <div className="grid gap-3 text-xs text-neutral-700 md:grid-cols-3 md:text-sm">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="font-medium mb-1">Deterministic runs</p>
                <p className="leading-snug">
                  Same input → same output, bit-for-bit, across machines.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="font-medium mb-1">Replayable legality</p>
                <p className="leading-snug">
                  Every decision is logged with a structured bundle you can
                  replay later.
                </p>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
                <p className="font-medium mb-1">STEM engine</p>
                <p className="leading-snug">
                  Linear ODEs and linear algebra run on a fixed-point Q32
                  engine with exposed metrics.
                </p>
              </div>
            </div>

            {/* Primary actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Open legality demo
              </Link>
              <Link
                href="/stem"
                className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-900 bg-white hover:bg-neutral-50"
              >
                Try RIC-STEM engine
              </Link>
            </div>
          </div>

          {/* Secondary sections */}
          <div className="mt-10 grid w-full gap-6 md:grid-cols-2">
            {/* Legality card */}
            <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                Legality filter
              </p>
              <h2 className="text-base font-semibold">
                Put a deterministic gate in front of your model.
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                RIC acts as a deterministic audit layer in front of a stochastic
                model. The model proposes; RIC applies hard rules and either
                passes the candidate or halts it, with a replayable trace.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <Link
                  href="/legality-demo"
                  className="underline underline-offset-2 text-neutral-900"
                >
                  Read the legality overview →
                </Link>
                <Link
                  href="/demo"
                  className="underline underline-offset-2 text-neutral-900"
                >
                  Open the live demo →
                </Link>
              </div>
            </section>

            {/* STEM card */}
            <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                RIC-STEM v1
              </p>
              <h2 className="text-base font-semibold">
                Deterministic STEM engine over the substrate.
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                RIC-STEM exposes a linear ODE integrator and a linear system
                solver. All math runs in fixed-point Q32 on the substrate, with
                counters exposed at{" "}
                <code className="rounded bg-neutral-100 px-1 py-[1px] text-[11px]">
                  GET /metrics
                </code>
                .
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <Link
                  href="/stem"
                  className="underline underline-offset-2 text-neutral-900"
                >
                  Try the RIC-STEM demo →
                </Link>
                <Link
                  href="/ric-stem"
                  className="underline underline-offset-2 text-neutral-900"
                >
                  Read the STEM overview →
                </Link>
              </div>
            </section>
          </div>

          {/* API access + paper */}
          <div className="mt-10 grid w-full gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* API access */}
            <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                API access
              </p>
              <h2 className="text-base font-semibold">Interested in using RIC?</h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                RIC is being piloted as a deterministic substrate for legal-tech,
                claims workflows, and STEM applications. Share your email and we
                will follow up.
              </p>

              <form
                action="https://formspree.io/f/mvgbybpa"
                method="POST"
                className="mt-2 space-y-3"
              >
                <input type="text" name="_gotcha" className="hidden" />

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-neutral-700"
                  >
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="usecase"
                    className="block text-xs font-medium text-neutral-700"
                  >
                    Brief use case (optional)
                  </label>
                  <textarea
                    id="usecase"
                    name="message"
                    rows={3}
                    placeholder="e.g., deterministic filter for legal model, or ODE workflows."
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                </div>

                <input type="hidden" name="_subject" value="New RIC API interest" />
                <input type="hidden" name="_next" value="/thanks" />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Contact me about API access
                </button>

                <p className="text-[11px] text-neutral-500">
                  No bulk mail. Only RIC pilot follow-ups.
                </p>
              </form>
            </section>

            {/* Theory link */}
            <section className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                Deeper theory
              </p>
              <h2 className="text-base font-semibold">
                Empirical convergence map for CODES.
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                The CODES framework defines the coherence law underneath RIC.
                The main paper covers the math, empirical systems, and substrate
                generalization across physics, biology, and computation.
              </p>
              <a
                href="https://zenodo.org/records/17545317"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-xs font-medium text-neutral-900 underline underline-offset-2"
              >
                Open “CODES: The Coherence Framework Replacing Probability…” →
              </a>
              <p className="text-[11px] text-neutral-500">
                RIC is the substrate derived from this framework.
              </p>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-10 flex w-full flex-col items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[11px] text-neutral-500 md:flex-row">
            <span>© {new Date().getFullYear()} Resonance Intelligence Core</span>
            <div className="flex gap-3">
              <Link
                href="/stem"
                className="underline underline-offset-2 hover:text-neutral-700"
              >
                RIC-STEM v1
              </Link>
              <Link
                href="/demo"
                className="underline underline-offset-2 hover:text-neutral-700"
              >
                Legality demo
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}