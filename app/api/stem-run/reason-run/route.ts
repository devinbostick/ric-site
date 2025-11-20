/**
 * Reasoning API v1 (RIC-Core)
 *
 * Base URL:
 *   POST https://resonanceintelligencecore.com/api/reason-run
 *
 * Request:
 *   {
 *     "inputs": [
 *       { "text": "first reasoning step" },
 *       { "text": "second reasoning step" }
 *     ]
 *   }
 *
 * Response:
 *   {
 *     "ok": true,
 *     "id": "reason-…",
 *     "version": "ric-v2",
 *     "graph": {
 *       "version": "reasoning_v1",
 *       "steps": [
 *         { "tick": "0", "content": "first reasoning step", "proofHash": "…" },
 *         { "tick": "1", "content": "second reasoning step", "proofHash": "…" }
 *       ],
 *       "edges": [
 *         { "from": "0", "to": "1", "kind": "NEXT" }
 *       ],
 *       "graphHash": "…"
 *     }
 *   }
 *
 * Each call produces:
 *   - Deterministic reasoning graph (nodes + NEXT edges)
 *   - graphHash locking structure
 *   - proofHash per step (bundles into RIC legality bundles)
 */

import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE =
  process.env.RIC_API_BASE ?? "http://64.227.89.110:8787";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ricRes = await fetch(`${RIC_API_BASE}/reason/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await ricRes.json();
    return NextResponse.json(data, { status: ricRes.status });
  } catch (err) {
    console.error("[reason-run]", err);
    return NextResponse.json(
      { error: "E_REASON_PROXY" },
      { status: 500 }
    );
  }
}