// app/api/metrics-proxy/route.ts

import { NextResponse } from "next/server";

const RIC_API_BASE =
  process.env.RIC_API_BASE ?? "http://127.0.0.1:8787";

export async function GET() {
  try {
    const res = await fetch(`${RIC_API_BASE}/metrics`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: `RIC /metrics returned status ${res.status}`,
          },
        },
        { status: 502 },
      );
    }

    const json = await res.json();

    return NextResponse.json(json, { status: 200 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json(
      {
        ok: false,
        error: {
          message: `Failed to reach RIC /metrics: ${message}`,
        },
      },
      { status: 502 },
    );
  }
}