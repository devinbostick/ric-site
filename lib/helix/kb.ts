// lib/helix/kb.ts
//
// Deterministic Helix knowledge base.
// This is the "world" the AGI reasons over: no hallucination, no stochastic fetches.

import type {
  HelixFactCategory,
  HelixFact,
  HelixMetric,
  HelixIncident,
} from "./types";

// Core business / product facts.
// Extend this file toward ~10k rows over time; the schema is stable.
export const helixFacts: HelixFact[] = [
  {
    id: "business-model-core",
    category: "business",
    key: "businessModel",
    value: "Usage-based monitoring and automation for industrial IoT fleets.",
    tags: ["overview", "core"],
  },
  {
    id: "business-segments-core",
    category: "business",
    key: "customerSegments",
    value: "Mid-market logistics, cold-chain, and light industrial manufacturing.",
    tags: ["segments"],
  },
  {
    id: "product-architecture-core",
    category: "product",
    key: "architecture",
    value:
      "Multi-tenant edge + cloud platform: nodes with on-device agents, regional collectors, and a central control plane.",
    tags: ["architecture"],
  },
  {
    id: "product-sensors-core",
    category: "product",
    key: "sensorTypes",
    value:
      "Temperature, vibration, humidity, current draw, door open/close, and GPS.",
    tags: ["sensors"],
  },
  {
    id: "fleet-size-core",
    category: "fleet",
    key: "nodeCount",
    value: "1032",
    tags: ["size"],
  },
  {
    id: "fleet-regions-core",
    category: "fleet",
    key: "regions",
    value: "US-East, US-West, EU-Central, and APAC.",
    tags: ["regions"],
  },
  {
    id: "policy-sla-core",
    category: "policy",
    key: "slaUptime",
    value: "99.95% monthly uptime for the control plane.",
    tags: ["sla"],
  },
  {
    id: "policy-alerting-core",
    category: "policy",
    key: "alertPolicy",
    value:
      "Critical events must be acknowledged within 5 minutes and mitigated within 30 minutes during business hours.",
    tags: ["alerts"],
  },
  {
    id: "risk-single-region",
    category: "risk",
    key: "singleRegionRisk",
    value:
      "Single-region concentration risk in US-East for largest logistics tenant.",
    tags: ["risk", "concentration"],
  },
  {
    id: "customer-logos-core",
    category: "customer",
    key: "anchorCustomers",
    value:
      "Three anchor customers: a national cold-chain operator, a regional logistics network, and a medical supply distributor.",
    tags: ["customers"],
  },
];

// Core metrics. All numbers are deterministic constants here.
export const helixMetrics: HelixMetric[] = [
  {
    id: "metric-error-rate-24h",
    key: "errorRate24h",
    value: 0.13,
    unit: "percent",
    window: "last_24h",
    tags: ["reliability"],
  },
  {
    id: "metric-deploy-frequency-30d",
    key: "deployFrequency30d",
    value: 12,
    unit: "deployments",
    window: "last_30d",
    tags: ["velocity"],
  },
  {
    id: "metric-latency-p50",
    key: "p50ControlPlaneLatencyMs",
    value: 110,
    unit: "ms",
    window: "last_24h",
    tags: ["latency"],
  },
  {
    id: "metric-latency-p99",
    key: "p99ControlPlaneLatencyMs",
    value: 420,
    unit: "ms",
    window: "last_24h",
    tags: ["latency"],
  },
  {
    id: "metric-incidents-90d",
    key: "incidents90d",
    value: 4,
    unit: "incidents",
    window: "last_90d",
    tags: ["stability"],
  },
  {
    id: "metric-expansion-opportunities",
    key: "expansionOpportunities",
    value: 7,
    unit: "accounts",
    window: "pipeline",
    tags: ["growth"],
  },
];

// Canonical recent incidents. All text is deterministic.
export const helixIncidents: HelixIncident[] = [
  {
    id: "incident-freezer-drift-eu-01",
    title: "Temperature drift in EU cold-storage cluster",
    severity: "medium",
    summary:
      "Several freezers in EU-Central drifted 2–3°C above target range for ~15 minutes.",
    cause: "Misconfigured PID parameters after firmware update.",
    resolved: true,
    dateIso: "2025-11-12T03:20:00.000Z",
    impactedNodes: 18,
  },
  {
    id: "incident-gateway-outage-useast-01",
    title: "Gateway outage in US-East logistics hub",
    severity: "high",
    summary:
      "Regional gateway lost connectivity for 7 minutes, delaying telemetry and alerts.",
    cause: "Cloud network routing change interacting poorly with VPN configuration.",
    resolved: true,
    dateIso: "2025-10-28T14:05:00.000Z",
    impactedNodes: 220,
  },
  {
    id: "incident-alert-fatigue-risk-01",
    title: "Alert fatigue in operations team",
    severity: "low",
    summary:
      "Operators received an elevated volume of non-critical alerts, increasing the risk of misses on true critical events.",
    cause: "Overly sensitive default alert thresholds for a new tenant.",
    resolved: false,
    dateIso: "2025-11-01T09:45:00.000Z",
    impactedNodes: 64,
  },
];
