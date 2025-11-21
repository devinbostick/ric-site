// app/api/algebra-run/route.ts
import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE =
  process.env.RIC_API_BASE ?? "http://64.227.89.110:8787";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Call RIC directly, NOT the Next.js API again
    const ricRes = await fetch(`${RIC_API_BASE}/algebra/run`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await ricRes.json();
    return NextResponse.json(data, { status: ricRes.status });
  } catch (err) {
    console.error("[algebra-run] error", err);
    return NextResponse.json(
      {
        error: {
          code: "ALGEBRA_RUN_ERROR",
          message: "Failed to reach RIC algebra backend",
        },
      },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}