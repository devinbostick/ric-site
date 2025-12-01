#!/usr/bin/env bash
set -euo pipefail

echo "Scaffolding Phase 2B Helix mind layer…"

mkdir -p lib/helix/kb lib/helix/intent lib/helix/explain app/agi app/api/helix-chat

create_file() {
  local path="$1"
  shift
  if [ -f "$path" ]; then
    echo "SKIP  $path (already exists)"
  else
    echo "CREATE $path"
    cat > "$path" <<'TS'
$CONTENT
TS
  fi
}

# Helper to inject file content without duplicating here-doc logic
write_types() {
cat <<'TS'
// lib/helix/types.ts

export type HelixIntent =
  | "ask_business_overview"
  | "ask_strategy"
  | "ask_system_state"
  | "ask_incident_cause"
  | "ask_fleet_status"
  | "ask_customer_prediction"
  | "unknown";

export type HelixFact = {
  id: string;
  category: string;
  key: string;
  value: string;
  tags?: string[];
};

export type HelixWorld = {
  intent: HelixIntent;
  question: string;
  facts: HelixFact[];
};

export type HelixAnswer = {
  answer: string;
  bullets: string[];
  evidenceFacts: HelixFact[];
};
TS
}

write_kb_business() {
cat <<'TS'
// lib/helix/kb/business.ts
import type { HelixFact } from "../types";

export const helixBusinessFacts: HelixFact[] = [
  {
    id: "biz-001",
    category: "business",
    key: "mission",
    value: "Helix provides deterministic monitoring and control for industrial IoT fleets.",
    tags: ["overview", "mission"],
  },
  {
    id: "biz-002",
    category: "business",
    key: "primary_customers",
    value: "Mid-market and enterprise operators of physical infrastructure with >500 sensors.",
    tags: ["customers", "segments"],
  },
  {
    id: "biz-003",
    category: "business",
    key: "revenue_model",
    value: "Annual SaaS with usage-based overages based on active nodes and alerts.",
    tags: ["pricing", "model"],
  },
];
TS
}

write_kb_product() {
cat <<'TS'
// lib/helix/kb/product.ts
import type { HelixFact } from "../types";

export const helixProductFacts: HelixFact[] = [
  {
    id: "prod-001",
    category: "product",
    key: "core_modules",
    value: "Ingestion, time-series store, anomaly detection, alert routing, and control loops.",
    tags: ["architecture"],
  },
  {
    id: "prod-002",
    category: "product",
    key: "deployment_model",
    value: "Single-tenant VPC with managed control plane and on-prem edge collectors.",
    tags: ["deployment"],
  },
  {
    id: "prod-003",
    category: "product",
    key: "sla_uptime",
    value: "99.9% control-plane uptime SLA with explicit windows for maintenance.",
    tags: ["sla"],
  },
];
TS
}

write_kb_customers() {
cat <<'TS'
// lib/helix/kb/customers.ts
import type { HelixFact } from "../types";

export const helixCustomerFacts: HelixFact[] = [
  {
    id: "cust-001",
    category: "customers",
    key: "ideal_profile",
    value: "Operators with 1,000–100,000 sensors, 24/7 operations, and regulated environments.",
    tags: ["segments"],
  },
  {
    id: "cust-002",
    category: "customers",
    key: "key_value_prop",
    value: "Reduce unplanned downtime and false alarms while making all changes auditable.",
    tags: ["value"],
  },
];
TS
}

write_kb_sensors() {
cat <<'TS'
// lib/helix/kb/sensors.ts
import type { HelixFact } from "../types";

export const helixSensorFacts: HelixFact[] = [
  {
    id: "sensor-001",
    category: "sensors",
    key: "fleet_size_order",
    value: "Helix commonly manages fleets between 1,000 and 20,000 active sensors per tenant.",
    tags: ["scale"],
  },
  {
    id: "sensor-002",
    category: "sensors",
    key: "supported_protocols",
    value: "MQTT, OPC-UA, Modbus/TCP, HTTP push, and custom TCP collectors.",
    tags: ["protocols"],
  },
];
TS
}

write_kb_deployments() {
cat <<'TS'
// lib/helix/kb/deployments.ts
import type { HelixFact } from "../types";

export const helixDeploymentFacts: HelixFact[] = [
  {
    id: "deploy-001",
    category: "deployments",
    key: "default_rollout_strategy",
    value: "Canary rollout by region and sensor type, with automatic rollback on regression.",
    tags: ["rollout"],
  },
  {
    id: "deploy-002",
    category: "deployments",
    key: "last_known_version",
    value: "Control-plane version 4.3.7 with deterministic config diffs and replay logs.",
    tags: ["version"],
  },
];
TS
}

write_kb_incidents() {
cat <<'TS'
// lib/helix/kb/incidents.ts
import type { HelixFact } from "../types";

export const helixIncidentFacts: HelixFact[] = [
  {
    id: "incident-001",
    category: "incidents",
    key: "major_incident_pattern",
    value: "Most critical incidents have historically been caused by configuration drift.",
    tags: ["risk", "drift"],
  },
  {
    id: "incident-002",
    category: "incidents",
    key: "learning",
    value: "All changes now require deterministic change plans with full replayability.",
    tags: ["policy"],
  },
];
TS
}

write_kb_metrics() {
cat <<'TS'
// lib/helix/kb/metrics.ts
import type { HelixFact } from "../types";

export const helixMetricFacts: HelixFact[] = [
  {
    id: "metric-001",
    category: "metrics",
    key: "target_alert_rate",
    value: "Target alert rate is 0.1–0.3% of events per day per tenant.",
    tags: ["metrics", "alerts"],
  },
  {
    id: "metric-002",
    category: "metrics",
    key: "mttr_goal",
    value: "Mean time to resolution (MTTR) target is under 30 minutes for P1 incidents.",
    tags: ["metrics", "mttr"],
  },
];
TS
}

write_kb_index() {
cat <<'TS'
// lib/helix/kb/index.ts
import type { HelixFact } from "../types";
import { helixBusinessFacts } from "./business";
import { helixProductFacts } from "./product";
import { helixCustomerFacts } from "./customers";
import { helixSensorFacts } from "./sensors";
import { helixDeploymentFacts } from "./deployments";
import { helixIncidentFacts } from "./incidents";
import { helixMetricFacts } from "./metrics";

export const allHelixFacts: HelixFact[] = [
  ...helixBusinessFacts,
  ...helixProductFacts,
  ...helixCustomerFacts,
  ...helixSensorFacts,
  ...helixDeploymentFacts,
  ...helixIncidentFacts,
  ...helixMetricFacts,
];
TS
}

write_intent_classify() {
cat <<'TS'
// lib/helix/intent/classifyIntent.ts
import type { HelixIntent } from "../types";

const intentPatterns: { intent: HelixIntent; keywords: string[] }[] = [
  { intent: "ask_business_overview", keywords: ["what is helix", "tell me about helix", "overview", "business"] },
  { intent: "ask_strategy", keywords: ["strategy", "roadmap", "plan", "positioning"] },
  { intent: "ask_system_state", keywords: ["system state", "current state", "how are things", "health"] },
  { intent: "ask_incident_cause", keywords: ["incident", "outage", "root cause", "postmortem"] },
  { intent: "ask_fleet_status", keywords: ["sensors", "nodes", "fleet", "deployment", "version"] },
  { intent: "ask_customer_prediction", keywords: ["customer", "churn", "expansion", "pipeline"] },
];

export function classifyHelixIntent(message: string): HelixIntent {
  const text = message.toLowerCase();
  for (const pattern of intentPatterns) {
    for (const kw of pattern.keywords) {
      if (text.includes(kw)) {
        return pattern.intent;
      }
    }
  }
  return "unknown";
}
TS
}

write_intent_query() {
cat <<'TS'
// lib/helix/intent/queryHelixKB.ts
import type { HelixFact, HelixIntent } from "../types";
import { allHelixFacts } from "../kb";

export function queryHelixFactsForIntent(intent: HelixIntent): HelixFact[] {
  switch (intent) {
    case "ask_business_overview":
      return allHelixFacts.filter((f) =>
        ["business", "customers", "product"].includes(f.category)
      );
    case "ask_strategy":
      return allHelixFacts.filter((f) =>
        ["business", "product", "incidents"].includes(f.category)
      );
    case "ask_system_state":
      return allHelixFacts.filter((f) =>
        ["metrics", "deployments", "sensors"].includes(f.category)
      );
    case "ask_incident_cause":
      return allHelixFacts.filter((f) =>
        ["incidents", "metrics"].includes(f.category)
      );
    case "ask_fleet_status":
      return allHelixFacts.filter((f) =>
        ["sensors", "deployments", "metrics"].includes(f.category)
      );
    case "ask_customer_prediction":
      return allHelixFacts.filter((f) =>
        ["customers", "business"].includes(f.category)
      );
    case "unknown":
    default:
      return allHelixFacts.slice(0, 12);
  }
}
TS
}

write_intent_world() {
cat <<'TS'
// lib/helix/intent/buildWorldFromIntent.ts
import type { HelixWorld } from "../types";
import { classifyHelixIntent } from "./classifyIntent";
import { queryHelixFactsForIntent } from "./queryHelixKB";

export function buildHelixWorldFromMessage(message: string): HelixWorld {
  const intent = classifyHelixIntent(message);
  const facts = queryHelixFactsForIntent(intent);
  return {
    intent,
    question: message,
    facts,
  };
}
TS
}

write_explain_helix() {
cat <<'TS'
// lib/helix/explain/explainHelix.ts
import type { HelixWorld, HelixAnswer } from "../types";

export function buildHelixAnswerFromWorld(world: HelixWorld): HelixAnswer {
  const { intent, question, facts } = world;

  const topFacts = facts.slice(0, 6);
  const bullets = topFacts.map((f) => `• ${f.key}: ${f.value}`);

  let headline: string;

  switch (intent) {
    case "ask_business_overview":
      headline =
        "Helix is a deterministic monitoring and control platform for industrial IoT fleets.";
      break;
    case "ask_strategy":
      headline =
        "Helix’s strategy is to own deterministic reliability for sensor fleets at meaningful scale.";
      break;
    case "ask_system_state":
      headline =
        "Helix’s system state is defined by fleet size, deployment version, and reliability metrics.";
      break;
    case "ask_incident_cause":
      headline =
        "Most serious incidents for Helix have historically come from configuration drift.";
      break;
    case "ask_fleet_status":
      headline =
        "Helix routinely manages thousands of sensors with explicit versioning and rollout control.";
      break;
    case "ask_customer_prediction":
      headline =
        "Customer outcomes for Helix are driven by reduced downtime and clean audit trails.";
      break;
    case "unknown":
    default:
      headline =
        "Here is what the deterministic Helix knowledge base currently says.";
      break;
  }

  const answerLines = [
    headline,
    "",
    "Here is a deterministic summary based on Helix’s internal facts:",
  ];

  const answer = answerLines.join(" ");

  return {
    answer,
    bullets,
    evidenceFacts: topFacts,
  };
}

TS
}

write_explain_world() {
cat <<'TS'
// lib/helix/explain/explainWorld.ts
import type { HelixWorld } from "../types";

export function summarizeHelixWorld(world: HelixWorld): string {
  const categories = new Set(world.facts.map((f) => f.category));
  const categoryList = Array.from(categories).sort().join(", ") || "none";

  return [
    `Intent: ${world.intent}`,
    `Question: ${world.question}`,
    `Fact categories present: ${categoryList}`,
    `Fact count: ${world.facts.length}`,
  ].join(" | ");
}
TS
}

write_explain_bundle() {
cat <<'TS'
// lib/helix/explain/explainBundle.ts
// Placeholder: in Phase 2B we treat bundles as evidence.
// This module builds short human-readable blurbs from bundle metadata.

export type BundleSummaryInput = {
  bundleHash?: string | null;
  graphHash?: string | null;
  identityId?: string | null;
};

export type BundleSummary = {
  title: string;
  lines: string[];
};

export function summarizeBundle(meta: BundleSummaryInput): BundleSummary {
  const lines: string[] = [];

  if (meta.bundleHash) {
    lines.push(`bundleHash: ${meta.bundleHash}`);
  }
  if (meta.graphHash) {
    lines.push(`graphHash: ${meta.graphHash}`);
  }
  if (meta.identityId) {
    lines.push(`identity: ${meta.identityId}`);
  }

  if (lines.length === 0) {
    lines.push("No bundle metadata available yet.");
  }

  return {
    title: "Deterministic proof bundle",
    lines,
  };
}
TS
}

write_explain_index() {
cat <<'TS'
// lib/helix/explain/index.ts
export * from "./explainHelix";
export * from "./explainWorld";
export * from "./explainBundle";
TS
}

write_helix_index() {
cat <<'TS'
// lib/helix/index.ts
export * from "./types";
export * as kb from "./kb";
export * as intent from "./intent";
export * as explain from "./explain";
TS
}

write_intent_index() {
cat <<'TS'
// lib/helix/intent/index.ts
export * from "./classifyIntent";
export * from "./queryHelixKB";
export * from "./buildWorldFromIntent";
TS
}

write_api_helix_chat() {
cat <<'TS'
// app/api/helix-chat/route.ts
import { NextResponse } from "next/server";
import { buildHelixWorldFromMessage } from "../../../lib/helix/intent/buildWorldFromIntent";
import { buildHelixAnswerFromWorld } from "../../../lib/helix/explain/explainHelix";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body?.message ?? "").trim();

  if (!message) {
    return NextResponse.json(
      { ok: false, error: "message is required" },
      { status: 400 },
    );
  }

  // v1: deterministic KB-only response.
  // Later we can attach the RIC /agi/run result and bundle metadata here.
  const world = buildHelixWorldFromMessage(message);
  const answer = buildHelixAnswerFromWorld(world);

  return NextResponse.json(
    {
      ok: true,
      world,
      answer,
    },
    { status: 200 },
  );
}
TS
}

write_agi_helix_chat_tsx() {
cat <<'TS'
// app/agi/HelixChat.tsx
"use client";

import React, { useState } from "react";

type HelixChatMessage = {
  role: "user" | "system";
  text: string;
};

export default function HelixChat() {
  const [messages, setMessages] = useState<HelixChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: HelixChatMessage[] = [
      ...messages,
      { role: "user", text: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/helix-chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!res.ok) {
        const body = await res.text();
        setMessages([
          ...nextMessages,
          {
            role: "system",
            text: `Helix mind error: HTTP ${res.status} — ${body.slice(
              0,
              200,
            )}`,
          },
        ]);
        return;
      }

      const json = await res.json();
      const answerText =
        json?.answer?.answer ??
        "Helix mind responded, but no answer payload was found.";

      const bullets: string[] = json?.answer?.bullets ?? [];
      const bulletText =
        bullets.length > 0 ? "\n\n" + bullets.join("\n") : "";

      setMessages([
        ...nextMessages,
        { role: "system", text: answerText + bulletText },
      ]);
    } catch (err: any) {
      setMessages([
        ...nextMessages,
        {
          role: "system",
          text: `Helix mind error: ${err?.message ?? String(err)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-800 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Helix deterministic mind
          </p>
          <p className="text-xs text-neutral-700">
            Ask about Helix&apos;s business, strategy, fleet, or incidents. All
            answers are built from a deterministic knowledge base.
          </p>
        </div>
      </div>

      <div className="mb-3 flex-1 space-y-2 overflow-auto rounded-xl border border-neutral-100 bg-neutral-50 p-3 max-h-80">
        {messages.length === 0 && (
          <p className="text-[11px] text-neutral-500">
            Try: <span className="font-mono">"Tell me about Helix"</span> or{" "}
            <span className="font-mono">"What is Helix&apos;s strategy?"</span>
          </p>
        )}
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={
              "whitespace-pre-wrap rounded-lg px-2 py-1.5 " +
              (m.role === "user"
                ? "bg-neutral-900 text-[11px] font-medium text-white"
                : "bg-white text-[11px] text-neutral-800 border border-neutral-200")
            }
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Ask the Helix mind a question…"
          className="flex-1 rounded-full border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs text-neutral-800 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          className={
            "rounded-full px-3 py-2 text-xs font-semibold " +
            (loading || !input.trim()
              ? "bg-neutral-200 text-neutral-500"
              : "bg-neutral-900 text-white hover:bg-black")
          }
        >
          {loading ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}
TS
}

write_agi_page_patch_hint() {
cat <<'TS'
// NOTE: You already have app/agi/page.tsx.
// After scaffolding, you can import and render <HelixChat /> like:
//
// import HelixChat from "./HelixChat";
//
// …inside your main AGI section:
//
// <section className="mt-8">
//   <HelixChat />
// </section>
//
// This keeps page wiring explicit and non-destructive.
TS
}

# Now actually create files if missing
create_file "lib/helix/types.ts" <<<"$(write_types)"
create_file "lib/helix/kb/business.ts" <<<"$(write_kb_business)"
create_file "lib/helix/kb/product.ts" <<<"$(write_kb_product)"
create_file "lib/helix/kb/customers.ts" <<<"$(write_kb_customers)"
create_file "lib/helix/kb/sensors.ts" <<<"$(write_kb_sensors)"
create_file "lib/helix/kb/deployments.ts" <<<"$(write_kb_deployments)"
create_file "lib/helix/kb/incidents.ts" <<<"$(write_kb_incidents)"
create_file "lib/helix/kb/metrics.ts" <<<"$(write_kb_metrics)"
create_file "lib/helix/kb/index.ts" <<<"$(write_kb_index)"

create_file "lib/helix/intent/classifyIntent.ts" <<<"$(write_intent_classify)"
create_file "lib/helix/intent/queryHelixKB.ts" <<<"$(write_intent_query)"
create_file "lib/helix/intent/buildWorldFromIntent.ts" <<<"$(write_intent_world)"
create_file "lib/helix/intent/index.ts" <<<"$(write_intent_index)"

create_file "lib/helix/explain/explainHelix.ts" <<<"$(write_explain_helix)"
create_file "lib/helix/explain/explainWorld.ts" <<<"$(write_explain_world)"
create_file "lib/helix/explain/explainBundle.ts" <<<"$(write_explain_bundle)"
create_file "lib/helix/explain/index.ts" <<<"$(write_explain_index)"

create_file "lib/helix/index.ts" <<<"$(write_helix_index)"

create_file "app/api/helix-chat/route.ts" <<<"$(write_api_helix_chat)"
create_file "app/agi/HelixChat.tsx" <<<"$(write_agi_helix_chat_tsx)"

create_file "app/agi/HELIX_PATCH_HINT.txt" <<<"$(write_agi_page_patch_hint)"

echo "Done. Phase 2B Helix scaffold in place."
