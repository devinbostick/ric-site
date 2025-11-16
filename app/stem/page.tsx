// app/stem/page.tsx
"use client";

import { useState } from "react";

type StemResult = unknown;

type PresetKey = "ode_zero" | "ode_decay";

const PRESET_LABELS: Record<PresetKey, string> = {
  ode_zero: "Test ODE: y' = 0",
  ode_decay: "Test ODE: y' = -y",
};

const PRESET_BODIES: Record<PresetKey, any> = {
  ode_zero: {
    kind: "ode_linear",
    system: {
      // y' = 0
      A: [[0]],
      b: [0],
    },
    config: {
      t0: 0,
      t1: 1,
      dt: 0.1,
      y0: [0],
    },
  },
  ode_decay: {
    kind: "ode_linear",
    system: {
      // y' = -y  ⇒ A = [-1], b = [0]
      A: [[-1]],
      b: [0],
    },
    config: {
      t0: 0,
      t1: 3,
      dt: 0.1,
      y0: [1],
    },
  },
};

export default function StemPage() {
  const [activePreset, setActivePreset] = useState<PresetKey>("ode_zero");
  const [result, setResult] = useState<StemResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runPreset(kind: PresetKey) {
    setActivePreset(kind);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body = PRESET_BODIES[kind];

      const res = await fetch("/api/stem-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(
          typeof json?.error?.message === "string"
            ? json.error.message
            : "STEM run failed"
        );
      } else {
        setResult(json);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  const presetBody = PRESET_BODIES[activePreset];

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-4xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-neutral-700">
            Deterministic STEM engine: fixed-point Q32 ODE integration and
            linear systems over a replayable resonance substrate.
          </p>
        </header>

        {/* Preset selector + request */}
        <section className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">
                {PRESET_LABELS[activePreset]}
              </h2>
              <p className="text-sm text-neutral-600 mt-1 max-w-xl">
                Choose a preset and run it through the RIC-STEM backend. The
                request is sent to <code>/api/stem-run</code>, which proxies to
                the deterministic substrate at <code>/stem/run</code>.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => runPreset("ode_zero")}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  activePreset === "ode_zero"
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-800 border-neutral-300"
                }`}
              >
                y&apos; = 0
              </button>
              <button
                type="button"
                onClick={() => runPreset("ode_decay")}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  activePreset === "ode_decay"
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-800 border-neutral-300"
                }`}
              >
                y&apos; = -y
              </button>
            </div>
          </div>

          <div className="bg-black text-[13px] text-neutral-100 rounded-xl p-4 font-mono overflow-x-auto">
            <div className="text-xs text-neutral-400 mb-2">
              POST /api/stem-run
            </div>
            <pre className="whitespace-pre">
              {JSON.stringify(presetBody, null, 2)}
            </pre>
          </div>

          <button
            type="button"
            onClick={() => runPreset(activePreset)}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-black text-white text-sm font-medium hover:bg-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Running…" : "Run preset"}
          </button>
        </section>

        {/* Result */}
        <section className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-3">
          <h2 className="text-lg font-medium">Result</h2>
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}
          {!error && !result && (
            <p className="text-sm text-neutral-600">
              Run a preset to view the deterministic solution.
            </p>
          )}
          {result && (
            <div className="bg-neutral-950 text-[13px] text-neutral-100 rounded-xl p-4 font-mono overflow-x-auto max-h-[360px]">
              <pre className="whitespace-pre">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* Determinism card */}
        <section className="border rounded-2xl p-5 md:p-6 bg-neutral-50 space-y-2">
          <h2 className="text-base font-medium">Determinism</h2>
          <p className="text-sm text-neutral-700">
            RIC-STEM integrates these systems in fixed-point Q32 on the server.
            The <code>t</code> and <code>y</code> arrays shown above are
            float projections of the same underlying Q32 sequence. The same
            request body will produce identical outputs on any machine that
            runs this substrate.
          </p>
        </section>
      </div>
    </main>
  );
}