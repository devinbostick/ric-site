// app/ric-stem/page.tsx

import Link from "next/link";

export default function RicStemPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-20 space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-[0.18em]">
            RIC-STEM v1
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1 — Deterministic STEM engine
          </h1>
          <p className="text-sm md:text-base text-neutral-700 leading-relaxed">
            RIC-STEM v1 is a deterministic STEM engine running on the Resonance
            Intelligence Core substrate. It exposes a linear ODE integrator and
            a linear algebra solver, both using fixed-point Q32 arithmetic with
            full replayability.
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

        {/* 1. Stack */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">1. Stack</h2>
          <div className="space-y-1 text-sm text-neutral-700">
            <p className="font-medium">Substrate</p>
            <p>
              RIC v2 with a Q32 kernel and the legality stack (PAS, CHORDLOCK,
              TEMPOLOCK, GLYPHLOCK, AURA_OUT, ELF, LockGraph).
            </p>
          </div>
          <div className="space-y-1 text-sm text-neutral-700">
            <p className="font-medium">STEM layer (v1)</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Linear ODE integrator → POST /stem/run</li>
              <li>Linear algebra solver → POST /algebra/run</li>
            </ul>
          </div>
          <div className="space-y-1 text-sm text-neutral-700">
            <p className="font-medium">Telemetry</p>
            <p>
              <code className="text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
                GET /metrics
              </code>{" "}
              exposes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>metrics.runs</li>
              <li>metrics.replays</li>
              <li>metrics.emitted</li>
              <li>metrics.stem.odeRuns</li>
              <li>metrics.stem.algebraRuns</li>
            </ul>
          </div>
          <p className="text-xs text-neutral-600">
            Same input → same output, bit-for-bit, across machines. No
            floating-point drift in the core.
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

          <div className="space-y-1 text-sm text-neutral-700">
            <p className="font-medium">Payload (example — 1D decay)</p>
          </div>

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

          <p className="text-sm text-neutral-700">
            Response shape:
          </p>

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
              are floats derived from Q32 values; core integration is
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
            <li>Same request → identical arrays on any machine, any OS.</li>
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
            Payload (example — 2×2 system)
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
              are the raw Q32 substrate integers.
            </li>
            <li>
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                y
              </code>{" "}
              is a float convenience view.
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
            <li>Deterministic across machines.</li>
          </ul>
        </section>

        <hr className="border-neutral-200" />

        {/* 4. Observability */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">4. Observability</h2>

          <div className="space-y-1 text-sm text-neutral-700">
            <p className="font-medium">Metrics</p>
            <p>
              Query the substrate directly:
            </p>
          </div>

          <pre className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto">
{`curl -s http://64.227.89.110:8787/metrics | jq .`}
          </pre>

          <p className="text-sm text-neutral-700">
            This returns total runs, replays, emitted steps, and STEM-level
            counters.
          </p>

          <div className="space-y-1 text-sm text-neutral-700">
            <p className="font-medium">Trace / bundle infrastructure</p>
            <p>
              The core substrate still exposes{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                /run
              </code>{" "}
              and{" "}
              <code className="text-[11px] bg-neutral-100 px-1 rounded">
                /replay
              </code>{" "}
              with LockGraph bundles:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>bundleHash</li>
              <li>graphHash</li>
              <li>Deterministic trace steps and legality reasons</li>
              <li>Optional claims, provenance, signatures</li>
            </ul>
            <p className="text-xs text-neutral-600">
              RIC-STEM is layered above this substrate; future versions can
              attach ODE/algebra steps directly to LockGraph for full STEM-level
              legality proofs.
            </p>
          </div>
        </section>

        <hr className="border-neutral-200" />

        {/* Links back */}
        <section className="flex flex-wrap gap-4 text-xs text-neutral-700">
          <Link href="/stem" className="underline underline-offset-2">
            Open the RIC-STEM demo →
          </Link>
          <Link href="/demo" className="underline underline-offset-2">
            See the legality demo →
          </Link>
          <Link href="/" className="underline underline-offset-2">
            Back to home →
          </Link>
        </section>
      </div>
    </main>
  );
}