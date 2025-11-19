import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE = process.env.RIC_API_BASE ?? "http://64.227.89.110:8787";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ricRes = await fetch(`${RIC_API_BASE}/stem/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await ricRes.json();
    return NextResponse.json(data, { status: ricRes.status });
  } catch (err) {
    console.error("[stem-run] error", err);
    return NextResponse.json(
      {
        error: {
          code: "STEM_RUN_ERROR",
          message: "Failed to reach RIC STEM backend",
        },
      },
      { status: 500 }
    );
  }
}