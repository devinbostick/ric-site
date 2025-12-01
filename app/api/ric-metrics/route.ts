import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE = (process.env.RIC_API_BASE ?? "http://127.0.0.1:8787").replace(
  /\/+$/,
  ""
);

export async function GET(_req: NextRequest) {
  const upstream = await fetch(`${RIC_API_BASE}/metrics`, {
    method: "GET",
  });

  const text = await upstream.text();

  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type": "application/json",
    },
  });
}
