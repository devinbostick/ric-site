import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import crypto from "node:crypto";

type Claim = {
  policy_effective_date: string; // "YYYY-MM-DD"
  coverage_window_days: number;
  loss_date: string;
  report_date: string;
  damage_type: string;
};

type DemoResponse = {
  decision: "PASS" | "HALT";
  reason: string | null;
  proposalHash: string;
  promptHash: string;
  version: string;
  ricBundle?: any;
  claude?: { text: string };
};

const VERSION = "0.1.0";

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function hash256(payload: string): string {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function gateClaim(
  claim: Claim,
): { decision: "PASS" | "HALT"; reason: string | null } {
  const start = new Date(claim.policy_effective_date);
  const loss = new Date(claim.loss_date);
  const report = new Date(claim.report_date);
  const windowDays = claim.coverage_window_days;

  // 1) Loss must not be before policy start
  if (loss.getTime() < start.getTime()) {
    return {
      decision: "HALT",
      reason: "Loss date is before policy effective date.",
    };
  }

  // 2) Loss must be within coverage window from policy start
  const daysFromStartToLoss = daysBetween(start, loss);
  if (daysFromStartToLoss > windowDays) {
    return {
      decision: "HALT",
      reason: `Loss ${daysFromStartToLoss} days after policy start exceeds coverage window of ${windowDays} days.`,
    };
  }

  // 3) Report must be within coverage window from loss
  const daysLossToReport = daysBetween(loss, report);
  if (daysLossToReport > windowDays) {
    return {
      decision: "HALT",
      reason: `Report ${daysLossToReport} days after loss exceeds coverage window of ${windowDays} days.`,
    };
  }

  return { decision: "PASS", reason: null };
}

async function callRicCore(payload: any): Promise<any> {
  const base = process.env.RIC_URL || "http://localhost:8787";

  const res = await fetch(`${base}/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`RIC /run HTTP ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

async function callClaude(claim: Claim, question: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

  if (!apiKey) {
    return [
      "Set ANTHROPIC_API_KEY in the environment to call Claude.\n",
      "Stub response for demo:",
      `Claim: ${JSON.stringify(claim)}`,
      `Question: ${question}`,
    ].join("\n");
  }

  const anthropic = new Anthropic({ apiKey });

  const msg = await anthropic.messages.create({
    model,
    max_tokens: 512,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "You are an insurance claims analyst. " +
              "Given a structured JSON claim and a question, answer carefully.\n\n" +
              `Claim JSON:\n${JSON.stringify(claim, null, 2)}\n\n` +
              `Question: ${question}\n\n` +
              "Explain your reasoning step by step, then give a clear YES/NO at the end.",
          },
        ],
      },
    ],
  });

  const text = msg.content
    .map((c) => ("text" in c ? c.text : ""))
    .join("\n")
    .trim();

  return text;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const claim = body.claim as Claim;
    const question = String(body.question ?? "");

    if (!claim || !question) {
      return NextResponse.json(
        { error: "Missing claim or question" },
        { status: 400 },
      );
    }

    // 1) Deterministic gate
    const gate = gateClaim(claim);

    // 2) Real 256-bit hashes (shown in UI + used for replay)
    const proposalHash = hash256(JSON.stringify(claim));
    const promptHash = hash256(
      JSON.stringify({ claim, question, version: VERSION }),
    );

    // 3) Call RIC v2 local server to get deterministic bundle id
    const ricPayload = {
      windows: [{ id: "w1" }],
      symbols: [JSON.stringify({ claim, question })],
      primes: [7, 11],
    };

    const ricResult = await callRicCore(ricPayload);
    const ricBundle = { id: ricResult.id, emitted: ricResult.emitted };

    // 4) If PASS, call Claude; if HALT, skip model
    let claudeText: string | undefined;
    if (gate.decision === "PASS") {
      claudeText = await callClaude(claim, question);
    }

    const resp: DemoResponse = {
      decision: gate.decision,
      reason: gate.reason,
      proposalHash,
      promptHash,
      version: VERSION,
      ricBundle,
      claude: claudeText ? { text: claudeText } : undefined,
    };

    return NextResponse.json(resp);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? String(err) },
      { status: 500 },
    );
  }
}