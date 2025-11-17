// app/stem/page.tsx

"use client";

import { useState, type FormEvent } from "react";

type OdeResult = {
  ok: boolean;
  t: number[];
  y: number[][];
};

type AlgebraResult = {
  ok: boolean;
  y_q32: string[];
  y: number[];
};

export default function StemPage() {
  // -------- ODE state --------
  const [odePayload, setOdePayload] = useState<string>(
    JSON.stringify(
      {
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
      },
      null,
      2
    )
  );
  const [odeResult, setOdeResult] = useState<OdeResult | null>(null);
  const [odeError, setOdeError] = useState<string | null>(null);
  const [odeLoading, setOdeLoading] = useState(false);

  // -------- Algebra state --------
  const [AInput, setAInput] = useState<string>("[[1,-1],[2,1]]");
  const [bInput, setBInput] = useState<string>("[1,4]");
  const [algResult, setAlgResult] = useState<AlgebraResult | null>(null);
  const [algError, setAlgError] = useState<string | null>(null);
  const [algLoading, setAlgLoading] = useState(false);

  // -------- ODE handler --------
  async function runOde(e: FormEvent) {
    e.preventDefault();
    setOdeError(null);
    setOdeResult(null);
    setOdeLoading(true);

    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(odePayload);
      } catch {
        setOdeError("Payload is not valid JSON");
        setOdeLoading(false);
        return;
      }

      const res = await fetch("/api/stem-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const json = (await res.json()) as any;

      if (!res.ok || !json.ok) {
        setOdeError(json?.error?.message || "STEM ODE run failed");
        setOdeLoading(false);
        return;
      }

      setOdeResult({
        ok: true,
        t: json.t ?? [],
        y: json.y ?? [],
      });
    } catch (err: any) {
      setOdeError(err?.message || "Unexpected error");
    } finally {
      setOdeLoading(false);
    }
  }

  // -------- Algebra handler --------
  async function runAlgebra(e: FormEvent) {
    e.preventDefault();
    setAlgError(null);
    setAlgResult(null);
    setAlgLoading(true);

    try {
      let A: number[][];
      let b: number[];

      try {
        A = JSON.parse(AInput);
        b = JSON.parse(bInput);
      } catch {
        setAlgError("A or b is not valid JSON");
        setAlgLoading(false);
        return;
      }

      const body = {
        system: {
          A,
          b,
        },
      };

      const res = await fetch("/api/algebra-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = (await res.json()) as any;

      if (!res.ok || !json.ok) {
        setAlgError(json?.error?.message || "Algebra solve failed");
        setAlgLoading(false);
        return;
      }

      setAlgResult({
        ok: true,
        y_q32: json.y_q32 ?? [],
        y: json.y ?? [],
      });
    } catch (err: any) {
      setAlgError(err?.message || "Unexpected error");
    } finally {
      setAlgLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-5xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1
          </h1>
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            Deterministic STEM engine over the RIC substrate. Fixed-point
            Q32 numerics, replayable runs, and legality-locked reasoning.
          </p>
        </header>

        {/* ODE card */}
        <section className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">1. ODE — Linear system</h2>
          <p className="text-sm text-neutral-700">
            Sends a linear ODE specification to RIC at{" "}
            <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
              /stem/run
            </code>{" "}
            via <code className="text-xs">/api/stem-run</code>. All integration
            runs in fixed-point Q32 on the backend.
          </p>

          <form onSubmit={runOde} className="space-y-3">
            <label className="block text-sm font-medium">
              Request payload (JSON)
            </label>
            <textarea
              className="w-full min-h-[160px] rounded-lg border px-3 py-2 text-sm font-mono bg-neutral-50"
              value={odePayload}
              onChange={(e) => setOdePayload(e.target.value)}
            />

            <button
              type="submit"
              disabled={odeLoading}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-medium bg-black text-white disabled:opacity-60"
            >
              {odeLoading ? "Running…" : "Run ODE"}
            </button>
          </form>

          {odeError && (
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {odeError}
            </p>
          )}

          {odeResult && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border">
                <div className="font-semibold mb-1">t (time grid)</div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(odeResult.t, null, 2)}
                </pre>
              </div>
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border">
                <div className="font-semibold mb-1">y(t) (state)</div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(odeResult.y, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </section>

        {/* Algebra card */}
        <section className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">2. Algebra — Linear solver</h2>
          <p className="text-sm text-neutral-700">
            Solves <code>Ax = b</code> deterministically at{" "}
            <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
              /algebra/run
            </code>{" "}
            via <code className="text-xs">/api/algebra-run</code>. Backend
            outputs both Q32 integers and float representations.
          </p>

          <form onSubmit={runAlgebra} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Matrix A (JSON, e.g. [[1,-1],[2,1]])
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border px-3 py-2 text-sm font-mono bg-neutral-50"
                  value={AInput}
                  onChange={(e) => setAInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vector b (JSON, e.g. [1,4])
                </label>
                <textarea
                  className="w-full min-h-[80px] rounded-lg border px-3 py-2 text-sm font-mono bg-neutral-50"
                  value={bInput}
                  onChange={(e) => setBInput(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={algLoading}
              className="inline-flex items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-medium bg-black text-white disabled:opacity-60"
            >
              {algLoading ? "Solving…" : "Solve Ax = b"}
            </button>
          </form>

          {algError && (
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {algError}
            </p>
          )}

          {algResult && (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border">
                <div className="font-semibold mb-1">
                  Solution x in Q32 (raw ints)
                </div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(algResult.y_q32, null, 2)}
                </pre>
              </div>
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border">
                <div className="font-semibold mb-1">
                  Solution x as floats
                </div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(algResult.y, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}