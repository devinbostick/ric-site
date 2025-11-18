/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useState } from "react";

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

  // ------------------------
  // Scenario selection
  // ------------------------
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

  // ------------------------
  // Helpers
  // ------------------------
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
        `Replayed in RIC v2 (Q32 fixed–point, no floats/time/random). ` +
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

  // ------------------------
  // UI
  // ------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            RIC Demo — Deterministic Gating Layer
          </h1>
          <p className="text-sm text-slate-500">
            RIC decides if the model is allowed to answer. Deterministic hashes,
            temporal law, and repeatable decisions.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Live web demo:{" "}
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
    </header>

      <main className="flex-1 flex gap-4 px-8 py-4">
        {/* LEFT SIDE — INPUTS */}
        <div className="w-1/2 flex flex-col gap-4">
          {/* Scenario selector */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Scenarios
            </h2>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <button
                  key={s.label}
                  onClick={() => applyScenario(s)}
                  className={
                    "text-xs px-3 py-1 rounded-full border transition-all " +
                    (selectedScenario?.label === s.label
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400")
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Claim JSON */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex-1 flex flex-col">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Claim JSON
            </h2>
            <textarea
              className="font-mono text-xs border border-slate-200 rounded-lg p-2 flex-1 resize-none outline-none focus:ring-1 focus:ring-slate-400"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
            />
          </div>

          {/* Question + Buttons */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Question
            </h2>
            <input
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-slate-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <div className="flex gap-3 mt-2">
              <button
                onClick={runRicDemo}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Running…" : "Run with RIC gating"}
              </button>

              <button
                onClick={runRawClaude}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-800 border border-slate-300 hover:border-slate-500 disabled:opacity-50"
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
        <div className="w-1/2 flex flex-col gap-4">
          {/* --- RIC Decision Block --- */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              RIC Substrate Decision (Deterministic)
            </h2>

            {!response && (
              <p className="text-xs text-slate-500 mt-1">
                Run the demo to see deterministic gating and repeatable hashes.
              </p>
            )}

            {response && (
              <div className="space-y-4 mt-2">
                {/* PASS / HALT Banner */}
                <div
                  className={
                    "rounded-lg px-3 py-3 text-sm font-medium shadow-sm " +
                    (response.decision === "PASS"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200")
                  }
                >
                  {response.decision === "PASS"
                    ? "PASS — Substrate allows model output"
                    : "HALT — Substrate blocks model output"}

                  {response.reason && (
                    <div className="text-xs mt-1 opacity-80">
                      Reason: {response.reason}
                    </div>
                  )}
                </div>

                {/* Deterministic Hashes */}
                <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                  <div>
                    <div className="text-slate-500 uppercase tracking-wide text-[10px]">
                      ProposalHash
                    </div>
                    <div className="break-all">{response.proposalHash}</div>
                  </div>

                  <div>
                    <div className="text-slate-500 uppercase tracking-wide text-[10px]">
                      PromptHash
                    </div>
                    <div className="break-all">{response.promptHash}</div>
                  </div>

                  <div>
                    <div className="text-slate-500 uppercase tracking-wide text-[10px]">
                      Version
                    </div>
                    <div>{response.version}</div>
                  </div>
                </div>

                {/* Proof Bundle (optional) */}
                  {response.ricBundle && (
                    <div className="space-y-2 text-[11px] font-mono">
                      <div>
                        <div className="text-slate-500 uppercase tracking-wide text-[10px]">
                          RIC Run ID
                        </div>
                        <div className="break-all">{response.ricBundle.id}</div>
                      </div>

                      {response.ricBundle.graphHash && (
                        <div>
                          <div className="text-slate-500 uppercase tracking-wide text-[10px]">
                            graphHash
                          </div>
                          <div className="break-all">
                            {response.ricBundle.graphHash}
                          </div>
                        </div>
                      )}

                      {response.ricBundle.bundleHash && (
                        <div>
                        <div className="text-slate-500 uppercase tracking-wide text-[10px]">
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
                      <pre className="mt-2 text-[10px] bg-slate-50 border border-slate-200 rounded-lg p-2 max-h-64 overflow-auto">
                       {JSON.stringify(response.ricBundle, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                {/* Replay button */}
                <button
                  onClick={replayDeterministically}
                  disabled={loading || !response}
                  className="text-xs px-3 py-1 rounded-md bg-slate-100 border border-slate-300 w-fit hover:bg-slate-200 disabled:opacity-50"
                >
                  Replay deterministically (Q32)
                </button>

                {replayNote && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    {replayNote}
                  </div>
                )}

                {replayDetail && (
                  <pre
                    className="
                      mt-2 text-[11px]
                      bg-slate-50 border border-slate-200 rounded-lg
                      p-2 max-h-64 overflow-auto
                      whitespace-pre-wrap break-all
                    "
                  >
                    {JSON.stringify(replayDetail, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* --- Claude Output (RIC-Gated) --- */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Claude Output (RIC-Gated)
            </h2>

            {!response && (
              <p className="text-xs text-slate-500">
                Run substrate gating first.
              </p>
            )}

            {response && response.decision === "PASS" && response.claude && (
              <pre className="text-xs whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-2 max-h-64 overflow-auto mt-2">
                {response.claude.text}
              </pre>
            )}

            {response && response.decision === "HALT" && (
              <p className="text-xs text-slate-600 mt-2">
                Model call blocked. No output generated.
              </p>
            )}
          </div>

          {/* --- Raw Claude --- */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Raw Model Output (Unconstrained)
            </h2>

            {!rawClaude && (
              <p className="text-xs text-slate-500">
                Run raw model to compare.
              </p>
            )}

            {rawClaude && (
              <pre className="text-xs whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-lg p-2 max-h-64 overflow-auto mt-2">
                {rawClaude}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}