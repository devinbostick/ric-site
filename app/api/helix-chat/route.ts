// app/api/helix-chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import { buildHelixContext } from "../../../lib/helix/intent";
import { explainHelixAnswer } from "../../../lib/helix/explain";

/**
 * Deterministic runId derived only from the message text.
 * No Date.now, no randomness — same message → same runId.
 */
function stableRunId(message: string): string {
  let h = 0;
  const s = message.trim();
  for (let i = 0; i < s.length; i += 1) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return `helix-${h.toString(16)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const rawMessage =
      body && typeof body.message === "string" ? body.message : "";
    const message = rawMessage.trim();

    if (!message) {
      return NextResponse.json(
        {
          ok: false,
          error: { message: "Missing `message` in Helix chat request." },
        },
        { status: 400 },
      );
    }

    // 1) Deterministic intent + world context from the Helix KB.
    const context = await buildHelixContext(message);
    const runId = stableRunId(message);

    // 2) Call deterministic AGI engine via internal /api/agi-run proxy.
    const agiUrl = new URL("/api/agi-run", req.url);

    const agiRes = await fetch(agiUrl.toString(), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        docId: "helix-doc",
        runId,
        identityId: "helix-core",
        text: context.promptText,
        goals: [],
      }),
    });

    if (!agiRes.ok) {
      const bodyText = await agiRes.text();
      return NextResponse.json(
        {
          ok: false,
          error: {
            message: `AGI engine error: HTTP ${agiRes.status}${
              bodyText ? ` — ${bodyText.slice(0, 200)}` : ""
            }`,
          },
        },
        { status: 502 },
      );
    }

    const agiResult: any = await agiRes.json();

    // 3) Explanation layer: turn context + AGI output into narrative + receipts.
    const helixAnswer = explainHelixAnswer({
      message,
      intent: context.intent,
      worldSummary: context.worldSummary,
      evidenceFacts: context.evidenceFacts,
      agiResult,
      agiError: null,
    });

    // 4) Shape payload for HelixChat.tsx
    const responsePayload = {
      ok: true,
      answer: helixAnswer, // HelixChat reads answer.answer, answer.bullets, answer.evidenceFacts
      worldSummary: helixAnswer.worldSummary,
      pasSummary: helixAnswer.pasSummary,
      bundleSummary: helixAnswer.bundleSummary,
      agiError: helixAnswer.agiError,
      agi: {
        bundleHash: helixAnswer.agi?.bundleHash ?? null,
      },
    };

    return NextResponse.json(responsePayload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          message: err?.message ?? "Unexpected error in /api/helix-chat.",
        },
      },
      { status: 500 },
    );
  }
}