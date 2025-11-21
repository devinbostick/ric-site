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
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Legality demo
            </Link>
            <Link
              href="/stem"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              RIC-STEM
            </Link>
            <Link
              href="/ric-stem"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              STEM overview
            </Link>
            <Link
              href="/legality-demo"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Legality overview
            </Link>
          </nav>
        </header>

        {/* Main content */}
        <section className="flex flex-1 flex-col gap-10">
          {/* Hero */}
          <section className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500">
                  Deterministic reasoning infrastructure
                </p>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Deterministic Reasoning Intelligence for critical systems.
                </h1>
                <p className="text-sm leading-relaxed text-neutral-700 md:text-base">
                  RIC executes reasoning as a reproducible process — same input →
                  same steps → same output — with a full proof bundle for every
                  run. No randomness. No clocks. No drift.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90"
                  >
                    Open legality demo
                  </Link>
                  <Link
                    href="/stem"
                    className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
                  >
                    Try deterministic STEM
                  </Link>
                </div>
              </div>

              <div className="grid flex-1 gap-3 text-xs text-neutral-800 md:text-sm">
                <div className="rounded-2xl border border-neutral-200 bg-white/70 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Reproducible computation
                  </p>
                  <p className="leading-snug">
                    Fixed-point Q32 engine with bit-for-bit identical replay
                    across machines and environments.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white/70 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Deterministic reasoning
                  </p>
                  <p className="leading-snug">
                    Every decision is a structured chain of reasoning with step
                    hashes, legality checks, and graph-anchored proofs.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white/70 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Infrastructure ready
                  </p>
                  <p className="leading-snug">
                    Pure JSON API, CPU-only. Fits Terraform, Kubernetes, CI
                    pipelines, and edge deployments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Architecture strip */}
          <section className="rounded-3xl bg-neutral-900 px-5 py-5 text-neutral-50 md:px-7 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xs text-xs font-medium uppercase tracking-[0.26em] text-neutral-400">
                Architecture at a glance
              </p>
              <div className="grid flex-1 gap-3 text-xs md:grid-cols-3 md:text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                    Deterministic core
                  </p>
                  <p className="leading-snug text-neutral-100">
                    No randomness, no hidden clocks, no non-deterministic
                    branches.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                    Tamper-evident
                  </p>
                  <p className="leading-snug text-neutral-100">
                    Hash-linked steps, graphs, and bundles make retroactive
                    edits detectable.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                    Efficient runtime
                  </p>
                  <p className="leading-snug text-neutral-100">
                    Q32 fixed-point numerics, CPU-only. Practical on servers and
                    constrained hardware.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why + where */}
          <section className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            {/* Why deterministic reasoning */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <h2 className="text-base font-semibold md:text-lg">
                For systems where “probably correct” is not enough.
              </h2>
              <p className="text-sm leading-relaxed text-neutral-700">
                Many workflows rely on opaque probabilistic systems. That fails
                in environments where outcomes must be explained, replayed, and
                trusted over long horizons. RIC provides deterministic reasoning
                as infrastructure: every decision has a traceable origin and a
                reproducible proof.
              </p>
              <div className="grid gap-3 text-sm text-neutral-700 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="font-medium">Infrastructure &amp; reliability</p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    Stable reasoning chains behind configuration, routing, and
                    failover logic.
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Security &amp; safety</p>
                  <p className="text-xs leading-relaxed md:text-sm">
                    Gate sensitive actions behind deterministic constraints and
                    replayable justification.
                  </p>
                </div>
              </div>
              <details className="text-xs text-neutral-600 md:text-sm">
                <summary className="cursor-pointer select-none text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
                  See more environments
                </summary>
                <div className="mt-2 space-y-1.5">
                  <p>• Regulatory stacks requiring full audit trails.</p>
                  <p>• Long-lived infra where drift breaks guarantees.</p>
                  <p>• Multi-party systems that must agree on outcomes.</p>
                </div>
              </details>
            </div>

            {/* Where RIC runs */}
            <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <h3 className="text-base font-semibold md:text-lg">
                Where this runtime fits.
              </h3>
              <div className="grid gap-3 text-xs text-neutral-700 md:text-sm">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <p className="font-medium">Cloud &amp; infra control</p>
                  <p className="mt-1 leading-snug">
                    Deterministic policies for routing, rate-limits, and
                    failover logic.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <p className="font-medium">Robotics &amp; automation</p>
                  <p className="mt-1 leading-snug">
                    Explainable control decisions with full traceability per
                    action.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <p className="font-medium">STEM &amp; simulation</p>
                  <p className="mt-1 leading-snug">
                    ODEs and linear algebra without floating-point drift or
                    hidden state.
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <p className="font-medium">Embedded &amp; edge</p>
                  <p className="mt-1 leading-snug">
                    Low-power deterministic reasoning with auditable decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Proof bundle section */}
          <section className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-md space-y-2">
                <h2 className="text-base font-semibold md:text-lg">
                  Every run is a proof-bundled reasoning trace.
                </h2>
                <p className="text-sm leading-relaxed text-neutral-700">
                  RIC treats reasoning as a first-class artifact. Each call
                  returns a deterministic bundle you can store, replay, and
                  audit.
                </p>
              </div>
              <div className="grid flex-1 gap-2 text-xs text-neutral-800 md:grid-cols-2 md:text-sm">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <ul className="space-y-1 leading-snug">
                    <li>• Ordered sequence of reasoning steps.</li>
                    <li>• Legality view over each step.</li>
                    <li>• Hash-linked graph of the reasoning flow.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-3">
                  <ul className="space-y-1 leading-snug">
                    <li>• Bundle hash committing to the full run.</li>
                    <li>• Deterministic result derived from that bundle.</li>
                    <li>• Replay guarantees across machines and time.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Example surfaces */}
          <section className="grid w-full gap-6 md:grid-cols-2">
            {/* Legality card */}
            <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Deterministic legality
              </p>
              <h2 className="text-base font-semibold">
                A deterministic gate in front of any decision engine.
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                RIC can sit between your application and any proposal source.
                The proposal is checked against hard constraints and
                contradiction rules; RIC either passes or blocks it with a fully
                replayable justification. The legality demo is a simple surface
                of a deeper legality stack.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <Link
                  href="/legality-demo"
                  className="text-neutral-900 underline underline-offset-2"
                >
                  Read the legality overview →
                </Link>
                <Link
                  href="/demo"
                  className="text-neutral-900 underline underline-offset-2"
                >
                  Open the live demo →
                </Link>
              </div>
            </section>

            {/* STEM card */}
            <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Deterministic STEM
              </p>
              <h2 className="text-base font-semibold">
                STEM on top of the same deterministic core.
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                RIC-STEM exposes linear ODE solving and linear system solving on
                the same fixed-point Q32 substrate, with metrics available at{" "}
                <code className="rounded bg-neutral-100 px-1 py-[1px] text-[11px]">
                  GET /metrics
                </code>
                . It is a focused example of the broader runtime, chosen because
                its results are straightforward to verify and compare.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <Link
                  href="/stem"
                  className="text-neutral-900 underline underline-offset-2"
                >
                  Try the deterministic STEM demo →
                </Link>
                <Link
                  href="/ric-stem"
                  className="text-neutral-900 underline underline-offset-2"
                >
                  Read the STEM overview →
                </Link>
              </div>
            </section>
          </section>

          {/* API access + integration */}
          <section className="grid w-full gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* API access */}
            <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                API access
              </p>
              <h2 className="text-base font-semibold">
                Request access to the RIC API.
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 md:text-sm">
                RIC is in limited pilot as deterministic reasoning infrastructure
                for infrastructure control, safety systems, STEM workflows, and
                embedded automation. Share your email and a brief description of
                your environment to discuss integration.
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
                    Brief environment / use case (optional)
                  </label>
                  <textarea
                    id="usecase"
                    name="message"
                    rows={3}
                    placeholder="e.g., infra control, safety gating, STEM workflows, embedded agent."
                    className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                </div>

                <input
                  type="hidden"
                  name="_subject"
                  value="New RIC API access request"
                />
                <input type="hidden" name="_next" value="/thanks" />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Request API access
                </button>

                <p className="text-[11px] text-neutral-500">
                  No bulk mail. Only RIC integration follow-ups.
                </p>
              </form>
            </section>

            {/* Integration surfaces */}
            <section className="space-y-3 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Integration
              </p>
              <h2 className="text-base font-semibold">
                Slot into existing stacks with minimal friction.
              </h2>
              <ul className="space-y-2 text-xs leading-relaxed text-neutral-700 md:text-sm">
                <li>
                  • JSON in/out over HTTP. Works cleanly with FastAPI, Flask,
                  Express, Go, Rust, Java, and more.
                </li>
                <li>
                  • Compatible with containerized deployments: Docker, Kubernetes,
                  Terraform, and common CI setups.
                </li>
                <li>
                  • Designed to run alongside existing models or engines as a
                  deterministic reasoning and legality layer.
                </li>
                <li>
                  • Stable schemas suitable for long-lived compliance and audit
                  pipelines.
                </li>
              </ul>
            </section>
          </section>

          {/* Footer */}
          <footer className="mt-6 flex w-full flex-col items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[11px] text-neutral-500 md:mt-8 md:flex-row">
            <span>
              © {new Date().getFullYear()} Resonance Intelligence Core
            </span>
            <div className="flex flex-wrap gap-3">
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