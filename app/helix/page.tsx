"use client";

import { useState } from "react";

type PasSummary =
  | {
    current: number | null;
    delta: number | null;
    driftStatus: string | null;
  }
  | null;

type BundleSummary =
  | {
    title: string;
    lines: string[];
  }
  | null;

type HelixFact = {
  id: string;
  category: string;
  key: string;
  value: string;
  tags?: string[];
};

type HelixAnswer = {
  answer: string;
  bullets: string[];
  evidenceFacts: HelixFact[];
  worldSummary: string;
  pasSummary: PasSummary;
  bundleSummary: BundleSummary;
  agiError: string | null;
  agi: {
    bundleHash?: string;
  };
  // Optional: if you later add intent to the API
  intent?: string;
};

type HelixApiResponse = {
  ok: boolean;
  answer: HelixAnswer;
  worldSummary: string;
  pasSummary: PasSummary;
  bundleSummary: BundleSummary;
  agiError: string | null;
  agi: {
    bundleHash?: string;
  };
};

function groupFactsByCategory(facts: HelixFact[]): Record<string, HelixFact[]> {
  const grouped: Record<string, HelixFact[]> = {};
  for (const f of facts) {
    const cat = f.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(f);
  }
  return grouped;
}

function formatPasStatus(p: PasSummary): { label: string; details: string } {
  if (!p) return { label: "PAS: n/a", details: "No PAS summary returned." };
  const current =
    typeof p.current === "number" ? p.current.toFixed(4) : "n/a";
  const delta =
    typeof p.delta === "number" ? p.delta.toExponential(2) : "n/a";
  const drift = p.driftStatus ?? "UNKNOWN";
  return {
    label: `PAS: ${current} (Δ: ${delta})`,
    details: `Drift verdict: ${drift}`,
  };
}

export default function HelixConsolePage() {
  const [message, setMessage] = useState("tell me about Helix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HelixApiResponse | null>(null);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/helix-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(`HTTP ${res.status}: ${text}`);
        setData(null);
        setLoading(false);
        return;
      }

      const json = (await res.json()) as HelixApiResponse;
      if (!json.ok) {
        setError(json.agiError || "Helix API reported ok=false.");
        setData(null);
      } else {
        setData(json);
      }
    } catch (err: any) {
      setError(String(err?.message || err));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const answer = data?.answer ?? null;
  const groupedFacts = answer
    ? groupFactsByCategory(answer.evidenceFacts)
    : {};
  const pas = answer?.pasSummary ?? data?.pasSummary ?? null;
  const pasStatus = formatPasStatus(pas);
  const bundle = answer?.bundleSummary ?? data?.bundleSummary ?? null;
  const bundleHash =
    answer?.agi?.bundleHash ?? data?.agi?.bundleHash ?? null;
  const intent =
    (answer as any)?.intent ??
    null; /* optional, only if API returns it later */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Helix Console
            </h1>
            <p className="text-sm text-slate-400">
              Deterministic mind over a fixed Helix knowledge base, with
              receipts.
            </p>
          </div>

          {/* Intent + PAS/drift badges */}
          {answer && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
                Intent:{" "}
                <span className="font-mono">
                  {intent ?? "not exposed"}
                </span>
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1">
                {pasStatus.label}
              </span>
            </div>
          )}
        </header>

        {/* Query form */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/40">
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={handleAsk}
          >
            <label className="flex-1">
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Message
              </span>
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm
             text-slate-50 placeholder:text-slate-500
             outline-none focus:border-sky-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask Helix a question about its business, system state, or incidents..."
              />
            </label>
            <button
              type="submit"
              disabled={loading || message.trim().length === 0}
              className="mt-2 inline-flex items-center justify-center rounded-lg border border-sky-500 bg-sky-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-sky-500/30 transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 sm:mt-6"
            >
              {loading ? "Thinking…" : "Ask Helix"}
            </button>
          </form>
          {error && (
            <p className="mt-3 text-xs text-red-400">Error: {error}</p>
          )}
        </section>

        {/* Main layout: answer + side panels */}
        {answer && (
          <section className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
            {/* Left: main answer + bullets */}
            <div className="space-y-4">
              {/* Main answer strip */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/40">
                <h2 className="mb-2 text-sm font-semibold text-slate-300">
                  Answer
                </h2>
                <p className="text-sm leading-relaxed text-slate-50">
                  {answer.answer}
                </p>
              </div>

              {/* Explanation bullets */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/40">
                <h3 className="mb-2 text-sm font-semibold text-slate-300">
                  Explanation
                </h3>
                {answer.bullets.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    No explanation bullets returned.
                  </p>
                ) : (
                  <ul className="space-y-1 text-xs text-slate-200">
                    {answer.bullets.map((b, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2 leading-snug"
                      >
                        <span className="mt-[3px] h-[6px] w-[6px] rounded-full bg-slate-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Debug panel (optional) */}
              <div className="rounded-xl border border-slate-900 bg-slate-950/80 p-4">
                <h3 className="mb-2 text-xs font-semibold text-slate-400">
                  Debug · PAS / Drift
                </h3>
                <p className="mb-1 text-xs text-slate-300">
                  {pasStatus.details}
                </p>
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-900/90 p-2 text-[10px] text-slate-300">
                  {JSON.stringify(pas, null, 2)}
                </pre>
              </div>
            </div>

            {/* Right: world evidence + proof bundle */}
            <div className="space-y-4">
              {/* World panel */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/40">
                <h2 className="mb-1 text-sm font-semibold text-slate-300">
                  World summary
                </h2>
                <p className="mb-3 text-xs text-slate-300">
                  {answer.worldSummary}
                </p>

                <div className="space-y-2 text-xs">
                  {Object.entries(groupedFacts).map(
                    ([cat, facts]) => (
                      <div key={cat}>
                        <div className="mb-1 font-semibold uppercase tracking-wide text-slate-400">
                          {cat}
                        </div>
                        <ul className="space-y-1">
                          {facts.slice(0, 4).map((f) => (
                            <li
                              key={f.id}
                              className="flex flex-col rounded border border-slate-800 bg-slate-950/70 px-2 py-1"
                            >
                              <span className="font-mono text-[11px] text-sky-300">
                                {f.key}
                              </span>
                              <span className="text-[11px] text-slate-200">
                                {f.value}
                              </span>
                            </li>
                          ))}
                          {facts.length > 4 && (
                            <li className="text-[11px] text-slate-500">
                              +{facts.length - 4} more in this
                              category
                            </li>
                          )}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Proof panel */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-black/40">
                <h2 className="mb-2 text-sm font-semibold text-slate-300">
                  Proof bundle
                </h2>
                {bundle ? (
                  <>
                    <p className="mb-2 text-xs text-slate-300">
                      {bundle.title}
                    </p>
                    <ul className="mb-3 space-y-1 text-[11px] text-slate-200">
                      {bundle.lines.map((line, idx) => (
                        <li key={idx} className="font-mono">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <p className="text-xs text-slate-400">
                    No bundle summary available.
                  </p>
                )}

                <div className="mt-2">
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    bundleHash
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      className="flex-1 truncate rounded border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-[11px] text-slate-200"
                      value={bundleHash ?? ""}
                      placeholder="(none)"
                    />
                    {bundleHash && (
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            bundleHash,
                          )
                        }
                        className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 hover:bg-slate-800"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                  {answer.agiError && (
                    <p className="mt-2 text-[11px] text-amber-400">
                      AGI legality note: {answer.agiError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
