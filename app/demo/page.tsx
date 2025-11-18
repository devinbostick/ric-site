/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";
import Link from "next/link";

type DemoResponse = {
  decision: "PASS" | "HALT";
  reason: string | null;
  proposalHash: string;
  promptHash: string;
  version: string;
  ricBundle?: any;
  claude?: { text: string };
};

type Scenario = {
  label: string;
  claim: any;
  question: string;
};

const scenarios: Scenario[] = [
  {
    label: "Valid claim (within 30 days)",
    claim: {
      policy_effective_date: "2025-01-01",
      coverage_window_days: 30,
      loss_date: "2025-01-05",
      report_date: "2025-01-20",
      damage_type: "water",
    },
    question: "Is this claim covered under the policy?",
  },
  {
    label: "Late report (90 days after loss)",
    claim: {
      policy_effective_date: "2025-01-01",
      coverage_window_days: 30,
      loss_date: "2025-01-05",
      report_date: "2025-04-10",
      damage_type: "water",
    },
    question: "Is this claim covered under the policy?",
  },
  {
    label: "Report before loss",
    claim: {
      policy_effective_date: "2025-01-01",
      coverage_window_days: 30,
      loss_date: "2025-05-01",
      report_date: "2025-04-01",
      damage_type: "fire",
    },
    question: "Is this claim valid?",
  },
];

export default function DemoPage() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    scenarios[0],
  );
  const [claimText, setClaimText] = useState(
    JSON.stringify(scenarios[0].claim, null, 2),
  );
  const [question, setQuestion] = useState(scenarios[0].question);

  const [response, setResponse] = useState<DemoResponse | null>(null);
  const [rawClaude, setRawClaude] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [replayNote, setReplayNote] = useState<string | null>(null);
  const [replayDetail, setReplayDetail] = useState<any | null>(null);

  const applyScenario = (s: Scenario) => {
    setSelectedScenario(s);
    setClaimText(JSON.stringify(s.claim, null, 2));
    setQuestion(s.question);
    setResponse(null);
    setRawClaude(null);
    setReplayNote(null);
    setReplayDetail(null);
    setErrorMsg(null);
  };

  const parseClaim = (): any | null => {
    try {
      return JSON.parse(claimText);
    } catch (e: any) {
      setErrorMsg(`Invalid JSON: ${e.message ?? String(e)}`);
      return null;
    }
  };

  const callRicDemo = async (
    claim: any,
    question: string,
  ): Promise<DemoResponse> => {
    const res = await fetch("/api/demo-run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ claim, question }),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    }

    return (await res.json()) as DemoResponse;
  };

  const runRicDemo = async () => {
    const claim = parseClaim();
    if (!claim) return;

    setLoading(true);
    setErrorMsg(null);
    setResponse(null);
    setRawClaude(null);
    setReplayNote(null);
    setReplayDetail(null);

    try {
      const json = await callRicDemo(claim, question);
      setResponse(json);
    } catch (e: any) {
      setErrorMsg(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const replayDeterministically = async () => {
    if (!response) return;

    const claim = parseClaim();
    if (!claim) return;

    const prevProposal = response.proposalHash;
    const prevPrompt = response.promptHash;

    setLoading(true);
    setReplayNote(null);
    setReplayDetail(null);

    try {
      const json = await callRicDemo(claim, question);
      setResponse(json);

      const matchProposal = json.proposalHash === prevProposal;
      const matchPrompt = json.promptHash === prevPrompt;

      setReplayNote(
        `Replayed in RIC v2 (Q32 fixed-point, no floats/time/random). ` +
          (matchProposal && matchPrompt
            ? "Hashes are identical."
            : "Hashes changed (determinism violation)."),
      );

      setReplayDetail({
        prevProposal,
        newProposal: json.proposalHash,
        matchProposal,
        prevPrompt,
        newPrompt: json.promptHash,
        matchPrompt,
      });
    } catch (e: any) {
      setErrorMsg(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  const runRawClaude = async () => {
    const claim = parseClaim();
    if (!claim) return;

    setLoading(true);
    setErrorMsg(null);
    setRawClaude(null);

    try {
      const res = await fetch("/api/demo-raw-claude", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ claim, question }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      setRawClaude(json.text ?? "[no text]");
    } catch (e: any) {
      setErrorMsg(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            RIC Demo — Deterministic Gating Layer
          </h1>
          <p className="text-sm text-slate-500">
            RIC decides if the model is allowed to answer. Deterministic hashes,
            temporal law, and repeatable decisions.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Legality overview:{" "}
            <a
              href="https://resonanceintelligencecore.com/legality-demo"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              resonanceintelligencecore.com/legality-demo
            </a>
          </p>
        </div>

        <div className="text-xs text-slate-500 lg:text-right">
          Deterministic substrate · Q32 fixed-point, no floats/time/random.
          <div className="mt-1">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-3 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
            >
              Back to RIC home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:px-8">
        {/* LEFT SIDE — INPUTS */}
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          {/* Scenario selector */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Scenarios
            </h2>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.label}
                  onClick={() => applyScenario(s)}
                  className={
                    "rounded-full border px-3 py-1 text-xs transition-all " +
                    (selectedScenario?.label === s.label
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400")
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Claim JSON */}
          <div className="flex flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
              Claim JSON
            </h2>
            <textarea
              className="flex-1 resize-none rounded-lg border border-slate-200 bg-white p-2 font-mono text-xs outline-none focus:ring-1 focus:ring-slate-400"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
            />
          </div>

          {/* Question + Buttons */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Question
            </h2>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <div className="mt-2 flex flex-wrap gap-3">
              <button
                onClick={runRicDemo}
                disabled={loading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Running…" : "Run with RIC gating"}
              </button>

              <button
                onClick={runRawClaude}
                disabled={loading}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:border-slate-500 disabled:opacity-50"
              >
                Raw Claude
              </button>
            </div>

            {errorMsg && (
              <div className="mt-2 text-xs text-red-600">{errorMsg}</div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — OUTPUTS */}
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          {/* RIC Decision */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              RIC Substrate Decision (Deterministic)
            </h2>

            {!response && (
              <p className="mt-1 text-xs text-slate-500">
                Run the demo to see deterministic gating and repeatable hashes.
              </p>
            )}

            {response && (
              <div className="mt-2 space-y-4">
                {/* PASS / HALT banner */}
                <div
                  className={
                    "rounded-xl px-3 py-3 text-sm font-medium shadow-sm " +
                    (response.decision === "PASS"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-rose-200 bg-rose-50 text-rose-800")
                  }
                >
                  {response.decision === "PASS"
                    ? "PASS — Substrate allows model output"
                    : "HALT — Substrate blocks model output"}

                  {response.reason && (
                    <div className="mt-1 text-xs opacity-80">
                      Reason: {response.reason}
                    </div>
                  )}
                </div>

                {/* Model call status */}
                <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
                  <span className="font-semibold uppercase tracking-wide">
                    Model call:
                  </span>
                  {response.decision === "PASS" ? (
                    <span className="inline-flex items-center rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                      EXECUTED (allowed by substrate)
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-800">
                      SKIPPED (HALT blocked model)
                    </span>
                  )}
                </div>

                {/* Hashes */}
                <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">
                      proposalHash
                    </div>
                    <div className="break-all">{response.proposalHash}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">
                      promptHash
                    </div>
                    <div className="break-all">{response.promptHash}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">
                      version
                    </div>
                    <div>{response.version}</div>
                  </div>
                </div>

                {/* Proof bundle */}
                {response.ricBundle && (
                  <div className="space-y-2 text-[11px] font-mono">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">
                        RIC Run ID
                      </div>
                      <div className="break-all">{response.ricBundle.id}</div>
                    </div>

                    {response.ricBundle.id && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-500">
                          Bundle URL
                        </div>
                        <div className="break-all">
                          <Link
                            href={`/bundle/${encodeURIComponent(
                              response.ricBundle.id,
                            )}`}
                            className="underline underline-offset-2"
                          >
                            /bundle/{response.ricBundle.id}
                          </Link>
                        </div>
                      </div>
                    )}

                    {response.ricBundle.graphHash && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-500">
                          graphHash
                        </div>
                        <div className="break-all">
                          {response.ricBundle.graphHash}
                        </div>
                      </div>
                    )}

                    {response.ricBundle.bundleHash && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-500">
                          bundleHash
                        </div>
                        <div className="break-all">
                          {response.ricBundle.bundleHash}
                        </div>
                      </div>
                    )}

                    <details>
                      <summary className="cursor-pointer text-xs text-slate-600">
                        View full RIC bundle payload
                      </summary>
                      <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-2 text-[10px]">
                        {JSON.stringify(response.ricBundle, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                {/* Replay */}
                <button
                  onClick={replayDeterministically}
                  disabled={loading || !response}
                  className="w-fit rounded-md border border-slate-300 bg-slate-100 px-3 py-1 text-xs hover:bg-slate-200 disabled:opacity-50"
                >
                  Replay deterministically (Q32)
                </button>

                {replayNote && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    {replayNote}
                  </div>
                )}

                {replayDetail && (
                  <>
                    <div className="mt-1 text-[11px] text-slate-600">
                      <div className="font-semibold">
                        Determinism check (hashes)
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border " +
                            (replayDetail.matchProposal
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-rose-200 bg-rose-50 text-rose-800")
                          }
                        >
                          proposalHash{" "}
                          {replayDetail.matchProposal ? "MATCH" : "CHANGED"}
                        </span>
                        <span
                          className={
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] border " +
                            (replayDetail.matchPrompt
                              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                              : "border-rose-200 bg-rose-50 text-rose-800")
                          }
                        >
                          promptHash{" "}
                          {replayDetail.matchPrompt ? "MATCH" : "CHANGED"}
                        </span>
                      </div>
                    </div>

                    <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px]">
                      {JSON.stringify(replayDetail, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Claude output (RIC-gated) */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Claude Output (RIC-gated)
            </h2>

            {!response && (
              <p className="text-xs text-slate-500">
                Run substrate gating first.
              </p>
            )}

            {response && response.decision === "PASS" && response.claude && (
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
                {response.claude.text}
              </pre>
            )}

            {response && response.decision === "HALT" && (
              <p className="mt-2 text-xs text-slate-600">
                Model call blocked. No output generated.
              </p>
            )}
          </div>

          {/* Raw Claude */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Raw Model Output (Unconstrained)
            </h2>

            {!rawClaude && (
              <p className="text-xs text-slate-500">
                Run raw model to compare.
              </p>
            )}

            {rawClaude && (
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
                {rawClaude}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}