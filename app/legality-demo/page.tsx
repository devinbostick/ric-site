// app/legality-demo/page.tsx
import Link from "next/link";

export default function LegalityDemoPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-5xl px-4 py-6 md:py-10">
        {/* Top nav */}
        <header className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
              RIC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                Resonance
              </span>
              <span className="text-sm font-medium text-neutral-50">
                Intelligence Core
              </span>
            </div>
          </Link>

          <nav className="hidden gap-4 text-xs md:flex md:text-sm">
            <Link
              href="/"
              className="text-neutral-200 underline-offset-4 hover:text-white hover:underline"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-neutral-200 underline-offset-4 hover:text-white hover:underline"
            >
              Legality demo
            </Link>
            <Link
              href="/reason"
              className="text-neutral-200 underline-offset-4 hover:text-white hover:underline"
            >
              Reasoning trace
            </Link>
            <Link
              href="/stem"
              className="text-neutral-200 underline-offset-4 hover:text-white hover:underline"
            >
              RIC-STEM
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
                RIC legality demo
              </p>
              <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Deterministic legality gate in front of any text model.
              </h1>
              <p className="text-sm leading-relaxed text-neutral-200">
                The model proposes an answer. RIC applies hard rules and either
                lets it emit or halts it — with a replayable proof bundle for
                what happened. Same input, same candidate answer, same legality
                decision across machines.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-100"
                >
                  Open live legality demo
                </Link>
                <Link
                  href="/stem"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white hover:bg-white/5"
                >
                  Try deterministic STEM
                </Link>
              </div>
            </div>

            <aside className="w-full max-w-xs space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-neutral-200">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-300">
                At a glance
              </div>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                <li>Deterministic legality gate in front of any text model.</li>
                <li>Bit-for-bit replayable decisions and hashes.</li>
                <li>Same Q32 substrate as the deterministic STEM engine.</li>
                <li>
                  Built for infra, safety-critical, scientific, and
                  compliance-heavy stacks.
                </li>
              </ul>
              <div className="mt-3 border-t border-white/10 pt-3 text-[11px]">
                <span className="font-semibold text-neutral-100">
                  Back to home:
                </span>{" "}
                <Link
                  href="/"
                  className="underline underline-offset-2 hover:text-white"
                >
                  overview of the RIC runtime →
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Main content */}
        <section className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Left: condensed narrative */}
          <div className="space-y-7">
            {/* 1. What the user sees */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold md:text-base">
                1. What the user sees
              </h2>
              <p className="text-xs leading-relaxed text-neutral-200 md:text-sm">
                In the UI you type a policy question, config change, or safety
                instruction. The downstream text model proposes an answer; RIC
                sits in front of it and decides whether that answer is allowed
                to emit.
              </p>
              <ul className="mt-1 space-y-1.5 text-xs leading-relaxed text-neutral-200 md:text-sm">
                <li>• You write a question and hit send.</li>
                <li>
                  • The model produces a draft answer (its normal stochastic
                  behavior).
                </li>
                <li>
                  • RIC evaluates that draft against your rules, then returns:
                  <span className="ml-1 font-semibold">PASS</span> with hashes
                  and run ID, or{" "}
                  <span className="font-semibold">HALT</span> with a
                  deterministic explanation.
                </li>
              </ul>
            </section>

            {/* 2. What RIC does under the hood */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold md:text-base">
                2. What RIC does under the hood
              </h2>
              <p className="text-xs leading-relaxed text-neutral-200 md:text-sm">
                The legality demo runs on the same deterministic substrate as
                the rest of RIC:
              </p>
              <ul className="mt-1 space-y-1.5 text-xs leading-relaxed text-neutral-200 md:text-sm">
                <li>
                  • The app sends the model&apos;s candidate answer to RIC via{" "}
                  <code className="rounded bg-white/10 px-1 py-[1px] text-[11px]">
                    POST /run
                  </code>
                  .
                </li>
                <li>
                  • RIC parses and normalizes the text, runs contradiction
                  checks, constraint rules, and temporal/structural guards.
                </li>
                <li>
                  • If it passes, RIC emits the answer with a proof bundle; if
                  not, it halts and no model output is allowed through.
                </li>
              </ul>
              <p className="text-[11px] text-neutral-400">
                Q32 fixed-point numerics, no clocks, no randomness. Same
                request + same candidate answer → same legality decision and
                bundle, across machines and environments.
              </p>
            </section>

            {/* 3. Why this matters */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold md:text-base">
                3. Why this matters
              </h2>
              <ul className="mt-1 space-y-1.5 text-xs leading-relaxed text-neutral-200 md:text-sm">
                <li>
                  • <span className="font-semibold">Auditability:</span> Every
                  decision is stored as a bundle with steps, legality reasons,
                  and hashes. You can replay it and get the same result.
                </li>
                <li>
                  • <span className="font-semibold">Tamper-evidence:</span> Any
                  change to the reasoning steps changes the hashes.
                </li>
                <li>
                  • <span className="font-semibold">Safety &amp; compliance:</span>{" "}
                  Encode rules that must never be violated (coverage windows,
                  timing, policy constraints, safety limits).
                </li>
                <li>
                  • <span className="font-semibold">Infra &amp; robotics:</span>{" "}
                  Guardrail config updates, ETL outputs, and control instructions
                  before they reach production systems or devices.
                </li>
              </ul>
            </section>

            {/* 4. Integration sketch */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold md:text-base">
                4. Integration sketch
              </h2>
              <p className="text-xs leading-relaxed text-neutral-200 md:text-sm">
                Wiring pattern is simple:
              </p>
              <ol className="mt-1 list-decimal space-y-1.5 pl-5 text-xs leading-relaxed text-neutral-200 md:text-sm">
                <li>Your app calls your text model as usual.</li>
                <li>
                  Instead of returning that answer directly, your backend wraps
                  it in a RIC{" "}
                  <code className="rounded bg-white/10 px-1 py-[1px] text-[11px]">
                    /run
                  </code>{" "}
                  call with your legality/safety rules.
                </li>
                <li>
                  RIC returns either a legal answer + proof bundle or a halt
                  signal with a deterministic explanation.
                </li>
              </ol>
              <p className="text-[11px] text-neutral-400">
                Small-footprint HTTP integration works with FastAPI, Express,
                Go, Rust, Terraform/Kubernetes gates, and edge or on-prem
                environments.
              </p>
            </section>
          </div>

          {/* Right: summary + next steps */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-neutral-100 md:text-sm">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-300">
                How this surface fits
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-200">
                This demo is one surface of RIC&apos;s deterministic reasoning
                runtime. The same substrate supports STEM computation,
                contradiction detection, rule enforcement, and replayable
                decision chains.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs text-neutral-300">
              <div className="font-semibold text-neutral-100">
                Next steps from here
              </div>
              <ul className="mt-2 space-y-1.5">
                <li>
                  Open the{" "}
                  <Link
                    href="/demo"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    live legality demo
                  </Link>{" "}
                  and trigger PASS / HALT cases.
                </li>
                <li>
                  Explore deterministic math and Q32 numerics in the{" "}
                  <Link
                    href="/stem"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    RIC-STEM engine
                  </Link>
                  .
                </li>
                <li>
                  Inspect deterministic reasoning traces on{" "}
                  <Link
                    href="/reason"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    the reasoning demo
                  </Link>
                  .
                </li>
                <li>
                  Request API access from the form on the{" "}
                  <Link
                    href="/"
                    className="underline underline-offset-2 hover:text-white"
                  >
                    homepage
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 pt-4 text-[11px] text-neutral-300">
          <p className="leading-relaxed">
            The legality demo runs on the same deterministic substrate as the
            rest of RIC — Q32 fixed-point numerics, no randomness, no hidden
            clocks, and replayable proof bundles for every decision.
          </p>
        </footer>
      </div>
    </main>
  );
}