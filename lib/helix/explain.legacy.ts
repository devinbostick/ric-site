// lib/helix/explain.ts
//
// Deterministic explanation + prompt builder sitting on top of the Helix KB.

import type {
  HelixFact,
  HelixMetric,
  HelixIncident,
} from "./kb";
import type { HelixContext, HelixIntent } from "./intent";

export type AgiDecisionSummary = {
  bundleHash: string | null;
  chosenId: string | null;
  chosenLabel: string | null;
  pasCurrent: number | null;
  deltaPasZeta: number | null;
  driftStatus: "STABLE" | "DRIFTING" | "COLLAPSING" | "UNKNOWN";
  candidates: { id: string; label: string; pasScore: number }[];
};

export type HelixEvidence = {
  facts: HelixFact[];
  metrics: HelixMetric[];
  incidents: HelixIncident[];
  agi: AgiDecisionSummary;
};

export type HelixAnswer = {
  intent: HelixIntent;
  message: string;
  answer: string;
  explanationBullets: string[];
  pasSummary: string;
  driftSummary: string;
  alternativesSummary: string | null;
  evidence: HelixEvidence;
  // For debugging / inspection only
  promptText: string;
};

// Build the deterministic text passed into /agi/run.
// This is the "world" serialized into natural language plus the user question.
export function buildHelixPrompt(
  context: HelixContext,
  message: string,
): string {
  const lines: string[] = [];

  lines.push(
    "You are a deterministic Helix agent reasoning over fleet monitoring and IoT automation.",
  );
  lines.push("All facts and metrics are exact and must be treated as ground truth.");
  lines.push("");

  if (context.facts.length > 0) {
    lines.push("FACTS:");
    for (const f of context.facts) {
      lines.push(`- [${f.category}] ${f.key}: ${f.value}`);
    }
    lines.push("");
  }

  if (context.metrics.length > 0) {
    lines.push("METRICS:");
    for (const m of context.metrics) {
      const unit = m.unit ? ` ${m.unit}` : "";
      const window = m.window ? ` (${m.window})` : "";
      lines.push(`- ${m.key}: ${m.value}${unit}${window}`);
    }
    lines.push("");
  }

  if (context.incidents.length > 0) {
    lines.push("RECENT INCIDENTS:");
    for (const inc of context.incidents) {
      lines.push(
        `- [${inc.severity}] ${inc.title} on ${inc.dateIso}: ${inc.summary} (cause: ${inc.cause}, resolved=${inc.resolved})`,
      );
    }
    lines.push("");
  }

  lines.push("USER QUESTION:");
  lines.push(message.trim());

  return lines.join("\n");
}

// Extract the AGI legality + decision surfaces we care about for explanation.
export function summarizeAgiDecision(result: any): AgiDecisionSummary {
  const chosen = result?.chosen ?? null;
  const candidatesArray: any[] = Array.isArray(result?.candidates)
    ? result.candidates
    : [];

  const candidates = candidatesArray.map((c: any) => ({
    id: String(c?.candidate?.id ?? c?.id ?? ""),
    label: String(c?.candidate?.description ?? c?.candidate?.id ?? c?.id ?? ""),
    pasScore: typeof c?.pasScore === "number" ? c.pasScore : 0,
  }));

  let driftStatus: AgiDecisionSummary["driftStatus"] = "UNKNOWN";
  const drift = result?.legality?.identityDrift;
  if (drift && typeof drift === "object") {
    const verdict = String(drift.verdict ?? "").toLowerCase();
    if (verdict === "stable") driftStatus = "STABLE";
    else if (verdict === "drifting") driftStatus = "DRIFTING";
    else if (verdict === "collapsing") driftStatus = "COLLAPSING";
  }

  const pasCurrent =
    typeof result?.legality?.pas?.current === "number"
      ? result.legality.pas.current
      : null;

  const deltaPasZeta =
    typeof result?.legality?.pas?.deltaPasZeta === "number"
      ? result.legality.pas.deltaPasZeta
      : null;

  const chosenId =
    chosen && typeof chosen === "object"
      ? String(chosen.id ?? chosen.candidateId ?? "")
      : null;

  const chosenLabel =
    chosen && typeof chosen === "object"
      ? String(chosen.description ?? chosen.text ?? chosen.id ?? "")
      : null;

  const bundleHash =
    typeof result?.bundleHash === "string" ? result.bundleHash : null;

  return {
    bundleHash,
    chosenId,
    chosenLabel,
    pasCurrent,
    deltaPasZeta,
    driftStatus,
    candidates,
  };
}

// Human-level summary based on intent + context + AGI decision.
// This is deterministic templating, not stochastic generation.
export function buildHelixAnswer(args: {
  intent: HelixIntent;
  message: string;
  context: HelixContext;
  agiResult: any;
  promptText: string;
}): HelixAnswer {
  const { intent, message, context, agiResult, promptText } = args;
  const agiSummary = summarizeAgiDecision(agiResult);

  const explanationBullets: string[] = [];
  let answer = "";
  let alternativesSummary: string | null = null;

  const factsByKey = new Map<string, HelixFact>();
  for (const f of context.facts) factsByKey.set(f.key, f);

  const metricByKey = new Map<string, HelixMetric>();
  for (const m of context.metrics) metricByKey.set(m.key, m);

  const nodeCount = factsByKey.get("nodeCount");
  const errorRate = metricByKey.get("errorRate24h");
  const deployFreq = metricByKey.get("deployFrequency30d");

  switch (intent) {
    case "ask_business_overview": {
      answer =
        "Helix is a fleet monitoring and automation platform for industrial IoT. " +
        "It sells to logistics, cold-chain, and manufacturing customers, running a multi-tenant edge + cloud architecture over roughly " +
        (nodeCount ? nodeCount.value : "1,000") +
        " active nodes across US and international regions.";

      if (errorRate) {
        answer +=
          " Over the last 24 hours, the observed error rate is " +
          errorRate.value +
          "%, which is within the current reliability band.";
      }

      const segments = factsByKey.get("customerSegments");
      const sla = factsByKey.get("slaUptime");

      if (segments) {
        explanationBullets.push(
          `Customer segments: ${segments.value}.`,
        );
      }
      if (sla) {
        explanationBullets.push(`SLA: ${sla.value}.`);
      }
      if (nodeCount) {
        explanationBullets.push(
          `Fleet size: ${nodeCount.value} active nodes across all regions.`,
        );
      }
      if (deployFreq) {
        explanationBullets.push(
          `Deployment velocity: ${deployFreq.value} releases in the last 30 days.`,
        );
      }
      break;
    }

    case "ask_strategy": {
      const risk = context.facts.find(
        (f) => f.key === "singleRegionRisk",
      );
      const expansion = metricByKey.get("expansionOpportunities");

      answer =
        "Strategically, Helix should balance reliability hardening in existing fleets with targeted expansion into the highest-leverage customers. ";

      if (risk) {
        answer +=
          "The most important risk right now is " + risk.value + " ";
      }

      if (expansion) {
        answer +=
          "while there are " +
          expansion.value +
          " clear expansion opportunities in the current pipeline.";
      }

      explanationBullets.push(
        "Reduce single-region concentration risk by shifting new deployments toward underutilized regions.",
      );
      explanationBullets.push(
        "Use recent incident data to tighten alert policies and reduce operator fatigue.",
      );
      explanationBullets.push(
        "Focus expansion on customers whose fleets already generate strong, stable telemetry and low incident rates.",
      );
      break;
    }

    case "ask_system_state": {
      answer =
        "The Helix system is currently stable. The control plane latency, error rate, and recent incident volume are all within policy for the existing SLA.";

      if (errorRate) {
        explanationBullets.push(
          `Error rate: ${errorRate.value}% over the last 24 hours.`,
        );
      }
      if (deployFreq) {
        explanationBullets.push(
          `Release cadence: ${deployFreq.value} deployments in the last 30 days.`,
        );
      }
      explanationBullets.push(
        `Total incidents in the last 90 days: ${
          metricByKey.get("incidents90d")?.value ?? 0
        }.`,
      );
      if (context.incidents.length > 0) {
        explanationBullets.push(
          `Most recent incident: ${context.incidents[0].title} (${context.incidents[0].severity}).`,
        );
      }
      break;
    }

    case "ask_fleet_status": {
      answer =
        "The Helix fleet is healthy across its main regions, with localized risk around a few recent incidents and single-region concentration in US-East.";

      if (nodeCount) {
        explanationBullets.push(
          `Fleet size: ${nodeCount.value} nodes.`,
        );
      }
      const regions = context.facts.find((f) => f.key === "regions");
      if (regions) {
        explanationBullets.push(`Regions: ${regions.value}.`);
      }
      if (context.incidents.length > 0) {
        explanationBullets.push(
          `Recent high-severity incident: ${context.incidents.find((i) => i.severity === "high")?.title ?? "none currently open"}.`,
        );
      }
      break;
    }

    case "ask_incident_cause": {
      const latest = context.incidents[0];
      if (latest) {
        answer =
          "The most recent incident was \"" +
          latest.title +
          "\". The proximate cause was: " +
          latest.cause +
          ". It impacted " +
          latest.impactedNodes +
          " nodes and resolved=" +
          latest.resolved +
          ".";
        explanationBullets.push(
          `Incident summary: ${latest.summary}.`,
        );
        explanationBullets.push(
          `Cause: ${latest.cause}.`,
        );
        explanationBullets.push(
          `Impact: ${latest.impactedNodes} nodes affected.`,
        );
      } else {
        answer =
          "There are no recorded incidents in the current deterministic incident ledger.";
      }
      break;
    }

    case "ask_customer_prediction": {
      const expansion = metricByKey.get("expansionOpportunities");
      answer =
        "Based on the current customer mix and product footprint, the strongest near-term growth comes from deepening existing fleets where deployment and incident patterns are already stable.";

      if (expansion) {
        explanationBullets.push(
          `There are ${expansion.value} identified expansion opportunities in the current pipeline.`,
        );
      }
      explanationBullets.push(
        "Priority should go to accounts with low recent incident rates and strong ROI on automation.",
      );
      break;
    }

    default: {
      answer =
        "Helix is operating a deterministic IoT monitoring platform with a stable fleet and clear paths for strategic expansion.";
      explanationBullets.push(
        "Default path used: business overview.",
      );
      break;
    }
  }

  // PAS / drift narratives.
  const pasSummary =
    agiSummary.pasCurrent !== null
      ? `PAS_h for the chosen action is ${agiSummary.pasCurrent}. Higher is more aligned with the current policy and Helix objectives.`
      : "PAS_h for the chosen action is available in the proof bundle.";

  let driftSummary = "Drift verdict is unknown.";
  if (agiSummary.driftStatus === "STABLE") {
    driftSummary = "Identity drift verdict: STABLE. The agent is behaving consistently with prior runs.";
  } else if (agiSummary.driftStatus === "DRIFTING") {
    driftSummary =
      "Identity drift verdict: DRIFTING. The agent is moving away from its historical preference surface.";
  } else if (agiSummary.driftStatus === "COLLAPSING") {
    driftSummary =
      "Identity drift verdict: COLLAPSING. The agent would require intervention under current policy.";
  }

  if (agiSummary.candidates.length > 1) {
    const alt = agiSummary.candidates
      .slice(0, 3)
      .map((c) => `${c.id}=${c.pasScore}`)
      .join(", ");
    alternativesSummary = `Top candidates by PAS_h: ${alt}.`;
  }

  return {
    intent,
    message,
    answer,
    explanationBullets,
    pasSummary,
    driftSummary,
    alternativesSummary,
    evidence: {
      facts: context.facts,
      metrics: context.metrics,
      incidents: context.incidents,
      agi: agiSummary,
    },
    promptText,
  };
}