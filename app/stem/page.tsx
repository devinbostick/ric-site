/* eslint-disable @typescript-eslint/no-explicit-any */

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
          // dy/dt = -y
          A: [[-1]],
          b: [0],
        },
        config: {
          t0: 0,
          t1: 1,
          dt: 0.25,
          y0: [1],
        },
      },
      null,
      2,
    ),
  );
  const [odeResult, setOdeResult] = useState<OdeResult | null>(null);
  const [odeError, setOdeError] = useState<string | null>(null);
  const [odeLoading, setOdeLoading] = useState(false);

  // ODE replay state
  const [odeReplayResult, setOdeReplayResult] = useState<OdeResult | null>(
    null,
  );
  const [odeReplayError, setOdeReplayError] = useState<string | null>(null);
  const [odeReplayLoading, setOdeReplayLoading] = useState(false);
  const [odeReplaySame, setOdeReplaySame] = useState<boolean | null>(null);

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
    setOdeReplayResult(null);
    setOdeReplayError(null);
    setOdeReplaySame(null);
    setOdeLoading(true);

    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(odePayload);
      } catch {
        setOdeError("Payload is not valid JSON.");
        setOdeLoading(false);
        return;
      }

      const res = await fetch("/api/stem-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed),
      });

      // If STEM backend is not live yet, show a clear message
      if (!res.ok) {
        setOdeError(
          `RIC substrate reached, but STEM ODE endpoint is not ready yet (status ${res.status}).`,
        );
        setOdeLoading(false);
        return;
      }

      const json = (await res.json()) as any;

      if (!json.ok) {
        setOdeError(json?.error?.message || "STEM ODE run failed.");
        setOdeLoading(false);
        return;
      }

      setOdeResult({
        ok: true,
        t: json.t ?? [],
        y: json.y ?? [],
      });
    } catch (err: any) {
      setOdeError(err?.message || "Unexpected error.");
    } finally {
      setOdeLoading(false);
    }
  }

  // -------- ODE replay handler --------
  async function replayOde() {
    if (!odeResult) {
      setOdeReplayError("Run the ODE once before replaying.");
      return;
    }

    setOdeReplayError(null);
    setOdeReplayResult(null);
    setOdeReplaySame(null);
    setOdeReplayLoading(true);

    try {
      let parsed: unknown;
      try {
        parsed = JSON.parse(odePayload);
      } catch {
        setOdeReplayError("Payload is not valid JSON.");
        setOdeReplayLoading(false);
        return;
      }

      const res = await fetch("/api/stem-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        setOdeReplayError(
          `RIC substrate reached, but STEM ODE endpoint is not ready yet (status ${res.status}).`,
        );
        setOdeReplayLoading(false);
        return;
      }

      const json = (await res.json()) as any;

      if (!json.ok) {
        setOdeReplayError(json?.error?.message || "STEM ODE replay failed.");
        setOdeReplayLoading(false);
        return;
      }

      const replay: OdeResult = {
        ok: true,
        t: json.t ?? [],
        y: json.y ?? [],
      };

      const sameT = JSON.stringify(replay.t) === JSON.stringify(odeResult.t);
      const sameY = JSON.stringify(replay.y) === JSON.stringify(odeResult.y);

      setOdeReplayResult(replay);
      setOdeReplaySame(sameT && sameY);
    } catch (err: any) {
      setOdeReplayError(err?.message || "Unexpected replay error.");
    } finally {
      setOdeReplayLoading(false);
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
        setAlgError("A or b is not valid JSON.");
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

      if (!res.ok) {
        setAlgError(
          `RIC substrate reached, but STEM algebra endpoint is not ready yet (status ${res.status}).`,
        );
        setAlgLoading(false);
        return;
      }

      const json = (await res.json()) as any;

      if (!json.ok) {
        setAlgError(json?.error?.message || "Algebra solve failed.");
        setAlgLoading(false);
        return;
      }

      setAlgResult({
        ok: true,
        y_q32: json.y_q32 ?? [],
        y: json.y ?? [],
      });
    } catch (err: any) {
      setAlgError(err?.message || "Unexpected error.");
    } finally {
      setAlgLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-5xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            RIC-STEM v1 — Deterministic STEM engine
          </h1>

          <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
            This page talks directly to the RIC substrate. Every run below is a
            deterministic math program: fixed-point Q32 arithmetic, no floats in
            core, no randomness, and full replay.
          </p>

          <div className="text-xs md:text-sm border rounded-xl px-3 py-2 bg-neutral-50 text-neutral-800 space-y-1.5">
            <div className="font-medium">What this proves</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>
                All differential equations and linear systems run on the same
                substrate that powers the legality demo.
              </li>
              <li>
                Same JSON request → same bitwise answer across machines and
                time.
              </li>
              <li>
                The substrate exposes global counters at{" "}
                <code className="text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
                  GET /metrics
                </code>{" "}
                so you can see STEM usage rise in real time.
              </li>
            </ul>
          </div>

          <p className="text-xs md:text-sm text-neutral-600">
            For a high-level walk-through, see the{" "}
            <a
              href="/ric-stem"
              className="underline underline-offset-2 text-neutral-800"
            >
              RIC-STEM v1 overview →
            </a>
          </p>
        </header>

        {/* ODE card */}
        <section className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">1. ODE — Linear system</h2>
          <p className="text-sm text-neutral-700">
            This sends an ODE specification to the substrate at{" "}
            <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
              POST /stem/run
            </code>{" "}
            via the Next.js edge endpoint{" "}
            <code className="text-xs">/api/stem-run</code>. All integration runs
            in fixed-point Q32 on the backend.
          </p>

          <p className="text-xs text-neutral-600">
            Default example: dy/dt = -y with y(0) = 1, integrated from t = 0 to
            t = 1 with step dt = 0.25.
          </p>

          <form onSubmit={runOde} className="space-y-3">
            <label className="block text-sm font-medium">
              Request payload (JSON)
              <span className="ml-1 text-[11px] text-neutral-500">
                Edit and resend to see how the substrate behaves.
              </span>
            </label>
            <textarea
              className="w-full min-h-[160px] rounded-lg border px-3 py-2 text-sm font-mono bg-neutral-50"
              value={odePayload}
              onChange={(e) => setOdePayload(e.target.value)}
            />

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={odeLoading}
                className="inline-flex items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-medium bg-black text-white disabled:opacity-60"
              >
                {odeLoading ? "Running…" : "Run ODE on RIC"}
              </button>

              <button
                type="button"
                onClick={replayOde}
                disabled={odeReplayLoading || !odeResult}
                className="inline-flex items-center justify-center rounded-lg border px-4 py-1.5 text-sm font-medium bg-white text-black disabled:opacity-60"
              >
                {odeReplayLoading ? "Replaying…" : "Replay with same input"}
              </button>
            </div>
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

          {odeReplayError && (
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {odeReplayError}
            </p>
          )}

          {odeReplayResult && (
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border">
                <div className="font-semibold mb-1">Replay t (time grid)</div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(odeReplayResult.t, null, 2)}
                </pre>
              </div>
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border">
                <div className="font-semibold mb-1">Replay y(t) (state)</div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(odeReplayResult.y, null, 2)}
                </pre>
              </div>
              <div className="text-xs font-mono bg-neutral-50 rounded-lg p-3 border flex flex-col justify-between">
                <div>
                  <div className="font-semibold mb-1">Determinism check</div>
                  <p className="text-sm">
                    {odeReplaySame === null
                      ? "Not evaluated yet."
                      : odeReplaySame
                      ? "Deterministic: replay matches original (t, y)."
                      : "Mismatch: replay does not match original (t, y)."}
                  </p>
                  <p className="text-[11px] text-neutral-600 mt-1">
                    Same input, same substrate, same output. That is the core
                    RIC guarantee.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Algebra card */}
        <section className="border rounded-2xl p-5 md:p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">2. Algebra — Linear solver</h2>
          <p className="text-sm text-neutral-700">
            This solves <code>Ax = b</code> on the same deterministic substrate.
            The UI calls{" "}
            <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
              POST /algebra/run
            </code>{" "}
            through{" "}
            <code className="text-xs">/api/algebra-run</code>. The backend
            returns both raw Q32 integers and float views.
          </p>

          <p className="text-xs text-neutral-600">
            Default example: 2×2 system that solves to x ≈ [1.666666, 0.666666].
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
              {algLoading ? "Solving…" : "Solve Ax = b on RIC"}
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