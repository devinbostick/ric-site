// lib/helix/intent/queryHelixKB.ts

import type { HelixIntent, HelixFact } from "../types";
import {
  helixFacts,
  helixMetrics,
  helixIncidents,
} from "../kb";

/**
 * Small deterministic view over the canonical Helix KB so the Helix mind
 * always runs against lib/helix/kb.ts and friends.
 */

/**
 * Lift metrics into HelixFact view so the explainer can see category "metrics".
 */
const METRIC_FACTS: HelixFact[] = helixMetrics.map((m) => {
  const parts: string[] = [String(m.value)];
  if (m.unit) parts.push(m.unit);
  if (m.window) parts.push(`(${m.window})`);

  return {
    id: m.id,
    category: "metrics",
    key: m.key,
    value: parts.join(" "),
    tags: m.tags,
  };
});

/**
 * Lift incidents into HelixFact view as category "incidents".
 */
const INCIDENT_FACTS: HelixFact[] = helixIncidents.map((inc) => ({
  id: inc.id,
  category: "incidents",
  key: inc.title,
  value: inc.summary,
  tags: ["incident"],
}));

/**
 * Unified KB view for intent selection.
 * Canonical atoms still live only in lib/helix/kb.ts.
 */
const KB_FACTS: HelixFact[] = [
  ...helixFacts,
  ...METRIC_FACTS,
  ...INCIDENT_FACTS,
];

export type HelixContextSlice = {
  intent: HelixIntent;
  primaryFacts: HelixFact[];
  supportingFacts: HelixFact[];
};

function byCategory(cat: string): HelixFact[] {
  return KB_FACTS.filter((f) => f.category === cat);
}

function take(xs: HelixFact[], n: number): HelixFact[] {
  return xs.slice(0, n);
}

/**
 * Deterministic selector from unified KB based on intent.
 */
export function queryHelixKBForIntent(
  intent: HelixIntent,
): HelixContextSlice {
  switch (intent) {
    case "ask_strategy":
      return {
        intent,
        primaryFacts: [
          ...take(byCategory("business"), 4),
          ...take(byCategory("product"), 3),
        ],
        supportingFacts: [
          ...take(byCategory("metrics"), 3),
          ...take(byCategory("risk"), 3),
          ...take(byCategory("policy"), 3),
          ...take(byCategory("incidents"), 2),
        ],
      };

    case "ask_system_state":
      return {
        intent,
        primaryFacts: [
          ...take(byCategory("metrics"), 4),
          ...take(byCategory("fleet"), 3),
          ...take(byCategory("incidents"), 3),
        ],
        supportingFacts: [
          ...take(byCategory("business"), 3),
          ...take(byCategory("product"), 3),
        ],
      };

    case "ask_incident_cause":
      return {
        intent,
        primaryFacts: [
          ...take(byCategory("incidents"), 4),
        ],
        supportingFacts: [
          ...take(byCategory("metrics"), 3),
          ...take(byCategory("fleet"), 3),
          ...take(byCategory("risk"), 3),
        ],
      };

    case "ask_fleet_status":
      return {
        intent,
        primaryFacts: [
          ...take(byCategory("fleet"), 4),
        ],
        supportingFacts: [
          ...take(byCategory("metrics"), 3),
          ...take(byCategory("business"), 3),
          ...take(byCategory("product"), 3),
        ],
      };

    case "ask_customer_prediction":
      return {
        intent,
        primaryFacts: [
          ...take(byCategory("customer"), 4),
        ],
        supportingFacts: [
          ...take(byCategory("metrics"), 3),
          ...take(byCategory("business"), 3),
          ...take(byCategory("product"), 2),
        ],
      };

    case "ask_business_overview":
    default:
      return {
        intent,
        primaryFacts: [
          ...take(byCategory("business"), 4),
          ...take(byCategory("product"), 3),
        ],
        supportingFacts: [
          ...take(byCategory("metrics"), 3),
          ...take(byCategory("fleet"), 3),
          ...take(byCategory("customer"), 3),
          ...take(byCategory("risk"), 2),
        ],
      };
  }
}
