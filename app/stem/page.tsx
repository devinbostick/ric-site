// app/stem/page.tsx

"use client";

import { useState } from "react";

type StemResponse = {
  ok: boolean;
  t: number[];
  y: number[][];
};

const TEST_BODY = {
  kind: "ode_linear",
  system: {
    A: [[0]],
    b: [0],
  },
  config: {
    t0: 0,
    t1: 1,
    dt: 0.1,
    y0: [0],
  },
};

export default function StemPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StemResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runTest() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stem-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(TEST_BODY),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("STEM backend returned an error.");
        setResult(null);
        return;
      }
      setResult(data);
    } catch (e: any) {
      setError(e?.message || "Request failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1
          </h1>
          <p className="text-base md:text-lg text-neutral-700">
            Deterministic STEM engine: fixed-point ODE integration and linear
            systems over a replayable substrate.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: preset problem description */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-lg font-medium">Test ODE: y&apos; = 0</h2>
            <p className="text-sm text-neutral-700">
              This preset sends a simple linear system with A = [0], b = [0],
              so the derivative is always zero and the solution remains
              constant at y(t) = 0.
            </p>

            <div className="rounded-lg bg-neutral-900 text-neutral-50 text-xs font-mono p-3 overflow-x-auto">
              <pre className="whitespace-pre-wrap">
{`POST /api/stem-run

{
  "kind": "ode_linear",
  "system": {
    "A": [[0]],
    "b": [0]
  },
  "config": {
    "t0": 0,
    "t1": 1,
    "dt": 0.1,
    "y0": [0]
  }
}`}
              </pre>
            </div>

            <button
              onClick={runTest}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "Running…" : "Run test ODE"}
            </button>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}
          </section>

          {/* Right: result viewer */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm flex flex-col">
            <h2 className="text-lg font-medium mb-2">Result</h2>
            <div className="flex-1 rounded-lg bg-neutral-100 text-xs font-mono p-3 overflow-auto">
              {result ? (
                <pre className="whitespace-pre">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-neutral-600">
                  Run the test to see the time grid and solution vector from the
                  deterministic STEM engine.
                </p>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border bg-white p-5 shadow-sm text-sm text-neutral-700">
          <h2 className="text-base font-medium mb-1">Status</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>RIC v2 substrate live at /stem/run.</li>
            <li>This page calls /api/stem-run → RIC /stem/run.</li>
            <li>Future: multiple presets, custom system editor, and plots.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}