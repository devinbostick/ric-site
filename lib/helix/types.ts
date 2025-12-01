// lib/helix/types.ts
// Canonical Helix types shared across KB, intent, and explain layers.

export type HelixFactCategory = string;

export type HelixFact = {
  id: string;
  category: HelixFactCategory;
  key: string;
  value: string;
  tags?: string[];
};

export type HelixMetric = {
  id: string;
  key: string;
  value: number | string;
  unit?: string;
  window?: string;
  tags?: string[];
};

export type HelixIncident = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  summary: string;
  cause: string;
  resolved: boolean;
  dateIso: string;
  impactedNodes: number;
};

export type HelixIntent =
  | "ask_business_overview"
  | "ask_strategy"
  | "ask_system_state"
  | "ask_incident_cause"
  | "ask_fleet_status"
  | "ask_customer_prediction"
  | (string & {});

export type HelixWorldContext = {
  intent: HelixIntent;
  worldSummary: string;
  evidenceFacts: HelixFact[];
  promptText: string;
};
