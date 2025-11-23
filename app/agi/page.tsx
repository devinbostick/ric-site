// app/agi/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

type AgiChoice = {
  id: string;
  label: string;
  description: string;
  pasScore: number;
};

type AgiRunResponse = {
  id: string;
  version: string;
  bundleHash: string;
  bundle?: {
    version: string;
    codeHash: string;
    trace: {
      id: string;
      steps: any[];
    };
    graph: {
      version: string;
      nodes: any[];
      edges: any[];
      [k: string]: any;
    };
    graphHash: string;
    bundleHash: string;
    [k: string]: any;
  };
  legality?: any | null;
  chosen?: AgiChoice;
  candidates?: AgiChoice[];
  world?: {
    tick: number;
    facts: { key: string; value: any }[];
    storeHash: string;
    goals: any[];
    memory: { steps: any[] };
    entities: any[];
    events: any[];
    roles: any[];
    timeline: any[];
  };
  [k: string]: any;
};

export default function AgiPage() {
  const [text, setText] = useState("small clean claim with no fraud flags");
  const [docId, setDocId] = useState("doc-helix");
  const [runId, setRunId] = useState("run-1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AgiRunResponse | null>(null);

  async function handleRun() {
    const t = text.trim();
    if (!t) {
      setError("Input text is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agi-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          docId,
          runId,
          text: t,
          goals: [],
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`/api/agi-run failed: ${res.status} ${body}`);
      }

      const data = (await res.json()) as AgiRunResponse;
      setResult(data);
    } catch (e: any) {
      setError(e?.message ?? "Deterministic AGI run failed.");
    } finally {
      setLoading(false);
    }
  }

  const traceSteps = result?.bundle?.trace?.steps ?? [];
  const graphEdges = result?.bundle?.graph?.edges ?? [];

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
            <Link
              href="/reason"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Reasoning
            </Link>
          </nav>
        </div>
      </header>

      {/* AGI surface */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {/* Hero row */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Deterministic action selection
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Deterministic AGI loop over proof bundles
              </h1>
              <p className="text-sm leading-relaxed text-neutral-700">
                This surface sends your text into the AGI engine running on
                RIC-Core. The engine builds a proof bundle, scores candidate
                actions, and chooses the maximally coherent one. Same input,
                same world facts, same choice every time.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-3 text-xs text-neutral-700 shadow-sm md:w-64">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Quick start
              </p>
              <p className="mt-2 leading-snug">
                1. Keep the text short (one decision).
                <br />
                2. Run once, note the chosen action and bundle hash.
                <br />
                3. Run again with the same input — the choice and hash stay
                fixed.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left: input */}
            <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="text-sm font-medium text-neutral-900">
                Try the deterministic AGI loop
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                Provide a document id, run id, and a short natural-language
                description of the situation the agent is deciding over.
              </p>

              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="doc-id"
                      className="block text-xs font-medium text-neutral-700"
                    >
                      docId
                    </label>
                    <input
                      id="doc-id"
                      value={docId}
                      onChange={(e) => setDocId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="run-id"
                      className="block text-xs font-medium text-neutral-700"
                    >
                      runId
                    </label>
                    <input
                      id="run-id"
                      value={runId}
                      onChange={(e) => setRunId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="agi-text"
                    className="block text-xs font-medium text-neutral-700"
                  >
                    Input text
                  </label>
                  <textarea
                    id="agi-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRun}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                  {loading
                    ? "Running deterministic AGI…"
                    : "Run deterministic AGI"}
                </button>

                {error && (
                  <p className="text-xs text-red-600">
                    {error}
                  </p>
                )}

                <p className="text-[11px] text-neutral-500">
                  The engine uses RIC-Core’s PAS_h scoring, legality stack, and
                  proof bundles under the hood.
                </p>
              </div>
            </div>

            {/* Right: result */}
            <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-semibold text-neutral-900">
                  Last AGI run
                </h3>
                {result && (
                  <span className="rounded-full bg-neutral-900/5 px-2 py-0.5 text-[10px] font-medium text-neutral-800">
                    Deterministic choice
                  </span>
                )}
              </div>

              {!result && !loading && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                  Run the demo to see a deterministic AGI decision over your
                  input. For identical input and world state, the id, version,
                  and bundle hash remain identical.
                </p>
              )}

              {loading && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                  Executing deterministic AGI loop on your input…
                </p>
              )}

              {result && (
                <div className="mt-3 space-y-4 text-[11px] text-neutral-700">
                  {/* Core identifiers */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-neutral-900">
                        Engine id:
                      </span>
                      <span className="font-mono break-all text-[10px]">
                        {result.id}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-neutral-900">
                        Version:
                      </span>
                      <span className="font-mono text-[10px]">
                        {result.version}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-neutral-900">
                        Bundle hash:
                      </span>
                      <span className="font-mono break-all text-[10px]">
                        {result.bundleHash}
                      </span>
                    </div>
                  </div>

                  {/* Chosen action */}
                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Deterministic choice
                    </p>

                    <div className="space-y-1 text-[11px] text-neutral-700">
                      <div>
                        <span className="font-medium text-neutral-900">
                          Chosen action:
                        </span>{" "}
                        {result.chosen?.id ?? "(none)"}
                      </div>
                      <div>
                        <span className="font-medium text-neutral-900">
                          Label:
                        </span>{" "}
                          {result.chosen?.label ?? "(n/a)"}
                      </div>
                      <div>
                        <span className="font-medium text-neutral-900">
                          PAS_h score:
                        </span>{" "}
                        {result.chosen?.pasScore ?? "(n/a)"}
                      </div>
                    </div>
                  </div>

                  {/* Candidate scores */}
                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Candidate actions
                    </p>

                    <div className="max-h-40 overflow-auto space-y-1">
                      {result.candidates?.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px]"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">{c.id}</span>
                            <span className="font-mono">{c.pasScore}</span>
                          </div>
                          <p className="text-neutral-700">{c.description}</p>
                        </div>
                      ))}
                      {!result.candidates?.length && (
                        <p className="text-[11px] text-neutral-600">
                          No candidate list returned for this run.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Legality stack */}
                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Legality stack (RIC-Core)
                    </p>

                    <pre className="max-h-40 overflow-auto rounded-xl bg-neutral-50 px-3 py-2 text-[10px] leading-snug">
                      {JSON.stringify(result.legality, null, 2)}
                    </pre>
                  </div>

                  {/* Reasoning steps (from bundle.trace) */}
                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Reasoning steps (first 10)
                    </p>

                    <div className="max-h-64 overflow-auto space-y-1">
                      {traceSteps.slice(0, 10).map((s: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px]"
                        >
                          <div className="flex justify-between">
                            <span className="uppercase text-neutral-700">
                              {s.phase ?? s.kind ?? "STEP"}
                            </span>
                            {"tick" in s && (
                              <span className="font-mono text-neutral-500">
                                tick {s.tick}
                              </span>
                            )}
                          </div>
                          {s.label && (
                            <p className="text-neutral-800">{s.label}</p>
                          )}
                          {s.proofHash && (
                            <p className="mt-1 font-mono text-[9px] text-neutral-500">
                              {s.proofHash}
                            </p>
                          )}
                        </div>
                      ))}
                      {!traceSteps.length && (
                        <p className="text-[11px] text-neutral-600">
                          No reasoning steps were returned for this run.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Graph edges (from bundle.graph) */}
                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Graph edges
                    </p>

                    <div className="max-h-40 overflow-auto space-y-1">
                      {graphEdges.map((e: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px]"
                        >
                          <span className="font-mono text-neutral-900">
                            {e.from} → {e.to}
                          </span>
                        </div>
                      ))}
                      {!graphEdges.length && (
                        <p className="text-[11px] text-neutral-600">
                          No graph edges returned for this run.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Raw response */}
                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Raw response (debug)
                    </p>
                    <pre className="max-h-64 overflow-auto rounded-xl bg-neutral-50 px-3 py-2 text-[10px] leading-snug">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>

                  <p className="text-[11px] text-neutral-600">
                    Full proof bundle (reasoning graph, legality, hashes) is
                    generated inside RIC-Core and exposed here through the AGI
                    endpoint.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}