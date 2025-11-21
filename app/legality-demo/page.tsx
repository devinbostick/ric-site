// app/legality-demo/page.tsx
import Link from "next/link";

export default function LegalityDemoPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Header / hero */}
        <header className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            RIC legality demo
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Deterministic legality gate for any text model
          </h1>
          <p className="text-sm md:text-base text-neutral-200 leading-relaxed max-w-2xl">
            This demo shows RIC acting as a deterministic governor in front of a
            stochastic text model. The model proposes; RIC applies hard rules and
            either lets an answer emit or halts it, with a replayable proof of
            what happened.
          </p>
          <p className="text-[11px] text-neutral-400 max-w-2xl">
            The downstream model provider is swappable. For the same inputs and
            the same candidate answer, RIC&apos;s legality decision stays fixed and
            replayable bit-for-bit across machines.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-neutral-100"
            >
              Open legality demo
            </Link>
            <Link
              href="/stem"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-4 py-2 text-xs font-semibold text-white hover:bg-white/5"
            >
              Try deterministic STEM
            </Link>
          </div>
        </header>

        {/* Context: how this fits into RIC */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-100 space-y-2">
          <h2 className="text-sm font-semibold">
            One surface of a deterministic reasoning runtime
          </h2>
          <p className="text-[13px] text-neutral-200 leading-relaxed">
            RIC is a deterministic reasoning runtime that sits under models,
            pipelines, and decision systems. The legality demo is a narrow view:
            it shows RIC acting as a governor between any proposal source
            (LLM, rules engine, service) and your application.
          </p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-neutral-200 list-disc list-inside">
            <li>Same input → same steps → same result.</li>
            <li>Every run produces a cryptographically anchored bundle.</li>
            <li>
              Designed to sit under text models, ETLs, infra workflows, and
              safety-critical stacks.
            </li>
          </ul>
        </section>

        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: narrative sections */}
          <div className="space-y-8">
            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">1. What the user sees</h2>
              <p className="text-sm text-neutral-200 leading-relaxed">
                In the UI you type a prompt: a policy question, a configuration
                change, a safety instruction, or any free-text query.
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-200 space-y-1.5">
                <li>You write a question and hit send.</li>
                <li>
                  The underlying text model proposes one or more draft answers
                  (its normal stochastic behavior).
                </li>
                <li>
                  RIC evaluates those drafts against your rules and returns:
                  <ul className="ml-5 mt-1 list-disc list-inside space-y-1">
                    <li>a <span className="font-semibold">PASS</span> banner with hashes and a run ID, or</li>
                    <li>a <span className="font-semibold">HALT</span> banner with a deterministic explanation.</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* 2 */}
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">
                2. What RIC does under the hood
              </h2>
              <p className="text-sm text-neutral-200 leading-relaxed">
                The legality demo runs on the same deterministic substrate as
                the rest of RIC:
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-200 space-y-1.5">
                <li>
                  The app sends the model&apos;s candidate answer to RIC via{" "}
                  <code className="text-[11px] bg-white/10 px-1 py-0.5 rounded">
                    POST /run
                  </code>
                  .
                </li>
                <li>
                  RIC parses and normalizes the text, then runs contradiction
                  checks, constraint rules, and temporal / structural guards.
                </li>
                <li>
                  If the answer passes, RIC emits it together with a deterministic
                  proof bundle; if not, RIC halts and no model output is allowed
                  through.
                </li>
              </ul>
              <p className="text-[11px] text-neutral-400">
                Q32 fixed-point numerics, no clocks, no randomness. Same request
                + same candidate answer → same legality decision and bundle,
                across machines and environments.
              </p>
              <p className="text-[11px] text-neutral-400">
                RIC does not replace your model. It governs it.
              </p>
            </section>

            {/* 3 */}
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">3. Why this matters</h2>
              <ul className="list-disc list-inside text-sm text-neutral-200 space-y-1.5">
                <li>
                  <span className="font-semibold">Auditability:</span> Every
                  decision is stored as a bundle with trace steps, legality
                  reasons, and hashes. You can replay it later and get the same
                  result.
                </li>
                <li>
                  <span className="font-semibold">Tamper-evidence:</span> Proof
                  bundles are cryptographically anchored. Any change to the
                  reasoning steps changes the hashes.
                </li>
                <li>
                  <span className="font-semibold">Safety &amp; compliance:</span>{" "}
                  Encode rules that must never be violated (coverage windows,
                  timing, policy constraints, safety limits).
                </li>
                <li>
                  <span className="font-semibold">Infrastructure control:</span>{" "}
                  Guardrail configuration updates or ETL outputs before they
                  commit to production systems.
                </li>
                <li>
                  <span className="font-semibold">Robotics &amp; embedded:</span>{" "}
                  Block unsafe control instructions before they reach devices,
                  while keeping the reasoning trace for certification or QA.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">4. Integration sketch</h2>
              <p className="text-sm text-neutral-200 leading-relaxed">
                The same pattern can be wired into your stack:
              </p>
              <ol className="list-decimal list-inside text-sm text-neutral-200 space-y-1.5">
                <li>Your app calls your text model or proposal source as usual.</li>
                <li>
                  Instead of returning that answer directly, your backend wraps
                  it in a RIC{" "}
                  <code className="text-[11px] bg-white/10 px-1 py-0.5 rounded">
                    /run
                  </code>{" "}
                  call with your legality and safety rules.
                </li>
                <li>
                  RIC returns either:
                  <ul className="ml-5 mt-1 list-disc list-inside space-y-1">
                    <li>a legal answer + proof bundle, or</li>
                    <li>a halt signal with a deterministic explanation.</li>
                  </ul>
                </li>
              </ol>
              <p className="text-[11px] text-neutral-400">
                Small-footprint HTTP integration works with FastAPI, Express,
                Go, Rust, Terraform / Kubernetes gates, and edge or on-prem
                environments.
              </p>
            </section>
          </div>

          {/* Right summary card */}
                  <aside className="space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-100">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-300">
                              At a glance
                          </div>
                          <ul className="mt-2 space-y-1.5 text-[13px] text-neutral-200 list-disc list-inside">
                              <li>Deterministic legality gate in front of any text model.</li>
                              <li>Bit-for-bit replayable outcomes and hashes.</li>
                              <li>Same Q32 substrate as the deterministic STEM engine.</li>
                              <li>
                                  Built for infrastructure, safety-critical, scientific, and
                                  compliance-heavy stacks.
                              </li>
                          </ul>
                      </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs text-neutral-300">
              <div className="font-semibold text-neutral-100">Next steps</div>
              <ul className="mt-2 space-y-1.5">
                <li>
                  Open the{" "}
                  <Link href="/demo" className="underline underline-offset-2">
                    live legality demo
                  </Link>{" "}
                  and trigger PASS / HALT cases.
                </li>
                <li>
                  Explore deterministic math and Q32 numerics in the{" "}
                  <Link href="/stem" className="underline underline-offset-2">
                    RIC-STEM engine
                  </Link>
                  .
                </li>
                <li>
                  Request API access from the form on the{" "}
                  <Link href="/" className="underline underline-offset-2">
                    homepage
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* System framing footer */}
        <footer className="mt-10 border-t border-white/10 pt-4 text-[11px] text-neutral-300">
          <p className="leading-relaxed">
            This legality demo is one surface of RIC&apos;s deterministic reasoning
            runtime. The same substrate supports STEM computation, contradiction
            detection, rule enforcement, and fully replayable decision chains
            for critical systems.
          </p>
        </footer>
      </div>
    </main>
  );
}