// app/api/demo-raw-claude/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
const anthropicModel =
  process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";

const anthropic =
  anthropicApiKey != null
    ? new Anthropic({ apiKey: anthropicApiKey })
    : null;

async function runClaudeRaw(claim: any, question: string): Promise<string> {
  if (!anthropic) {
    return (
      "ANTHROPIC_API_KEY is not set in the environment. " +
      "This is a demo fallback text.\n\n" +
      `Claim: ${JSON.stringify(claim)}\nQuestion: ${question}`
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
              "Given the JSON claim data and the question, answer clearly and step-by-step.\n\n" +
              "Claim JSON:\n" +
              JSON.stringify(claim, null, 2) +
              "\n\nQuestion:\n" +
              question,
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

type RawReqBody = {
  claim: any;
  question: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RawReqBody;
    const { claim, question } = body;

    const text = await runClaudeRaw(claim, question);
    return NextResponse.json({ text });
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