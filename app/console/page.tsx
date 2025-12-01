"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import PasDriftPanel from "./components/PasDriftPanel";
import WorldPanel from "./components/WorldPanel";
import BundlesPanel from "./components/BundlesPanel";

type ActiveTab = "overview" | "pas" | "world" | "bundles";

export default function ConsolePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // Global metrics (PAS_h + drift via /metrics-proxy)
  const [metrics, setMetrics] = useState<any | null>(null);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // Latest AGI run surfaces (from /api/agi-run)
  const [world, setWorld] = useState<any | null>(null);
  const [agiBundleHash, setAgiBundleHash] = useState<string | null>(null);
  const [agiChosen, setAgiChosen] = useState<any | null>(null);
  const [agiCandidates, setAgiCandidates] = useState<any[]>([]);
  const [agiIdentity, setAgiIdentity] = useState<any | null>(null);
  const [agiPas, setAgiPas] = useState<any | null>(null);
  const [agiDrift, setAgiDrift] = useState<any | null>(null);
  const [agiLoading, setAgiLoading] = useState(false);
  const [agiError, setAgiError] = useState<string | null>(null);

  // Lazy-load metrics only when PAS tab is opened
  useEffect(() => {
    if (activeTab !== "pas" || metrics || metricsLoading) return;

    const run = async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);

        const res = await fetch("/api/metrics-proxy", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          const body = await res.text();
          setMetricsError(
            `HTTP ${res.status}${body ? ` — ${body.slice(0, 200)}` : ""}`,
          );
          return;
        }

        const json = await res.json();
        setMetrics(json);
      } catch (err: any) {
        setMetricsError(err?.message ?? String(err));
      } finally {
        setMetricsLoading(false);
      }
    };

    run();
  }, [activeTab, metrics, metricsLoading]);

  // Deterministic Helix AGI scenario (claims agent)
  async function runHelixScenario() {
    try {
      setAgiLoading(true);
      setAgiError(null);

      const payload = {
        docId: "doc-helix",
        runId: "helix-run-1",
        identityId: "helix-core",
        text: "small clean claim with no fraud flags",
        goals: [],
      };

      const res = await fetch("/api/agi-run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        setAgiError(
          `HTTP ${res.status}${body ? ` — ${body.slice(0, 200)}` : ""}`,
        );
        return;
      }

      const json = await res.json();

      // Hydrate AGI surfaces
      setWorld(json.world ?? null);
      setAgiBundleHash(
        typeof json.bundleHash === "string" ? json.bundleHash : null,
      );
      setAgiChosen(json.chosen ?? null);
      setAgiCandidates(Array.isArray(json.candidates) ? json.candidates : []);
      setAgiIdentity(json.identity ?? null);
      setAgiPas(json.legality?.pas ?? null);
      setAgiDrift(json.legality?.identityDrift ?? null);

      // After first AGI run, jump to World tab for visibility
      setActiveTab("world");
    } catch (err: any) {
      setAgiError(err?.message ?? String(err));
    } finally {
      setAgiLoading(false);
    }
  }

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
            <Link
              href="/agi"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Deterministic AGI
            </Link>
          </nav>
        </div>
      </header>

      {/* Console body */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          {/* Hero */}
          <div className="mb-6 max-w-3xl space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Deterministic agent console
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Inspect proof bundles and AGI state without touching the engine.
            </h1>
            <p className="text-sm leading-relaxed text-neutral-700">
              This console is a read-only window into the RIC-Core runtime:
              PAS_h and drift metrics, the AGI&apos;s internal world state, and
              deterministic proof bundles. Same inputs, same runs, same views
              across environments.
            </p>
          </div>

          {/* Tabs + Helix run */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ["overview", "Overview"],
                ["pas", "PAS_h & drift"],
                ["world", "World / FactStore"],
                ["bundles", "Proof bundles"],
              ].map(([key, label]) => {
                const k = key as ActiveTab;
                const active = activeTab === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setActiveTab(k)}
                    className={
                      "rounded-full border px-3 py-1 font-medium transition " +
                      (active
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500")
                    }
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 text-xs">
              {agiBundleHash && (
                <span className="hidden truncate text-[11px] text-neutral-500 sm:inline">
                  Latest bundleHash:&nbsp;
                  <span className="font-mono">
                    {agiBundleHash.slice(0, 10)}…
                  </span>
                </span>
              )}
              <button
                type="button"
                onClick={runHelixScenario}
                disabled={agiLoading}
                className={
                  "rounded-full border px-3 py-1 font-medium transition " +
                  (agiLoading
                    ? "border-neutral-300 bg-neutral-200 text-neutral-500"
                    : "border-neutral-900 bg-neutral-900 text-white hover:bg-black")
                }
              >
                {agiLoading ? "Running Helix…" : "Run Helix scenario"}
              </button>
            </div>
          </div>

          {/* Helix error (if any) */}
          {agiError && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
              Failed to run Helix scenario:
              <span className="ml-1 font-mono">{agiError}</span>
            </div>
          )}

          {/* Active panel */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
            {/* AGI status strip (chosen + PAS_h + drift) */}
            {(agiChosen || agiPas || agiDrift) && (
              <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px] text-neutral-700">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {agiChosen && (
                      <span>
                        <span className="font-semibold">Chosen action:</span>{" "}
                        <span className="font-mono">
                          {agiChosen.id ??
                            agiChosen.actionId ??
                            "unknown_action"}
                        </span>
                        {agiChosen.description && (
                          <span className="text-neutral-600">
                            {" "}
                            — {agiChosen.description}
                          </span>
                        )}
                      </span>
                    )}
                    {typeof agiPas?.currentPAS_h !== "undefined" && (
                      <span className="text-neutral-600">
                        <span className="font-semibold">PAS_h:</span>{" "}
                        <span className="font-mono">
                          {String(agiPas.currentPAS_h)}
                        </span>
                      </span>
                    )}
                  </div>
                  {agiDrift && (
                    <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-700">
                      Drift: {String(agiDrift.status ?? "unknown")}
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-3 text-xs text-neutral-700">
                <p className="leading-relaxed">
                  The deterministic agent console makes the AGI inspectable to
                  non-engineers. It pulls only from existing read-only
                  endpoints:
                  <span className="font-mono text-[10px]">
                    {" "}
                    /api/metrics-proxy
                  </span>
                  ,{" "}
                  <span className="font-mono text-[10px]">
                    /api/agi-run
                  </span>
                  ,{" "}
                  <span className="font-mono text-[10px]">
                    /api/agi-bundle/[id]
                  </span>{" "}
                  and{" "}
                  <span className="font-mono text-[10px]">
                    /api/bundle/[id]
                  </span>
                  .
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    <span className="font-semibold">
                      PAS_h &amp; ΔPAS_zeta:
                    </span>{" "}
                    numerical coherence score and drift per identity and tenant.
                    Higher PAS_h means the run matches the domain policy more
                    closely. ΔPAS_zeta shows how fast that score is moving.
                  </li>
                  <li>
                    <span className="font-semibold">World / FactStore:</span>{" "}
                    the AGI&apos;s internal world for a run – facts, entities,
                    events, roles, timeline, and long-term memory steps. This is
                    the state the engine actually used to decide.
                  </li>
                  <li>
                    <span className="font-semibold">Proof bundles:</span>{" "}
                    immutable JSON records that contain the reasoning graph,
                    legality checks, hashes, and world snapshot for a single
                    run. Same input and config always produce the same
                    bundleHash and graphHash.
                  </li>
                </ul>
                <p className="text-[11px] text-neutral-500">
                  All views are read-only. The console never mutates RIC-Core
                  state; it only renders what the substrate already emitted,
                  which makes every inspection replay-exact.
                </p>
              </div>
            )}

            {activeTab === "pas" && (
              <PasDriftPanel
                metrics={metrics}
                loading={metricsLoading}
                error={metricsError}
                agiPas={agiPas}
                agiDrift={agiDrift}
              />
            )}

            {activeTab === "world" && (
              <WorldPanel
                world={world}
                chosen={agiChosen}
                candidates={agiCandidates}
                identity={agiIdentity}
              />
            )}

            {activeTab === "bundles" && <BundlesPanel />}
          </div>
        </div>
      </section>
    </main>
  );
}
