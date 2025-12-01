// lib/helix/explain/explainHelix.ts

import type { HelixFact, HelixIntent } from "../types";
import {
  summarizeBundleFromAgi,
  type PasSummary,
  type BundleSummary,
} from "./explainBundle";
import { explainWorldFromFacts } from "./explainWorld";

/* ────────────────────────────────────────────
 * Types
 * ────────────────────────────────────────────
 */

/**
 * AGI result wrapper used at the explanation boundary.
 * raw: the full /agi/run response (or equivalent).
 * Optional precomputed fields are allowed but recomputed inside.
 */
export type HelixAgiResult = {
  raw: any;
  pasSummary?: PasSummary;
  bundleSummary?: BundleSummary;
  bundleId?: string | null;
  agiError?: string | null;
};

/**
 * Input contract for explainHelixAnswer.
 */
export type ExplainHelixParams = {
  message: string;
  intent: HelixIntent;
  worldSummary: string;
  evidenceFacts: HelixFact[];
  agiResult: HelixAgiResult | null;
};

/**
 * Output contract for Helix explanation.
 * This is the UI-ready shape returned by /api/helix-chat.
 */
export type HelixAnswer = {
  answer: string;
  bullets: string[];
  evidenceFacts: HelixFact[];
  worldSummary: string;
  pasSummary: PasSummary;
  bundleSummary: BundleSummary;
  agiError: string | null;
  agi: { bundleHash?: string | null };
};

/* ────────────────────────────────────────────
 * Helpers
 * ────────────────────────────────────────────
 */

function pickFacts(
  facts: HelixFact[],
  category: string,
  max: number,
): HelixFact[] {
  return facts.filter((f) => f.category === category).slice(0, max);
}

function formatFactKV(f: HelixFact): string {
  return `${f.key}: ${f.value}`;
}

function formatFactValue(f: HelixFact): string {
  return f.value;
}

/**
 * Intent-specific English answer + bullet list from facts + world summary.
 */
function buildIntentAnswer(
  params: {
    intent: HelixIntent;
    message: string;
    worldSummary: string;
    evidenceFacts: HelixFact[];
    pasSummary: PasSummary;
    bundleSummary: BundleSummary;
  },
): { answer: string; bullets: string[] } {
  const { intent, message, worldSummary, evidenceFacts, pasSummary, bundleSummary } =
    params;

  const business = pickFacts(evidenceFacts, "business", 4);
  const product = pickFacts(evidenceFacts, "product", 4);
  const metrics = pickFacts(evidenceFacts, "metrics", 4);
  const incidents = pickFacts(evidenceFacts, "incidents", 3);
  const fleet = pickFacts(evidenceFacts, "fleet", 3);
  const customers = pickFacts(evidenceFacts, "customer", 3);

  const businessValues = business.map(formatFactValue);
  const metricPairs = metrics.map(formatFactKV);
  const productValues = product.map(formatFactValue);

  const bullets: string[] = [];

  // PAS / drift / bundle bullets if available
  if (pasSummary && (pasSummary.current != null || pasSummary.delta != null)) {
    const current =
      pasSummary.current != null ? `PAS_h current=${pasSummary.current}` : "";
    const delta =
      pasSummary.delta != null ? `ΔPAS_zeta=${pasSummary.delta}` : "";
    const drift =
      pasSummary.driftStatus != null
        ? `drift verdict=${pasSummary.driftStatus}`
        : "";

    const parts = [current, delta, drift].filter(Boolean).join(" · ");
    if (parts) {
      bullets.push(`AGI legality summary: ${parts}.`);
    }
  }

  if (bundleSummary && bundleSummary.lines.length > 0) {
    bullets.push(
      `AGI proof bundle: ${bundleSummary.lines.join(" · ")}`,
    );
  }

  let answer: string;

  switch (intent) {
    case "ask_strategy": {
      const coreBusiness = businessValues.join(", ");
      const coreMetrics = metricPairs.join("; ");
      const incidentText = incidents.map(formatFactValue).join(" | ");

      const lines: string[] = [];
      lines.push(
        "Helix’s strategy is to grow a stable, high-reliability monitoring and automation network while keeping operational risk bounded by current constraints.",
      );
      if (coreBusiness) {
        lines.push(`Its core business frame is: ${coreBusiness}.`);
      }
      if (coreMetrics) {
        lines.push(`Current performance indicators are: ${coreMetrics}.`);
      }
      if (incidentText) {
        lines.push(
          `Recent incidents inform where to harden the system: ${incidentText}.`,
        );
      }
      lines.push(worldSummary);

      if (coreBusiness) {
        bullets.push(
          `Business shape: ${coreBusiness} (from business.* facts).`,
        );
      }
      if (coreMetrics) {
        bullets.push(`Key metrics: ${coreMetrics} (from metrics.* facts).`);
      }
      if (incidentText) {
        bullets.push(
          `Recent incidents: ${incidentText} (from incidents.* facts).`,
        );
      }

      bullets.push(
        `User question was: "${message}". Strategy is computed deterministically from the Helix KB; no external sources are used.`,
      );

      answer = lines.join(" ");
      break;
    }

    case "ask_system_state": {
      const coreMetrics = metricPairs.join("; ");
      const fleetValues = fleet.map(formatFactValue).join(" | ");
      const incidentText = incidents.map(formatFactValue).join(" | ");

      const lines: string[] = [];
      lines.push(
        "Helix’s system state is defined by its current fleet deployments, live reliability metrics, and any recent incidents.",
      );
      if (fleetValues) {
        lines.push(`Fleet perspective: ${fleetValues}.`);
      }
      if (coreMetrics) {
        lines.push(`Key live metrics: ${coreMetrics}.`);
      }
      if (incidentText) {
        lines.push(`Recent incidents: ${incidentText}.`);
      }
      lines.push(worldSummary);

      bullets.push(
        "System state is summarised using only fleet, metrics, and incident facts from the deterministic KB.",
      );
      if (fleetValues) {
        bullets.push(`Fleet slice: ${fleetValues}.`);
      }
      if (coreMetrics) {
        bullets.push(`Metrics slice: ${coreMetrics}.`);
      }
      if (incidentText) {
        bullets.push(`Incident slice: ${incidentText}.`);
      }
      bullets.push(
        `User question was: "${message}". The summary is a deterministic function of the stored facts.`,
      );

      answer = lines.join(" ");
      break;
    }

    case "ask_incident_cause": {
      const incidentText = incidents.map(formatFactValue).join(" | ");
      const coreMetrics = metricPairs.join("; ");

      const lines: string[] = [];
      lines.push(
        "Helix summarises incident causes based on stored incident records and supporting telemetry metrics.",
      );
      if (incidentText) {
        lines.push(`Recent incident records: ${incidentText}.`);
      }
      if (coreMetrics) {
        lines.push(`Supporting metrics: ${coreMetrics}.`);
      }
      lines.push(worldSummary);

      bullets.push(
        "Incident explanation uses only incidents.* facts plus any metrics.* rows selected as support.",
      );
      if (incidentText) {
        bullets.push(`Incidents slice: ${incidentText}.`);
      }
      if (coreMetrics) {
        bullets.push(`Metrics slice: ${coreMetrics}.`);
      }
      bullets.push(
        `User question was: "${message}". Root-cause text is derived purely from the deterministic KB.`,
      );

      answer = lines.join(" ");
      break;
    }

    case "ask_fleet_status": {
      const fleetValues = fleet.map(formatFactValue).join(" | ");
      const coreMetrics = metricPairs.join("; ");

      const lines: string[] = [];
      lines.push(
        "Helix’s fleet status reflects how many nodes are deployed, where they are, and how the control plane is performing.",
      );
      if (fleetValues) {
        lines.push(`Fleet deployment view: ${fleetValues}.`);
      }
      if (coreMetrics) {
        lines.push(`Supporting metrics: ${coreMetrics}.`);
      }
      lines.push(worldSummary);

      bullets.push(
        "Fleet status is drawn from fleet.* facts and any metrics.* chosen as context.",
      );
      if (fleetValues) {
        bullets.push(`Fleet slice: ${fleetValues}.`);
      }
      if (coreMetrics) {
        bullets.push(`Metrics slice: ${coreMetrics}.`);
      }
      bullets.push(
        `User question was: "${message}". Response is deterministic given the stored facts.`,
      );

      answer = lines.join(" ");
      break;
    }

    case "ask_customer_prediction": {
      const customerValues = customers.map(formatFactValue).join(" | ");
      const coreMetrics = metricPairs.join("; ");

      const lines: string[] = [];
      lines.push(
        "Helix’s customer outlook is derived from how different segments value reliability, deployment simplicity, and growth opportunities in the current pipeline.",
      );
      if (customerValues) {
        lines.push(`Customer segments: ${customerValues}.`);
      }
      if (coreMetrics) {
        lines.push(`Metrics context: ${coreMetrics}.`);
      }
      lines.push(worldSummary);

      bullets.push(
        "Customer prediction uses customers.* facts plus any metrics.* rows mapped as support.",
      );
      if (customerValues) {
        bullets.push(`Customer slice: ${customerValues}.`);
      }
      if (coreMetrics) {
        bullets.push(`Metrics slice: ${coreMetrics}.`);
      }
      bullets.push(
        `User question was: "${message}". Projection is a deterministic function of the KB, not a learned heuristic.`,
      );

      answer = lines.join(" ");
      break;
    }

    case "ask_business_overview":
    default: {
      const coreBusiness = businessValues.join(", ");
      const coreProduct = productValues.join(", ");
      const coreMetrics = metricPairs.join("; ");

      const lines: string[] = [];
      lines.push(
        "Helix is described here using only its deterministic business and product facts.",
      );
      if (coreBusiness) {
        lines.push(`Core model and segments: ${coreBusiness}.`);
      }
      if (coreProduct) {
        lines.push(`Product shape: ${coreProduct}.`);
      }
      if (coreMetrics) {
        lines.push(
          `Key metrics framing performance: ${coreMetrics}.`,
        );
      }
      lines.push(worldSummary);

      bullets.push(
        `World summary: ${worldSummary}`,
      );
      if (coreBusiness) {
        bullets.push(
          `Business slice: ${coreBusiness} (business.* facts).`,
        );
      }
      if (coreMetrics) {
        bullets.push(
          `Metric slice: ${coreMetrics} (metrics.* facts).`,
        );
      }
      bullets.push(
        `User question was: "${message}". Answer is computed from KB and AGI proof, not from open-world search.`,
      );

      answer = lines.join(" ");
      break;
    }
  }

  return { answer, bullets };
}

/* ────────────────────────────────────────────
 * Public entry
 * ────────────────────────────────────────────
 */

/**
 * Single deterministic map:
 *
 * (message, context, agiResult) →
 *   { answer, bullets, pasSummary, bundleSummary, agiError,
 *     agi.bundleHash, evidenceFacts, worldSummary }
 */
export function explainHelixAnswer(
  params: ExplainHelixParams,
): HelixAnswer {
  const { message, intent, worldSummary, evidenceFacts, agiResult } = params;

  // Final world summary always goes through explainWorldFromFacts
  const { worldSummary: finalWorldSummary } = explainWorldFromFacts(
    evidenceFacts,
    worldSummary,
  );

  // Normalize AGI result and derive legality summaries
  const raw = agiResult?.raw ?? agiResult ?? null;
  const {
    pasSummary,
    bundleSummary,
    bundleHash,
    agiError,
  } = summarizeBundleFromAgi(raw);

  // Intent-layer natural language
  const { answer, bullets } = buildIntentAnswer({
    intent,
    message,
    worldSummary: finalWorldSummary,
    evidenceFacts,
    pasSummary,
    bundleSummary,
  });

  return {
    answer,
    bullets,
    evidenceFacts,
    worldSummary: finalWorldSummary,
    pasSummary,
    bundleSummary,
    agiError,
    agi: {
      bundleHash: bundleHash ?? null,
    },
  };
}
