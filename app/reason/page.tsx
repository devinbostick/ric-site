"use client";

import React, { useState } from "react";

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
    "The sky is blue. Blue light is scattered by the atmosphere."
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
      {/* Hero */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase">
            Deterministic reasoning trace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Deterministic reasoning trace for any text input
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-700">
            This demo shows RIC executing{" "}
            <span className="font-medium">reasoning itself</span> as a
            deterministic process. You provide free text; RIC turns it into a
            fixed sequence of steps (parse → structure → rule → final), hashes
            each step, and anchors the entire chain into a graphHash.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-neutral-700">
            The downstream model is not involved here. This page exposes the
            substrate directly:{" "}
            <span className="font-mono text-xs">
              same input → same steps → same graph → same hash
            </span>{" "}
            across machines and time.
          </p>
        </div>
      </section>

      {/* Input + live demo */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 lg:py-14">
          {/* Left: input form */}
          <div className="flex-1">
            <h2 className="text-sm font-medium text-neutral-900">
              Try the deterministic reasoning engine
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-600">
              Type any natural-language text: a claim, an observation, a
              question, or a multi-sentence paragraph. RIC will return a fixed
              reasoning trace you can replay exactly.
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
                {loading ? "Running deterministic reasoning…" : "Run deterministic reasoning"}
              </button>

              {error && (
                <p className="text-xs text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Right: last run summary */}
          <div className="flex-1">
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xs font-semibold text-neutral-900">
                  Last reasoning run
                </h3>
                {result && (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    Deterministic • OK
                  </span>
                )}
              </div>

              {!result && !loading && (
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">
                  Run the demo to see the deterministic reasoning trace. For
                  identical input the id, graphHash, and steps will be identical
                  on every machine.
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
                      Use the API to retrieve the full proof bundle for this
                      run via <span className="font-mono">GET /reason/bundle/:id</span>.
                    </p>
                  </div>

                  <div className="border-t border-neutral-200 pt-3">
                    <p className="mb-2 text-[11px] font-medium text-neutral-900">
                      Deterministic steps
                    </p>
                    <div className="space-y-2 max-h-64 overflow-auto pr-1">
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

      {/* Explanatory sections */}
      <section className="border-b border-neutral-200">
        <div className="mx-auto max-w-5xl px-4 py-10 space-y-10 sm:px-6 lg:px-8 lg:py-14">
          {/* 1. What the user sees */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              1. What the user sees
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              In this UI you type any natural-language text: a claim, an
              observation, a question, or a multi-sentence paragraph. You press
              run, and RIC returns a deterministic reasoning trace with a fixed
              sequence of phases (parse → structure → rule → final).
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              For identical input, the phases, node order, graph structure, and
              hashes are identical on every machine.
            </p>
          </div>

          {/* 2. What RIC does under the hood */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              2. What RIC does under the hood
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              The app sends your text to{" "}
              <span className="font-mono text-[11px]">POST /reason/run</span>.
              RIC normalizes the text and enters the deterministic reasoning
              path. Each phase produces a new step with its own hash and
              legality flag. The steps form a graph with a deterministic{" "}
              <span className="font-mono text-[11px]">graphHash</span>.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              The same substrate powers legality enforcement, STEM computation,
              contradiction detection, and infra workflows. Q32 fixed-point
              numerics, no randomness, no hidden clocks, no non-deterministic
              branches.
            </p>
          </div>

          {/* 3. Why this matters */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              3. Why this matters
            </h2>
            <ul className="mt-2 space-y-1 text-xs leading-relaxed text-neutral-700">
              <li>
                <span className="font-medium text-neutral-900">
                  Auditability:
                </span>{" "}
                every reasoning event can be stored as a proof bundle and
                replayed exactly.
              </li>
              <li>
                <span className="font-medium text-neutral-900">
                  Deterministic governance:
                </span>{" "}
                you can govern reasoning itself, not just outputs—key for
                compliance and safety-critical systems.
              </li>
              <li>
                <span className="font-medium text-neutral-900">
                  Debuggable and safe:
                </span>{" "}
                any change to the steps or graph changes the hash, making
                retroactive edits detectable.
              </li>
              <li>
                <span className="font-medium text-neutral-900">
                  Foundational substrate:
                </span>{" "}
                the same engine underlies STEM, legality, ETL verification, and
                deterministic decision chains.
              </li>
            </ul>
          </div>

          {/* 4. Integration sketch */}
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">
              4. Integration sketch
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              A common pattern:
            </p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed text-neutral-700">
              <li>Your app receives text or events.</li>
              <li>
                Instead of passing raw text directly to a model or system, your
                backend calls RIC&apos;s deterministic reasoning engine.
              </li>
              <li>
                RIC returns a reasoning trace with step hashes, legality, and a
                graphHash.
              </li>
              <li>
                You can gate downstream actions, store the bundle, and replay
                runs for audits or debugging.
              </li>
            </ol>
            <p className="mt-2 text-xs leading-relaxed text-neutral-700">
              The same pattern works with FastAPI, Express, Go, Rust,
              Terraform/Kubernetes gates, and edge or on-prem deployments.
            </p>
          </div>

          {/* At a glance / Next steps */}
          <div className="grid gap-6 border-t border-neutral-200 pt-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
                At a glance
              </h3>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-neutral-700">
                <li>Deterministic reasoning engine for any free-text input.</li>
                <li>Bit-for-bit identical replay of steps and graph hashes.</li>
                <li>Same Q32 substrate as the deterministic STEM engine.</li>
                <li>
                  Built for infrastructure, scientific, compliance, and
                  safety-critical stacks.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-700">
                Next steps
              </h3>
              <ul className="mt-2 space-y-1 text-xs leading-relaxed text-neutral-700">
                <li>Open the live legality demo and trigger PASS / HALT cases.</li>
                <li>
                  Explore deterministic math and Q32 numerics in the RIC-STEM
                  engine.
                </li>
                <li>Request API access from the form on the homepage.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}