import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE = process.env.RIC_API_BASE;

export async function POST(req: NextRequest) {
  if (!RIC_API_BASE) {
    return NextResponse.json(
      { error: { code: "E_NO_BACKEND", message: "RIC_API_BASE is not set" } },
      { status: 500 }
    );
  }

  const body = await req.json();

  const res = await fetch(`${RIC_API_BASE}/agi/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let json: any = null;

  try {
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "E_BAD_BACKEND_JSON",
          message: "Backend /agi/run did not return valid JSON",
          extra: text,
        },
      },
      { status: 502 }
    );
  }

  return NextResponse.json(json, { status: res.status });
}