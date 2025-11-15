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
  ricBundle?: {
    id: string;
    emitted: number;
  };
  claude?: { text: string };
};

const VERSION = "0.1.0";

// Default to local RIC if env not set
const RIC_URL = process.env.RIC_URL || "http://localhost:8787";

// ------------------------
// Local deterministic claim gate
// ------------------------

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function hash256(payload: string): string {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function gateClaim(claim: Claim): { decision: "PASS" | "HALT"; reason: string | null } {
  const start = new Date(claim.policy_effective_date);
  const loss = new Date(claim.loss_date);
  const report = new Date(claim.report_date);
  const windowDays = claim.coverage_window_days;

  if (loss.getTime() < start.getTime()) {
    return {
      decision: "HALT",
      reason: "Loss date is before policy effective date.",
    };
  }

  const daysFromStartToLoss = daysBetween(start, loss);
  if (daysFromStartToLoss > windowDays) {
    return {
      decision: "HALT",
      reason: `Loss ${daysFromStartToLoss} days after policy start exceeds coverage window of ${windowDays} days.`,
    };
  }

  const daysLossToReport = daysBetween(loss, report);
  if (daysLossToReport > windowDays) {
    return {
      decision: "HALT",
      reason: `Report ${daysLossToReport} days after loss exceeds coverage window of ${windowDays} days.`,
    };
  }

  return { decision: "PASS", reason: null };
}

// ------------------------
// RIC v2 substrate call (/run only)
// ------------------------

async function runRic(payload: any): Promise<{ id: string; emitted: number }> {
  const res = await fetch(`${RIC_URL}/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`RIC /run HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  return { id: json.id, emitted: json.emitted ?? 0 };
}

// ------------------------
// Claude call (gated)
// ------------------------

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

// ------------------------
// Route handler
// ------------------------

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

    // 2) Real 256-bit hashes for proposal + prompt
    const proposalHash = hash256(JSON.stringify(claim));
    const promptHash = hash256(
      JSON.stringify({ claim, question, version: VERSION }),
    );

    // 3) Run RIC v2 substrate (no bundle call yet)
    const ricPayload = {
      windows: [{ id: "w1" }],
      symbols: [JSON.stringify({ claim, question })],
      primes: [7, 11],
    };

    const runResult = await runRic(ricPayload);
    const ricBundle = {
      id: runResult.id,
      emitted: runResult.emitted,
    };

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