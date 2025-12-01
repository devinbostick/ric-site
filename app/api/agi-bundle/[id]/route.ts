import { NextRequest, NextResponse } from "next/server";

const RIC_API_BASE = (process.env.RIC_API_BASE ?? "http://127.0.0.1:8787").replace(
  /\/+$/,
  ""
);

type Params = {
  params: { id: string };
};

export async function GET(_req: NextRequest, { params }: Params) {
  const id = params.id;

  const upstream = await fetch(`${RIC_API_BASE}/bundle/${encodeURIComponent(id)}`, {
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