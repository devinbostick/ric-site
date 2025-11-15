// app/api/demo-run/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

type DemoRequestBody = {
  claim: any;
  question: string;
};

type DemoDecision = {
  decision: "PASS" | "HALT";
  reason: string | null;
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

// ------------------------
// Deterministic gating
// ------------------------
function evaluateClaim(claim: any): DemoDecision {
  const effective = claim?.policy_effective_date;
  const windowDays = claim?.coverage_window_days;
  const lossDate = claim?.loss_date;
  const reportDate = claim?.report_date;

  if (!effective || !windowDays || !lossDate || !reportDate) {
    return {
      decision: "HALT",
      reason:
        "Missing expected fields for demo (policy_effective_date, coverage_window_days, loss_date, report_date).",
    };
  }

  const coverageWindow = Number(windowDays);
  const eff = new Date(effective);
  const loss = new Date(lossDate);
  const report = new Date(reportDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysFromEffectiveToLoss = (loss.getTime() - eff.getTime()) / msPerDay;
  const daysFromLossToReport = (report.getTime() - loss.getTime()) / msPerDay;

  if (Number.isNaN(coverageWindow)) {
    return {
      decision: "HALT",
      reason: "coverage_window_days must be numeric.",
    };
  }

  if (loss < eff) {
    return {
      decision: "HALT",
      reason: "Loss date is before policy effective date.",
    };
  }

  if (daysFromEffectiveToLoss > coverageWindow) {
    return {
      decision: "HALT",
      reason: `Loss ${Math.round(
        daysFromEffectiveToLoss,
      )} days after policy start exceeds coverage window of ${coverageWindow} days.`,
    };
  }

  if (daysFromLossToReport < 0) {
    return {
      decision: "HALT",
      reason: "Report date is before loss date.",
    };
  }

  if (daysFromLossToReport > coverageWindow) {
    return {
      decision: "HALT",
      reason: `Report ${Math.round(
        daysFromLossToReport,
      )} days after loss exceeds coverage window of ${coverageWindow} days.`,
    };
  }

  return {
    decision: "PASS",
    reason: null,
  };
}

// ------------------------
// Claude client for gated path
// ------------------------
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropicModel =
  process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";

const anthropic =
  anthropicApiKey != null
    ? new Anthropic({ apiKey: anthropicApiKey })
    : null;

async function runClaudeGated(claim: any, question: string): Promise<string> {
  if (!anthropic) {
    return (
      "ANTHROPIC_API_KEY is not set in the environment. " +
      "This is a demo fallback text.\n\n" +
      `Claim: ${JSON.stringify(claim, null, 2)}\nQuestion: ${question}`
    );
  }

  const msg = await anthropic.messages.create({
    model: anthropicModel,
    max_tokens: 512,
    temperature: 0,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "You are an insurance coverage analyst. " +
              "This call ONLY happens because the deterministic substrate passed the claim.\n\n" +
              "Claim JSON:\n" +
              JSON.stringify(claim, null, 2) +
              "\n\nQuestion:\n" +
              question +
              "\n\nExplain your reasoning and then give a clear YES/NO at the top.",
          },
        ],
      },
    ],
  });

  const textParts = msg.content
    .filter((c) => c.type === "text")
    .map((c: any) => c.text);

  return textParts.join("\n\n");
}

// ------------------------
// POST /api/demo-run
// ------------------------
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as DemoRequestBody;
    const { claim, question } = body;

    const { decision, reason } = evaluateClaim(claim);

    const baseResponse: DemoResponse = {
      decision,
      reason,
      proposalHash: "demo-proposal-hash",
      promptHash: "demo-prompt-hash",
      version: "0.1.0",
      ricBundle: {
        primes: [7, 11],
        windows: [{ id: "demo-window" }],
      },
    };

    // HALT → substrate only, no model call
    if (decision === "HALT") {
      return NextResponse.json(baseResponse);
    }

    // PASS → substrate + gated Claude
    const text = await runClaudeGated(claim, question);
    baseResponse.claude = { text };

    return NextResponse.json(baseResponse);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          message: err?.message ?? String(err),
        },
      },
      { status: 500 },
    );
  }
}