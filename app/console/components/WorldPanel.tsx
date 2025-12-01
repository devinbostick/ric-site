"use client";

import React from "react";

type WorldPanelProps = {
  world: any | null;
  chosen: any | null;
  candidates: any[];
  identity: any | null;
};

export default function WorldPanel({
  world,
  chosen,
  candidates,
  identity,
}: WorldPanelProps) {
  const hasWorld = !!world;
  const candidateList = Array.isArray(candidates) ? candidates : [];
  const candidateCount = candidateList.length;

  const topCandidates = candidateList
    .slice()
    .sort(
      (a, b) => Number(b?.pasScore ?? 0) - Number(a?.pasScore ?? 0),
    )
    .slice(0, 3);

  if (!hasWorld && !chosen && candidateCount === 0 && !identity) {
    return (
      <div className="space-y-3 text-xs text-neutral-700">
        <p className="leading-relaxed">
          This panel will show the AGI world state and FactStore for a selected
          identity or bundle: facts, entities, events, roles, timeline, and
          memory. Everything stays deterministic and replayable from proof
          bundles.
        </p>
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-3 py-3 text-[11px] text-neutral-600">
          No AGI run has been loaded yet. Press{" "}
          <span className="font-semibold">Run Helix scenario</span> to execute a
          deterministic AGI run and hydrate the world snapshot.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs text-neutral-700">
      <p className="leading-relaxed">
        This view shows the AGI&apos;s internal world and memory for the latest
        run: what it believes about the claim, how it encodes entities and
        roles, and the timeline of observed steps.
      </p>

      {/* Decision + identity summary */}
      {(chosen || candidateCount > 0 || identity) && (
        <section className="space-y-1 rounded-xl border border-neutral-200 bg-neutral-50 p-3">
          <h3 className="text-[11px] font-semibold text-neutral-900">
            Decision summary
          </h3>
          <div className="space-y-1 text-[11px] text-neutral-700">
            {chosen && (
              <p>
                <span className="font-semibold">Chosen action:</span>{" "}
                <span className="font-mono">
                  {chosen.id ?? chosen.actionId ?? "unknown_action"}
                </span>
                {chosen.description && (
                  <span className="text-neutral-600">
                    {" "}
                    — {chosen.description}
                  </span>
                )}
              </p>
            )}
            {candidateCount > 0 && (
              <p>
                <span className="font-semibold">Evaluated candidates:</span>{" "}
                {candidateCount}.{" "}
                {topCandidates.length > 0 && (
                  <>
                    Top scores:&nbsp;
                    {topCandidates.map((c, idx) => (
                      <span key={c.id ?? idx} className="font-mono">
                        {c.id ?? "candidate"}={String(c.pasScore ?? 0)}
                        {idx < topCandidates.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </>
                )}
              </p>
            )}
            {identity && (
              <p className="text-neutral-600">
                <span className="font-semibold">Identity:</span>{" "}
                <span className="font-mono">{identity.id}</span> · runs:{" "}
                {identity.runs} · memory steps: {identity.memoryCount}
              </p>
            )}
          </div>
        </section>
      )}

      {/* World snapshot */}
      {hasWorld && (
        <div className="grid gap-3 md:grid-cols-2">
          <section className="space-y-1 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="text-[11px] font-semibold text-neutral-900">
              Facts
            </h3>
            <div className="max-h-56 overflow-auto text-[10px] leading-snug">
              <pre>{JSON.stringify(world.facts ?? [], null, 2)}</pre>
            </div>
          </section>

          <section className="space-y-1 rounded-xl border border-neutral-200 bg-white p-3">
            <h3 className="text-[11px] font-semibold text-neutral-900">
              Entities / Roles
            </h3>
            <div className="max-h-56 overflow-auto text-[10px] leading-snug">
              <pre>
                {JSON.stringify(
                  {
                    entities: world.entities ?? [],
                    roles: world.roles ?? [],
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </section>

          <section className="space-y-1 rounded-xl border border-neutral-200 bg-white p-3 md:col-span-2">
            <h3 className="text-[11px] font-semibold text-neutral-900">
              Timeline / Memory
            </h3>
            <div className="max-h-64 overflow-auto text-[10px] leading-snug">
              <pre>
                {JSON.stringify(
                  {
                    timeline: world.timeline ?? [],
                    memory: world.memory ?? {},
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
