"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function BundlesPanel() {
  const router = useRouter();
  const [bundleId, setBundleId] = useState("");

  const onOpen = () => {
    const trimmed = bundleId.trim();
    if (!trimmed) return;
    router.push(`/bundle/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="space-y-3 text-xs text-neutral-700">
      <div className="space-y-1.5">
        <p className="text-xs leading-relaxed text-neutral-800">
          Use this panel to jump straight to a deterministic{" "}
          <span className="font-semibold">proof bundle</span> by ID.
        </p>
        <p className="text-[11px] leading-relaxed text-neutral-600">
          A proof bundle is a single JSON record for one AGI run. It contains:
          the full reasoning graph, legality decisions, PAS_h metrics, hashes,
          and the world snapshot the engine used. If you re-run the same input
          with the same config, you get the same bundleHash.
        </p>
      </div>

      <ul className="mt-1 space-y-1.5 text-[11px] text-neutral-600">
        <li>1. Run the Legality or Deterministic AGI demo.</li>
        <li>
          2. Copy the{" "}
          <span className="font-mono">bundleId</span> (or run id) from the
          response payload or logs.
        </li>
        <li>3. Paste it below and open the bundle.</li>
      </ul>

      <p className="mt-1 text-[11px] text-neutral-500">
        The bundle page shows the full JSON emitted by RIC-Core, including the
        reasoning graph, legality section, PAS_h history, and world state. Same
        id and graphHash means the same run across all environments.
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="text"
          value={bundleId}
          onChange={(e) => setBundleId(e.target.value)}
          placeholder="enter bundle id from logs or API"
          className="flex-1 rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-mono text-neutral-800 outline-none ring-0 ring-neutral-900/5 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2"
        />
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-40"
          disabled={!bundleId.trim()}
        >
          Open bundle
        </button>
      </div>

      <p className="text-[11px] text-neutral-500">
        Internally this navigates to{" "}
        <span className="font-mono">/bundle/&lt;bundleId&gt;</span>, which calls{" "}
        <span className="font-mono">GET /api/bundle/[id]</span> and proxies into
        RIC-Core&apos;s deterministic bundle endpoint.
      </p>
    </div>
  );
}