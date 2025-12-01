import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE =
  process.env.RIC_API_BASE ?? "http://127.0.0.1:8787";

/**
 * POST /api/dialogue-run
 * Proxies directly to RIC-Core /agi/dialogue-run
 */
export async function POST(req: NextRequest) {
  const body = await req.text();

  const upstream = await fetch(`${RIC_API_BASE}/agi/dialogue-run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });

  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type": "application/json",
    },
  });
}
