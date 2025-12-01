"use client";

import React from "react";

type Props = {
  metrics: any;
  loading: boolean;
  error: string | null;
  agiPas: any | null;
  agiDrift: any | null;
};

export default function PasDriftPanel({
  metrics,
  loading,
  error,
  agiPas,
  agiDrift,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
        Loading PAS_h and drift metrics from RIC-Core…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
        Failed to load PAS_h metrics from <code>/api/metrics-proxy</code>.
        <div className="mt-1 text-[11px] opacity-80">
          {error}
        </div>
      </div>
    );
  }

  const hasMetrics = !!metrics;

  return (
    <div className="space-y-4">
      {/* Latest AGI run PAS_h + drift (from /agi/run) */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-700">
        <h3 className="text-sm font-medium text-neutral-900">
          Latest AGI run — PAS_h &amp; drift
        </h3>
        {agiPas || agiDrift ? (
          <div className="mt-2 space-y-1 text-[11px]">
            {agiPas && (
              <p>
                <span className="font-semibold">PAS_h (current):</span>{" "}
                <span className="font-mono">
                  {String(agiPas.currentPAS_h)}
                </span>
                {typeof agiPas.deltaPAS_zeta !== "undefined" && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-semibold">ΔPAS_zeta:</span>{" "}
                    <span className="font-mono">
                      {String(agiPas.deltaPAS_zeta)}
                    </span>
                  </>
                )}
              </p>
            )}
            {agiDrift && (
              <p>
                <span className="font-semibold">Drift status:</span>{" "}
                <span className="uppercase tracking-[0.16em]">
                  {String(agiDrift.status ?? "unknown")}
                </span>
                {agiDrift.window && (
                  <>
                    {" "}
                    · windowRuns={agiDrift.window.windowRuns} · warn=
                    {agiDrift.window.warningThreshold} · collapse=
                    {agiDrift.window.collapseThreshold}
                  </>
                )}
              </p>
            )}
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-neutral-600">
            No AGI run has been loaded yet. Press{" "}
            <span className="font-semibold">Run Helix scenario</span> in the
            console header to see PAS_h and drift for a concrete agent run.
          </p>
        )}
      </div>

      {/* Raw /metrics payload (if present) */}
      {hasMetrics ? (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-[11px] text-neutral-800">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Global PAS_h metrics (/api/metrics-proxy)
          </div>
          <pre className="max-h-72 overflow-auto rounded-xl bg-white p-3 text-[10px] leading-snug">
            {JSON.stringify(metrics, null, 2)}
          </pre>
          <p className="mt-2 text-[11px] text-neutral-500">
            This view is read-only. The same runtime state always produces the
            same PAS_h and drift metrics across environments.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 text-[11px] text-neutral-600">
          No global PAS_h metrics have been wired into <code>/metrics</code>{" "}
          yet. The panel above is already driven directly by the latest AGI
          run; this section will show identity- and tenant-level time-series
          once metrics streaming is enabled.
        </div>
      )}
    </div>
  );
}
