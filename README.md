# RIC Site — Production Demo Stack

This repository contains the public-facing demo interface for the **Resonance Intelligence Core (RIC)**.

It exposes:

- **Home page** (`/`)
- **Deterministic legality demo** (`/demo`)
- **Public bundle viewer** (`/bundle/[id]`)
- **Legality overview** (`/legality-demo`)
- **STEM demo placeholder** (`/stem`)
- **STEM overview** (`/ric-stem`)

All routes are deployed on Vercel and call into a live RIC v2 substrate running at:

RIC_URL=https://:8787

---

## Environment Variables

Set in **Vercel → Project → Settings → Environment Variables**:

| Name               | Purpose                                                   |
|--------------------|-----------------------------------------------------------|
| `RIC_URL`          | Base URL of the RIC v2 API (`/run`, `/bundle`, `/metrics`) |
| `ANTHROPIC_API_KEY`| Used *only* for model call after RIC PASS                 |
| `ANTHROPIC_MODEL`  | Model ID (e.g., `claude-3-5-sonnet-20241022`)             |

No `.env.local` is committed.

---

## Development

Start the dev server:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev

Visit:

http://localhost:3000

Hot reload is active for all app/* routes.

⸻

Directory Structure

app/
  page.tsx                 → Home
  demo/page.tsx            → Legality demo
  legality-demo/page.tsx   → Legality overview
  stem/page.tsx            → STEM demo
  ric-stem/page.tsx        → STEM overview
  bundle/[id]/page.tsx     → Public bundle viewer

app/api/
  demo-run/route.ts        → Calls RIC /run + Anthropic for PASS
  demo-raw-claude/route.ts → Direct model call (comparison only)
  bundle/[id]/route.ts     → Proxy for RIC /bundle/:id
  stem-run/route.ts        → STEM engine proxy/stub


⸻

Deployment

Production deployments trigger automatically on push to main.

Vercel environment variables must be configured before deploy.

⸻

Versioning

Example tagging:

git tag v0.1.0-demo
git push origin v0.1.0-demo


⸻

License

MIT (or add your preferred license).

---

# ✅ docs/ Folder (create)

Create a folder:

docs/

Inside it, add these 4 files (copy/paste exactly):

---

### 📄 docs/ric-api.md

```md
# RIC API — Expected Contract (Frontend Perspective)

The front-end integrates with a deterministic RIC v2 substrate.

Required endpoints:

### `POST /run`
Main legality pipeline.
Returns:
- decision: PASS | HALT
- bundle_id: string
- proposalHash: string
- promptHash: string
- version: string

### `GET /bundle/:id`
Returns the full deterministic proof bundle:
- header
- trace
- graph (nodes, edges)
- graphHash
- bundleHash

### `POST /stem/run`
Linear algebra + ODE handler for the STEM demo.

### `GET /metrics`
Returns deterministic counters:
- runs
- replays
- emitted
- version

### `GET /healthz`
Health check.


⸻

📄 docs/legality-demo.md

# Legality Demo — Deterministic Gating

The `/demo` page implements:

1. User enters:
   - Claim (JSON)
   - Question (string)

2. Front-end calls `/api/demo-run`:
   - Server calls `RIC_URL/run`
   - If RIC HALT → return HALT + bundle id
   - If RIC PASS → server calls Anthropic once

3. UI displays:
   - Deterministic PASS/HALT
   - Model output for PASS
   - Full bundle link
   - proposalHash / promptHash


⸻

📄 docs/bundle-format.md

# Bundle Format — RIC v2

A bundle returned by RIC contains:

- **header**
  - version
  - time indices
  - legality flags
- **steps** (trace)
  - each deterministic state transition
- **graph**
  - nodes[]
  - edges[]
- **graphHash**
- **bundleHash**

The UI uses:
- `trace.id`
- `graph.nodes.length`
- `graph.edges.length`
- `graphHash`
- `bundleHash`


⸻

📄 docs/stem.md

# RIC-STEM v1

The STEM surface exposes deterministic Q32 math:
- Linear ODE integrator
- Linear system solver

Front-end route: `/stem`
API proxy: `/api/stem-run`

Expected backend shape:

POST /stem/run
{
“mode”: “ode” | “linear”,
“payload”: { … }
}

All computations must be:
- deterministic
- Q32 fixed-point
- replayable via RIC counters


⸻