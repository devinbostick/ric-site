// app/bundle/[id]/BundlePageClient.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BundleSummary = {
  id?: string;
  emitted?: number;
  graphHash?: string;
  bundleHash?: string;
  graphNodeCount?: number;
  graphEdgeCount?: number;
};

type BundlePageClientProps = {
  id: string;
};

export default function BundlePageClient({ id }: BundlePageClientProps) {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rawBundle, setRawBundle] = useState<unknown | null>(null);
  const [summary, setSummary] = useState<BundleSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetch(`/api/bundle/${encodeURIComponent(id)}`);
        if (!res.ok) {
          const txt = await res.text();
          if (!cancelled) {
            setErrorMsg(`HTTP ${res.status}: ${txt}`);
          }
          return;
        }

        const json = await res.json();
        if (cancelled) return;

        setRawBundle(json);

        // Try to extract key fields defensively
        const graph = json.graph ?? {};
        const nodes = Array.isArray(graph.nodes) ? graph.nodes : [];
        const edges = Array.isArray(graph.edges) ? graph.edges : [];

        const s: BundleSummary = {
          id: json.trace?.id ?? json.id ?? id,
          emitted: typeof json.emitted === "number" ? json.emitted : undefined,
          graphHash: json.graphHash,
          bundleHash: json.bundleHash,
          graphNodeCount: nodes.length,
          graphEdgeCount: edges.length,
        };

        setSummary(s);
      } catch (err: unknown) {
        if (!cancelled) {
            const message =
                err instanceof Error ? err.message : String(err);
            setErrorMsg(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              RIC proof bundle
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
              Deterministic bundle for run&nbsp;
              <span className="font-mono text-sm md:text-base text-slate-300">
                {id}
              </span>
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-2xl">
              This page shows the proof bundle returned by the RIC substrate for
              a single run ID. The same inputs on the same version of RIC
              produce the same bundle, bit-for-bit.
            </p>
          </div>

          <div className="text-right space-y-1 text-[11px] text-slate-400">
            <div>
              <span className="font-semibold text-slate-200">
                Deterministic substrate
              </span>
              <span className="mx-1">·</span>
              Q32 fixed-point, no floats/time/random.
            </div>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-3 py-1 text-[11px] font-semibold hover:bg-slate-800"
            >
              Back to legality demo
            </Link>
          </div>
        </header>

        {/* Status */}
        <section className="mb-6">
          {loading && (
            <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300">
              Loading bundle from <code className="font-mono">/api/bundle/{id}</code> …
            </div>
          )}

          {errorMsg && (
            <div className="rounded-lg border border-rose-500/50 bg-rose-950 px-3 py-2 text-xs text-rose-100 whitespace-pre-wrap">
              Error loading bundle: {errorMsg}
            </div>
          )}
        </section>

        {/* Summary cards */}
        {summary && !loading && !errorMsg && (
          <section className="mb-6 grid gap-3 md:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Run
              </div>
              <div className="mt-1 font-mono text-[11px] break-all">
                {summary.id}
              </div>
              {typeof summary.emitted === "number" && (
                <div className="mt-2 text-[11px] text-slate-400">
                  Emitted ticks:{" "}
                  <span className="font-mono text-slate-100">
                    {summary.emitted}
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Graph
              </div>
              <div className="mt-2 text-[11px] text-slate-300">
                Nodes:{" "}
                <span className="font-mono text-slate-100">
                  {summary.graphNodeCount ?? "—"}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-300">
                Edges:{" "}
                <span className="font-mono text-slate-100">
                  {summary.graphEdgeCount ?? "—"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-1">
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Hashes
              </div>
              {summary.graphHash && (
                <div>
                  <div className="text-[10px] text-slate-400">graphHash</div>
                  <div className="font-mono text-[10px] break-all">
                    {summary.graphHash}
                  </div>
                </div>
              )}
              {summary.bundleHash && (
                <div>
                  <div className="text-[10px] text-slate-400">bundleHash</div>
                  <div className="font-mono text-[10px] break-all">
                    {summary.bundleHash}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Raw JSON */}
        {rawBundle && !loading && !errorMsg && (
          <section className="mb-10">
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Full bundle JSON (as returned by RIC)</span>
              <span>Shape is stable; new fields may be added over time.</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <pre className="max-h-[480px] overflow-auto text-[11px] leading-relaxed text-slate-100">
                {JSON.stringify(rawBundle, null, 2)}
              </pre>
            </div>
          </section>
        )}

        {/* If nothing loaded and no error */}
        {!loading && !errorMsg && !rawBundle && (
          <p className="text-xs text-slate-400">
            No bundle data returned for this ID.
          </p>
        )}
      </div>
    </main>
  );
}