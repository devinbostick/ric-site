// lib/helix/intent/buildWorldFromIntent.ts

import type {
  HelixIntent,
  HelixFact,
  HelixWorldContext,
} from "../types";
import { classifyIntent } from "./classifyIntent";
import {
  queryHelixKBForIntent,
  type HelixContextSlice,
} from "./queryHelixKB";

/**
 * Build a deterministic world summary and prompt text
 * from the classified intent and KB slice.
 */

function summarizeWorld(slice: HelixContextSlice): string {
  const { intent, primaryFacts } = slice;

  const categories = Array.from(
    new Set(primaryFacts.map((f) => f.category)),
  ).join(", ");

  const base = categories
    ? `Helix world for this answer uses ${categories} facts from the deterministic knowledge base.`
    : "Helix world for this answer uses a minimal deterministic fact set.";

  const intentLabel = intent.replace(/^ask_/, "").replace(/_/g, " ");

  return `${base} This summary is for intent: ${intentLabel}.`;
}

function buildPromptText(
  message: string,
  slice: HelixContextSlice,
): string {
  const lines: string[] = [];

  lines.push(
    "You are a deterministic Helix agent. You must answer using only the provided facts.",
  );
  lines.push(`User message: "${message}".`);
  lines.push(`Interpreted intent: ${slice.intent}.`);
  lines.push("Facts:");

  slice.primaryFacts.forEach((f) => {
    lines.push(`- [primary] ${f.category}.${f.key} = ${f.value}`);
  });

  slice.supportingFacts.forEach((f) => {
    lines.push(`- [support] ${f.category}.${f.key} = ${f.value}`);
  });

  lines.push(
    "Explain clearly and concisely. Do not invent new entities; stay within these facts.",
  );

  return lines.join("\n");
}

/**
 * Public entry: message → { intent, worldSummary, evidenceFacts, promptText }.
 */
export function buildWorldFromIntent(
  message: string,
): HelixWorldContext {
  const classifiedIntent: HelixIntent = classifyIntent(message);
  const slice = queryHelixKBForIntent(classifiedIntent);

  const worldSummary = summarizeWorld(slice);
  const evidenceFacts: HelixFact[] = [
    ...slice.primaryFacts,
    ...slice.supportingFacts,
  ];

  const promptText = buildPromptText(message, slice);

  return {
    intent: slice.intent,
    worldSummary,
    evidenceFacts,
    promptText,
  };
}
