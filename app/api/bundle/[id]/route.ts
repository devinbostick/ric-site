// app/api/bundle/[id]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";

const RIC_URL =
  process.env.RIC_API_BASE ||
  process.env.RIC_URL ||
  process.env.NEXT_PUBLIC_RIC_URL ||
  "http://localhost:8787";

export async function GET(
  _req: Request,
  context: { params: { id: string } },
) {
  const id = context.params?.id;

  if (!id) {
    return NextResponse.json({ error: "Missing bundle id" }, { status: 400 });
  }

  try {
    const res = await fetch(`${RIC_URL}/bundle/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `RIC /bundle HTTP ${res.status}`,
          detail: await res.text(),
        },
        { status: 500 },
      );
    }

    const json = (await res.json()) as any;
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}