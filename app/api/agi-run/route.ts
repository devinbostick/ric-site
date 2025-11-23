// app/api/agi-run/route.ts
import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE = process.env.RIC_API_BASE;

// Fail fast if misconfigured in dev; in prod you must set RIC_API_BASE.
export async function POST(req: NextRequest) {
  if (!RIC_API_BASE) {
    return NextResponse.json(
      { error: "RIC_API_BASE is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const res = await fetch(`${RIC_API_BASE}/agi/run`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: "RIC /agi/run call failed",
          status: res.status,
          response: json,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Unexpected error calling RIC /agi/run",
        message: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}