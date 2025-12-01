// lib/helix/explain/explainWorld.ts

import type { HelixFact } from "../types";

export type WorldExplanation = {
  worldSummary: string;
  worldBullets: string[];
};

/**
 * Deterministic, template-based world summary from facts only.
 */
export function explainWorldFromFacts(
  evidenceFacts: HelixFact[],
  fallbackSummary: string,
): WorldExplanation {
  const byCategory = (cat: string) =>
    evidenceFacts.filter((f) => f.category === cat);

  const business = byCategory("business");
  const product = byCategory("product");
  const fleet = byCategory("deployments");
  const metrics = byCategory("metrics");
  const incidents = byCategory("incidents");

  const parts: string[] = [];

  if (business.length > 0) {
    parts.push(
      `Helix operates with a business model described by ${business.length} core facts.`,
    );
  }

  if (product.length > 0) {
    parts.push(
      `The product stack is captured in ${product.length} product facts.`,
    );
  }

  if (fleet.length > 0) {
    parts.push(
      `Fleet and deployment status is tracked across ${fleet.length} deployment entries.`,
    );
  }

  if (metrics.length > 0) {
    parts.push(`Key reliability metrics are defined in ${metrics.length} rows.`);
  }

  if (incidents.length > 0) {
    parts.push(
      `Recent operational risk is represented by ${incidents.length} incident records.`,
    );
  }

  const worldSummary =
    parts.length > 0
      ? parts.join(" ")
      : fallbackSummary ||
        "Helix world state is defined by a fixed set of business, product, fleet, metric, and incident facts.";

  const worldBullets: string[] = [];

  const sample = (xs: HelixFact[], n: number) => xs.slice(0, n);

  sample(business, 3).forEach((f) =>
    worldBullets.push(
      `business.${f.key} = ${f.value} (id=${f.id})`,
    ),
  );
  sample(product, 3).forEach((f) =>
    worldBullets.push(
      `product.${f.key} = ${f.value} (id=${f.id})`,
    ),
  );
  sample(fleet, 3).forEach((f) =>
    worldBullets.push(
      `deployments.${f.key} = ${f.value} (id=${f.id})`,
    ),
  );
  sample(metrics, 3).forEach((f) =>
    worldBullets.push(
      `metrics.${f.key} = ${f.value} (id=${f.id})`,
    ),
  );
  sample(incidents, 3).forEach((f) =>
    worldBullets.push(
      `incidents.${f.key} = ${f.value} (id=${f.id})`,
    ),
  );

  return { worldSummary, worldBullets };
}
