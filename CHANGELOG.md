# Changelog

All notable changes to this project will be documented here.

Format:
- Newest versions at top
- One section per tagged release

## v0.1.0-demo-docs — 2025-11-18
- Added full documentation stack.
- Added docs/ (stem.md, ric-api.md, legality.md, bundle-format.md).
- Updated README with production deployment details.
- Added CONTRIBUTING.md and DEV_SETUP.md.

---

## v0.1.0-demo — 2025-11-18

Initial public demo stack for Resonance Intelligence Core (RIC).

### Pages
- **Home page (`/`)**
  - Deterministic inference explanation
  - API access form (Formspree)
  - Link to main CODES theory paper
- **Legality demo (`/demo`)**
  - JSON claim + question inputs
  - RIC substrate gating: PASS / HALT
  - Deterministic replay (proposalHash / promptHash)
  - Bundle link shown for every run
  - Anthropic model call only occurs for PASS
- **Bundle viewer (`/bundle/[id]`)**
  - Proxies RIC `/bundle/:id`
  - Shows run id, graph node/edge counts, graphHash, bundleHash
  - Full JSON scrollable view
- **Legality overview (`/legality-demo`)**
  - Static explanation of deterministic legality filtering
  - Links to `/demo` and `/stem`
- **RIC-STEM**
  - `/stem` placeholder demo calling `/api/stem-run`
  - `/ric-stem` overview describing deterministic STEM engine

### Infrastructure
- Next.js 14+ with app router
- Deployed on Vercel
- Env vars:
  - `RIC_URL`
  - `ANTHROPIC_API_KEY`
  - `ANTHROPIC_MODEL`
- Calls out to running RIC v2 deterministic substrate

---


⸻

