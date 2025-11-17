// app/ric-stem/page.tsx

export default function RicStemPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <article className="w-full max-w-3xl space-y-10">
        {/* Header */}
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1 — Deterministic STEM engine
          </h1>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            RIC-STEM v1 is the deterministic STEM engine running on the
            Resonance Intelligence Core (RIC) substrate. All computation uses
            fixed-point Q32 arithmetic with full replayability and
            substrate-level cryptographic proof bundles.
          </p>
          <ul className="text-sm text-neutral-700 list-disc list-inside space-y-1">
            <li>Same input → same output, bit-for-bit, across machines.</li>
            <li>No floating-point drift in the core.</li>
            <li>Every substrate run can be bundled, hashed, and optionally signed.</li>
          </ul>

          <p className="text-xs md:text-sm pt-1">
            Try the live demo in the{" "}
            <a
              href="/stem"
              className="underline underline-offset-2 text-neutral-800"
            >
              RIC-STEM playground →
            </a>
          </p>
        </header>

        {/* 1. Stack */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. Stack</h2>

          <div className="space-y-2 text-sm text-neutral-800">
            <div>
              <div className="font-medium">Substrate</div>
              <p>
                RIC v2 (Q32 kernel, PAS_s / ΔPAS_zeta, CHORDLOCK, TEMPOLOCK,
                GLYPHLOCK, AURA_OUT, ELF, LockGraph).
              </p>
            </div>

            <div>
              <div className="font-medium">STEM layer (v1)</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Linear ODE integrator → <code>/stem/run</code></li>
                <li>Linear algebra solver → <code>/algebra/run</code></li>
              </ul>
            </div>

            <div>
              <div className="font-medium">Telemetry</div>
              <p>
                <code>GET /metrics</code> exposes global counters:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><code>metrics.runs</code></li>
                <li><code>metrics.replays</code></li>
                <li><code>metrics.emitted</code></li>
                <li><code>metrics.stem.odeRuns</code></li>
                <li><code>metrics.stem.algebraRuns</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. ODE */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. ODE — Linear systems</h2>

          <p className="text-sm text-neutral-800">
            Endpoint: <code>POST /stem/run</code>
          </p>

          <div className="space-y-2 text-sm text-neutral-800">
            <div>
              <div className="font-medium">Payload (example)</div>
              <pre className="mt-1 text-xs font-mono bg-neutral-50 border rounded-lg p-3 overflow-x-auto">
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
            </div>

            <div>
              <div className="font-medium">Response (shape)</div>
              <pre className="mt-1 text-xs font-mono bg-neutral-50 border rounded-lg p-3 overflow-x-auto">
{`{
  "ok": true,
  "t": [0, 0.099999, ..., 1],
  "y": [[1], [...], ...]
}`}
              </pre>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>
                  <code>t</code> and <code>y</code> are floats derived from Q32;
                  core integration is fully fixed-point.
                </li>
                <li>
                  Each call increments <code>metrics.runs</code> and{" "}
                  <code>metrics.stem.odeRuns</code>.
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium">Determinism</div>
              <p className="text-sm text-neutral-800">
                Same request → identical <code>t</code> and <code>y</code>{" "}
                arrays on any machine, any OS.
              </p>
            </div>

            <div>
              <div className="font-medium">Example A — ODE decay</div>
              <p className="text-sm text-neutral-800">
                Use the live demo with <code>A = [[-1]]</code>,{" "}
                <code>y0 = [1]</code>, <code>dt = 0.1</code>, and copy the exact{" "}
                <code>t</code> and <code>y</code> arrays into your notes or
                tests. Replays must match bit-for-bit.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Algebra */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. Algebra — Linear solver</h2>

          <p className="text-sm text-neutral-800">
            Endpoint: <code>POST /algebra/run</code>
          </p>

          <div className="space-y-2 text-sm text-neutral-800">
            <div>
              <div className="font-medium">Payload (example)</div>
              <pre className="mt-1 text-xs font-mono bg-neutral-50 border rounded-lg p-3 overflow-x-auto">
{`{
  "system": {
    "A": [[1, -1], [2, 1]],
    "b": [1, 4]
  }
}`}
              </pre>
            </div>

            <div>
              <div className="font-medium">Response (example)</div>
              <pre className="mt-1 text-xs font-mono bg-neutral-50 border rounded-lg p-3 overflow-x-auto">
{`{
  "ok": true,
  "y_q32": ["7158278826", "2863311530"],
  "y": [1.666666, 0.666666]
}`}
              </pre>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>
                  <code>y_q32</code>: raw Q32 substrate integers.
                </li>
                <li>
                  <code>y</code>: float convenience view.
                </li>
                <li>
                  Each call increments <code>metrics.runs</code> and{" "}
                  <code>metrics.stem.algebraRuns</code>.
                </li>
              </ul>
            </div>

            <div>
              <div className="font-medium">Example B — 2×2 system</div>
              <ul className="list-disc list-inside text-sm text-neutral-800 space-y-1">
                <li>
                  <code>A = [[1, -1], [2, 1]]</code>, <code>b = [1, 4]</code>
                </li>
                <li>
                  Q32: <code>["7158278826", "2863311530"]</code>
                </li>
                <li>
                  Floats: <code>[1.666666, 0.666666]</code>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Observability */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. Observability</h2>

          <div className="space-y-2 text-sm text-neutral-800">
            <div>
              <div className="font-medium">Metrics</div>
              <pre className="mt-1 text-xs font-mono bg-neutral-50 border rounded-lg p-3 overflow-x-auto">
{`curl -s http://64.227.89.110:8787/metrics | jq .`}
              </pre>
              <p className="mt-1">
                Provides total substrate runs and replays, emissions
                (<code>AURA_OUT</code>), and STEM-level counters (
                <code>odeRuns</code>, <code>algebraRuns</code>).
              </p>
            </div>

            <div>
              <div className="font-medium">Trace / bundle infrastructure</div>
              <p>
                The core substrate still exposes <code>/run</code> and{" "}
                <code>/replay</code> with LockGraph bundles:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><code>bundleHash</code>, <code>graphHash</code></li>
                <li>Deterministic trace steps and legality reasons</li>
                <li>Optional claims, provenance, signatures</li>
              </ul>
              <p className="mt-1">
                RIC-STEM is layered above this substrate; future versions can
                attach ODE/algebra steps to LockGraph for full STEM-level
                legality proofs.
              </p>
            </div>
          </div>
        </section>

        <footer className="pt-4 border-t text-xs text-neutral-500 flex justify-between gap-2 flex-wrap">
          <span>RIC-STEM v1 over RIC v2.</span>
          <a
            href="/stem"
            className="underline underline-offset-2 text-neutral-700"
          >
            Open the deterministic STEM demo →
          </a>
        </footer>
      </article>
    </main>
  );
}