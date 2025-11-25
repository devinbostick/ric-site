// app/api/agi-run/route.ts
import { NextResponse } from "next/server";

const RIC_API_BASE = (process.env.RIC_API_BASE ?? "http://127.0.0.1:8787").replace(
  /\/+$/,
  ""
);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));

    const rawText = typeof body.text === "string" ? body.text.trim() : "";
    if (!rawText) {
      return NextResponse.json(
        { error: "text is required", code: "E_BAD_AGI_INPUT" },
        { status: 400 }
      );
    }

    const identityIdSource =
      (typeof body.identityId === "string" && body.identityId.trim()) ||
      (typeof body.docId === "string" && body.docId.trim()) ||
      "default-identity";

    const maxTicksRaw =
      body?.config && Number.isInteger(body.config.maxTicks)
        ? body.config.maxTicks
        : undefined;

    const maxTicks =
      maxTicksRaw === undefined
        ? 4
        : Math.max(1, Math.min(32, maxTicksRaw));

    const payload = {
      identityId: identityIdSource,
      text: rawText,
      config: { maxTicks },
    };

    const ricRes = await fetch(`${RIC_API_BASE}/agi/run`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const ricBody = await ricRes.text();

    if (!ricRes.ok) {
      return NextResponse.json(
        {
          error: "RIC /agi/run failed",
          code: "E_AGI_INTERNAL",
          status: ricRes.status,
          body: ricBody,
        },
        { status: 500 }
      );
    }

    return new NextResponse(ricBody, {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "E_AGI_INTERNAL", message: "Unexpected AGI error" },
      { status: 500 }
    );
  }
}