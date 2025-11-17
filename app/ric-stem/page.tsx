// app/ric-stem/page.tsx

import Link from "next/link";

export default function RicStemPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20 space-y-8">
        {/* Header */}
        <header className="space-y-3">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-[0.18em]">
            RIC-STEM v1
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1 — Deterministic STEM engine
          </h1>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
            RIC-STEM v1 is a small, focused math engine that runs on top of the
            Resonance Intelligence Core substrate. It exposes two things:
            a linear ODE integrator and a linear algebra solver. All math runs
            in fixed-point 32-bit arithmetic, so every run is exactly
            repeatable.
          </p>
          <p className="text-xs md:text-sm text-neutral-600">
            Try it live in the{" "}
            <Link
              href="/stem"
              className="underline underline-offset-2 text-neutral-900"
            >
              RIC-STEM demo →
            </Link>
          </p>
        </header>

        <hr className="border-neutral-200" />

        {/* 1. What RIC-STEM gives you */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">1. What RIC-STEM gives you</h2>

          <div className="space-y-2 text-sm text-neutral-700">
            <p className="font-medium">Deterministic substrate</p>
            <p>
              All computations run on a fixed-point core (Q32). There are no
              floats and no randomness in the math engine. Same input →
              same output, bit-for-bit, across machines.
            </p>
          </div>

          <div className="space-y-2 text-sm text-neutral-700">
            <p className="font-medium">STEM endpoints (v1)</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Linear ODE integrator → <code>POST /stem/run</code></li>
              <li>Linear algebra solver → <code>POST /algebra/run</code></li>
            </ul>
          </div>

          <div className="space-y-2 text-sm text-neutral-700">
            <p className="font-medium">Metrics and counters</p>
            <p>
              <code className="text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
                GET /metrics
              </code>{" "}
              exposes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>metrics.runs</code> — total substrate runs</li>
              <li><code>metrics.replays</code> — total replays</li>
              <li><code>metrics.emitted</code> — emitted legal steps</li>
              <li><code>metrics.stem.odeRuns</code> — ODE calls</li>
              <li><code>metrics.stem.algebraRuns</code> — algebra calls</li>
            </ul>
          </div>

          <p className="text-xs text-neutral-600">
            You can treat RIC-STEM as “deterministic math as a service” with
            built-in usage counters and audit hooks.
          </p>
        </section>

        <hr className="border-neutral-200" />

        {/* 2. ODE section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">2. ODE — Linear systems</h2>

          <p className="text-sm text-neutral-700">
            Endpoint:
            <br />
            <code className="text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
              POST /stem/run
            </code>
          </p>

          <p className="text-sm text-neutral-700 font-medium">
            Example — 1D exponential decay
          </p>

          <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto">
{`{
  "kind": "ode_linear",
  "system": {
    "A": [[-1]],
    "b": [0]
  },
  "config": {
    "t0": 0,
    "t1": 1,
    "dt": 0.1,
    "y0": [1]
  }
}`}
          </pre>

          <p className="text-sm text-neutral-700">Response shape:</p>

          <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto">
{`{
  "ok": true,
  "t": [0, 0.099999, ..., 1],
  "y": [[1], [...], ...]
}`}
          </pre>

          <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
            <li>
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                t
              </code>{" "}
              and{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                y
              </code>{" "}
              are floats derived from Q32 values; the integrator itself runs in
              fixed-point.
            </li>
            <li>
              Each call increments{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                metrics.runs
              </code>{" "}
              and{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                metrics.stem.odeRuns
              </code>
              .
            </li>
            <li>
              If you replay this exact payload later, you get the same arrays on
              any machine, any OS.
            </li>
          </ul>
        </section>

        <hr className="border-neutral-200" />

        {/* 3. Algebra section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">3. Algebra — Linear solver</h2>

          <p className="text-sm text-neutral-700">
            Endpoint:
            <br />
            <code className="text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
              POST /algebra/run
            </code>
          </p>

          <p className="text-sm text-neutral-700 font-medium">
            Example — 2×2 system
          </p>

          <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto">
{`{
  "system": {
    "A": [[1, -1], [2, 1]],
    "b": [1, 4]
  }
}`}
          </pre>

          <p className="text-sm text-neutral-700">Response (example):</p>

          <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto">
{`{
  "ok": true,
  "y_q32": ["7158278826", "2863311530"],
  "y": [1.666666, 0.666666]
}`}
          </pre>

          <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
            <li>
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                y_q32
              </code>{" "}
              holds the raw fixed-point integers.
            </li>
            <li>
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                y
              </code>{" "}
              is a float convenience view for humans.
            </li>
            <li>
              Each call increments{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                metrics.runs
              </code>{" "}
              and{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                metrics.stem.algebraRuns
              </code>
              .
            </li>
            <li>
              Given the same payload, you always get the same solution vector,
              bit-for-bit.
            </li>
          </ul>
        </section>

        <hr className="border-neutral-200" />

        {/* 4. Observability */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">4. Observability and proofs</h2>

          <div className="space-y-2 text-sm text-neutral-700">
            <p className="font-medium">Metrics</p>
            <p>Live substrate counters:</p>
          </div>

          <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto">
{`curl -s http://64.227.89.110:8787/metrics | jq .`}
          </pre>

          <p className="text-sm text-neutral-700">
            This returns total runs, replays, emitted steps, and STEM-level
            counters so you can see how the engine is being used.
          </p>

          <div className="space-y-2 text-sm text-neutral-700">
            <p className="font-medium">Replay and trace bundles</p>
            <p>
              The underlying substrate exposes{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                /run
              </code>{" "}
              and{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                /replay
              </code>{" "}
              endpoints that produce cryptographically hashed proof bundles
              (including a graph of each step and its legality checks).
            </p>
            <p className="text-xs text-neutral-600">
              RIC-STEM sits on top of this. Future versions can attach ODE /
              algebra runs directly into those bundles for end-to-end math
              proofs.
            </p>
          </div>
        </section>

        <hr className="border-neutral-200" />

        {/* 5. Deeper theory (optional) */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">5. Deeper theory (optional)</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            The broader mathematical framework behind RIC-STEM is described in
            the Structured Resonance Dynamics corpus. A good starting point is:
          </p>
          <p className="text-sm text-neutral-800 underline underline-offset-2">
            <a
              href="https://zenodo.org/records/17545317"
              target="_blank"
              rel="noreferrer"
            >
              Structured Resonance Dynamics — Empirical Convergence Map →
            </a>
          </p>
          <p className="text-xs text-neutral-600">
            RIC-STEM v1 is built as a concrete, deterministic engine today; the
            SRD work explores how the same coherence law extends across physics,
            biology, and computation.
          </p>
        </section>

        <hr className="border-neutral-200" />

        {/* Links back */}
        <section className="flex flex-col gap-4 text-xs text-neutral-700">
          <Link href="/stem" className="underline underline-offset-2">
            Open the RIC-STEM demo →
          </Link>
          <Link href="/demo" className="underline underline-offset-2">
            See the legality demo →
          </Link>
          <Link href="/" className="underline underline-offset-2">
            Back to home →
          </Link>

          <div className="pt-6 text-neutral-500">
            <p className="font-medium">Research background</p>
            <p className="mt-1">
              For the underlying deterministic coherence theory behind RIC, see the
              <a
                href="https://zenodo.org/records/17545317"
                target="_blank"
                className="underline underline-offset-2 text-neutral-700"
              >
                Empirical Convergence Map for CODES (15,000+ downloads) →
            </a>
          </p>
        </div>
       </section>
      </div>
    </main>
  );
}