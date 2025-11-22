/**
 * Reasoning API v1 → RIC-Core
 *
 * POST https://resonanceintelligencecore.com/api/reason-run
 */

import { NextRequest, NextResponse } from "next/server";

// External RIC v2 API base
// Falls back to local dev if env missing
const RIC_API_BASE =
  process.env.RIC_API_BASE ?? "http://127.0.0.1:8787";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward directly to RIC-Core deterministic /reason/run
    const ricRes = await fetch(`${RIC_API_BASE}/reason/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store", // avoid any Next/Vercel caching
    });

    // Pass-through status + body exactly
    const data = await ricRes.json();
    return NextResponse.json(data, { status: ricRes.status });
  } catch (err) {
    console.error("[reason-run]", err);
    return NextResponse.json(
      { error: "E_REASON_PROXY" },
      { status: 500 },
    );
  }
}