// app/legality-demo/page.tsx
import Link from "next/link";

export default function LegalityDemoPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <header className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">
            RIC legality demo
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Deterministic legality gate in front of any text model
          </h1>
          <p className="text-sm md:text-base text-neutral-200 leading-relaxed max-w-2xl">
            This demo shows RIC running as a legality gate in front of a
            stochastic text model. The model can propose anything; RIC applies
            hard rules and either lets an answer emit or halts it, with a
            replayable proof of what happened.
          </p>
          <p className="text-[11px] text-neutral-400 max-w-2xl">
            The downstream text model (Anthropic, OpenAI, or another provider)
            is swappable. For the same inputs, the legality decision stays fixed
            and replayable bit-for-bit.
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
              Try RIC-STEM engine
            </Link>
          </div>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Left: narrative sections */}
          <div className="space-y-8">
            {/* 1 */}
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">1. What the user sees</h2>
              <p className="text-sm text-neutral-200 leading-relaxed">
                In the UI you type a prompt: a legal question, a policy request,
                or any free-text query.
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-200 space-y-1.5">
                <li>You write a question and hit send.</li>
                <li>
                  The underlying text model proposes one or more draft answers
                  (its normal stochastic behavior).
                </li>
                <li>
                  RIC evaluates those drafts against a set of rules and returns:
                  <ul className="ml-5 mt-1 list-disc list-inside space-y-1">
                    <li>a PASS banner with hashes and a run ID, or</li>
                    <li>a HALT banner with a deterministic explanation.</li>
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
                The legality demo runs on the same Q32 deterministic substrate
                as RIC-STEM:
              </p>
              <ul className="list-disc list-inside text-sm text-neutral-200 space-y-1.5">
                <li>
                  The app sends the model’s candidate answer to RIC via{" "}
                  <code className="text-[11px] bg-white/10 px-1 py-0.5 rounded">
                    POST /run
                  </code>
                  .
                </li>
                <li>
                  RIC runs its legality stack: claim structure checks,
                  contradiction tests, and temporal rules (for example, policy
                  or case-law cut-off dates).
                </li>
                <li>
                  If the answer passes, RIC emits it together with a
                  deterministic proof bundle; if not, RIC halts and no model
                  output is allowed through.
                </li>
              </ul>
              <p className="text-[11px] text-neutral-400">
                No floats. No timestamps. No randomness. Same request +
                same model output → same legality decision and bundle, across
                machines.
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
                  <span className="font-semibold">Separation of powers:</span>{" "}
                  Stochastic generation stays on the model. Deterministic
                  legality stays on RIC, with a provable boundary between them.
                </li>
                <li>
                  <span className="font-semibold">Safety &amp; compliance:</span>{" "}
                  Encode rules that must never be violated (coverage windows,
                  timing, jurisdiction limits, red-line clauses).
                </li>
                <li>
                  <span className="font-semibold">Control:</span> Wrap your
                  existing model in a deterministic gate you own, version, and
                  test like any other critical service.
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">4. Integration sketch</h2>
              <p className="text-sm text-neutral-200 leading-relaxed">
                The same pattern can be wired into your product:
              </p>
              <ol className="list-decimal list-inside text-sm text-neutral-200 space-y-1.5">
                <li>Your app calls your text model as usual.</li>
                <li>
                  Instead of returning that answer directly, your backend wraps
                  it in a RIC{" "}
                  <code className="text-[11px] bg-white/10 px-1 py-0.5 rounded">
                    /run
                  </code>{" "}
                  call with your legality rules.
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
                This is the same pattern we are using with early legal-tech and
                claims partners: keep your models, add a deterministic legality
                layer in front.
              </p>
            </section>
          </div>

          {/* Right summary card */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-neutral-100">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-300">
                At a glance
              </div>
              <ul className="mt-2 space-y-1.5 text-[13px]">
                <li>Deterministic legality gate in front of a text model.</li>
                <li>Bit-for-bit replayable outcomes and hashes.</li>
                <li>Same Q32 substrate as the RIC-STEM engine.</li>
                <li>Built for legal, claims, and safety-critical stacks.</li>
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

        {/* Research background */}
        <footer className="mt-10 border-t border-white/10 pt-4 text-[11px] text-neutral-300">
          <p>
            Research background. For the underlying deterministic coherence
            theory behind RIC, see{" "}
            <a
              href="https://zenodo.org/records/17545317"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              CODES: The Coherence Framework Replacing Probability in Physics,
              Intelligence, and Reality (v40)
            </a>
            .
          </p>
        </footer>
      </div>
    </main>
  );
}