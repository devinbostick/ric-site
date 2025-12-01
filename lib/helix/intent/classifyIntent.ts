// lib/helix/intent/classifyIntent.ts

import type { HelixIntent } from "../types";

/**
 * Deterministic intent classification.
 * Pure string rules, no randomness, no external calls.
 */
export function classifyIntent(message: string): HelixIntent {
  const m = message.toLowerCase();

  const has = (...words: string[]): boolean =>
    words.some((w) => m.includes(w));

  if (has("strategy", "moat", "growth", "roadmap", "plan")) {
    return "ask_strategy";
  }

  if (has("system state", "health", "status", "overall state")) {
    return "ask_system_state";
  }

  if (has("incident", "outage", "failure", "postmortem", "root cause")) {
    return "ask_incident_cause";
  }

  if (has("fleet", "deployments", "nodes", "installations", "sites")) {
    return "ask_fleet_status";
  }

  if (has("customer", "churn", "retention", "segment", "adoption")) {
    return "ask_customer_prediction";
  }

  if (has("overview", "what is helix", "tell me about helix")) {
    return "ask_business_overview";
  }

  // Default safely to business overview.
  return "ask_business_overview";
}
