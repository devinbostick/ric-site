"use client";

import React, { useState } from "react";
import Link from "next/link";

type ReasonNode = {
  id: string;
  stepIndex: number;
  phase: string;
  label: string;
  tick: number;
  parent: number | null;
};

type ReasonEdge = {
  from: string;
  to: string;
  kind: string;
};

type ReasonGraph = {
  nodes: ReasonNode[];
  edges: ReasonEdge[];
  graphHash: string;
};

type ReasonRunResponse = {
  ok: boolean;
  id: string;
  version: string;
  graph: ReasonGraph;
};

export default function ReasonPage() {
  const [text, setText] = useState(
    "Helix is stable in production. Helix is not stable in production."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReasonRunResponse | null>(null);

  async function handleRun() {
    const payload = text.trim();

    if (!payload) {
      setError("Input text is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/reason-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ inputs: [{ text: payload }] }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`reason-run failed: ${res.status} ${body}`);
      }

      const data = (await res.json()) as ReasonRunResponse;
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Deterministic reasoning request failed.");
    } finally {
      setLoading(false);
    }
  }

  const nodesSorted =
    result?.graph?.nodes?.slice().sort((a, b) => a.stepIndex - b.stepIndex) ??
    [];

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Top nav */}
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
              RIC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Resonance
              </span>
              <span className="text-sm font-medium text-neutral-800">
                Intelligence Core
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-xs md:flex md:text-sm">
            <Link
              href="/"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Legality demo
            </Link>
            <Link
              href="/stem"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              RIC-STEM
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero + input + trace */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {/* Hero row */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Deterministic reasoning trace
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Deterministic reasoning for any text input
              </h1>
              <p className="text-sm leading-relaxed text-neutral-700">
                Type natural-language text. RIC turns it into a fixed sequence
                of steps (parse → structure → rule → final), hashes each step,
                and anchors the chain into a graphHash. Same input, same steps,
                same graph on every machine.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-3 text-xs text-neutral-700 shadow-sm md:w-64">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Quick start
              </p>
              <p className="mt-2 leading-snug">
                1. Use the Helix contradiction example.
                <br />
                2. Run reasoning and note the graph hash.
                <br />
                3. Remove “not” and rerun — the graph stays the same while
                legality flips.
              </p>
            </div>
          </div>

          {/* Main split: input / last run */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left: input form */}
            <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-medium text-neutral-900">
                Try the deterministic reasoning engine
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Paste a claim, observation, or short paragraph. For a visible
                effect, start with the Helix contradiction shown below.
              </p>

              <div className="mt-4 space-y-3">
                <label
                  htmlFor="reason-input"
                  className="block text-xs font-medium text-neutral-700"
                >
                  Input text
                </label>
                <textarea
                  id="reason-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />

                <button
                  type="button"
                  onClick={handleRun}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                  {loading
                    ? "Running deterministic reasoning…"
                    : "Run deterministic reasoning"}
                </button>

                {error && (
                  <p className="text-xs text-red-600">
                    {error}
                  </p>
                )}

                <p className="text-[11px] text-neutral-500">
                  Tip: keep the text short and concrete so the steps are easy to
                  read.
                </p>
              </div>
            </div>

            {/* Right: last run summary */}
            <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-semibold text-neutral-900">
                  Last reasoning run
                </h3>
                {result && (
                  <span className="rounded-full bg-neutral-900/5 px-2 py-0.5 text-[10px] font-medium text-neutral-800">
                    Deterministic trace
                  </span>
                )}
              </div>

              {!result && !loading && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                  Run the demo to see a fixed reasoning trace. For identical
                  input, the run id, graph hash, and step sequence are identical
                  across machines and time.
                </p>
              )}

              {loading && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                  Executing deterministic reasoning on your input…
                </p>
              )}

              {result && (
                <div className="mt-3 space-y-4">
                  <div className="space-y-1 text-[11px] text-neutral-700">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-neutral-900">
                        Run id:
                      </span>
                      <span className="font-mono break-all text-[10px]">
                        {result.id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-neutral-900">
                        Graph hash:
                      </span>
                      <span className="font-mono break-all text-[10px]">
                        {result.graph.graphHash}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span>
                        <span className="font-medium text-neutral-900">
                          Nodes:
                        </span>{" "}
                        {result.graph.nodes.length}
                      </span>
                      <span>
                        <span className="font-medium text-neutral-900">
                          Edges:
                        </span>{" "}
                        {result.graph.edges.length}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-neutral-600">
                      Full bundle is available from{" "}
                      <span className="font-mono">
                        GET /reason/bundle/{result.id}
                      </span>
                      .
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Deterministic steps
                    </p>
                    <div className="max-h-64 space-y-2 overflow-auto pr-1">
                      {nodesSorted.map((node) => (
                        <div
                          key={node.id}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-800">
                              {node.phase}
                            </span>
                            <span className="text-[10px] text-neutral-500">
                              tick {node.tick}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] leading-snug text-neutral-700">
                            {node.label}
                          </p>
                          <p className="mt-1 truncate text-[9px] font-mono text-neutral-500">
                            {node.id}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Compact explanation cards */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                What you type
              </p>
              <p className="mt-2 leading-snug">
                Free text: claims, observations, short paragraphs. No special
                syntax. The engine reads what the text actually says.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                What RIC does
              </p>
              <p className="mt-2 leading-snug">
                Builds a fixed sequence of reasoning steps (parse → structure →
                rule → final), hashes each step, and anchors them into a
                deterministic graph.
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-700">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                What you get
              </p>
              <p className="mt-2 leading-snug">
                A proof bundle: steps, legality, hashes, and graphHash. You can
                store it, replay it, and gate actions on it.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 text-xs text-neutral-700 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Where this fits
              </p>
              <ul className="mt-2 space-y-1 leading-snug">
                <li>• Safety or compliance gates in front of agents.</li>
                <li>• Infra control planes that must be replayable.</li>
                <li>• Workflows that need full reasoning provenance.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Next surfaces to try
              </p>
              <ul className="mt-2 space-y-1 leading-snug">
                <li>
                  •{" "}
                  <Link
                    href="/demo"
                    className="underline underline-offset-2 hover:text-neutral-900"
                  >
                    Legality demo
                  </Link>{" "}
                  — deterministic PASS / HALT over proposals.
                </li>
                <li>
                  •{" "}
                  <Link
                    href="/stem"
                    className="underline underline-offset-2 hover:text-neutral-900"
                  >
                    RIC-STEM
                  </Link>{" "}
                  — deterministic ODE and algebra on the same core.
                </li>
                <li>
                  •{" "}
                  <Link
                    href="/"
                    className="underline underline-offset-2 hover:text-neutral-900"
                  >
                    Home
                  </Link>{" "}
                  — overview and API access form.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}