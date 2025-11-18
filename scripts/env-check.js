#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// Load .env.local so env:check sees the same vars Next.js does
require("dotenv").config({ path: ".env.local" });

// Simple deterministic env checker for RIC-Site
const required = ["RIC_API_BASE", "MODEL_PROVIDER"];

const optional = [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_MODEL",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
];

console.log("=== RIC-Site Environment Check ===");

let ok = true;

for (const key of required) {
  if (!process.env[key]) {
    console.log(`✗ Missing required: ${key}`);
    ok = false;
  } else {
    console.log(`✓ ${key} = ${process.env[key]}`);
  }
}

for (const key of optional) {
  if (process.env[key]) {
    console.log(`• Optional set: ${key}`);
  }
}

process.exit(ok ? 0 : 1);