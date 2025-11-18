RIC Site — Developer Setup

This document describes how to run and extend the RIC demo site locally.

The site is a Next.js app that surfaces:
	•	Legality gating demo (/demo)
	•	Public bundle viewer (/bundle/[id])
	•	STEM demo surface (/stem)
	•	STEM overview (/ric-stem)
	•	Home + API access form (/)

The front-end interacts with a running RIC v2 substrate and (optionally) Anthropic for model calls.

⸻

1. Overview

The repository contains:
	•	app/ — React server/client components
	•	app/api/ — API routes (server-only)
	•	Tailwind for styling
	•	No global CSS except defaults
	•	No direct model calls from the client — all model access is gated through API routes

The system depends on:
	•	A local or remote RIC instance (RIC_URL)
	•	Anthropic model backend for /demo (optional, only used if RIC returns PASS)

⸻

2. Local Environment

2.1 Install dependencies

pnpm install
# or
npm install

2.2 Create .env.local

At the repo root:

RIC_URL=http://localhost:8787
ANTHROPIC_API_KEY=sk-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

Notes:
	•	RIC_URL must point to your running RIC API.
	•	For typical local runs:
	•	http://localhost:8787
	•	The Anthropic fields are used only in /api/demo-run.

2.3 Start RIC locally

From ric-core-2 repo (not this repo):

PORT=8787 TRACE_LOG=artifacts/traces-dev.jsonl pnpm dev:api

Confirm:

curl http://localhost:8787/healthz
curl http://localhost:8787/metrics

Both should return JSON.

⸻

3. Running the Site

Start dev server:

pnpm dev

Then visit:
	•	http://localhost:3000/ — home page
	•	http://localhost:3000/demo — legality demo
	•	http://localhost:3000/bundle/<id> — bundle viewer
	•	http://localhost:3000/legality-demo — legality description
	•	http://localhost:3000/stem — STEM demo
	•	http://localhost:3000/ric-stem — STEM overview

⸻

4. API Routes

4.1 /api/demo-run
	•	Accepts { claim, question }
	•	Calls RIC /run
	•	If DECISION: HALT → do not call Anthropic
	•	If DECISION: PASS → call Anthropic once
	•	Returns:
	•	RIC decision
	•	model output (if PASS)
	•	version
	•	proposalHash / promptHash
	•	bundle id

4.2 /api/demo-raw-claude
	•	Direct call to Anthropic
	•	Not gated by RIC
	•	Used only for comparison

4.3 /api/bundle/[id]
	•	GET proxy to RIC_URL/bundle/:id
	•	Returns full JSON bundle for viewer pages

4.4 /api/stem-run
	•	POST to RIC_URL/stem/run
	•	Used by STEM demo
	•	If not implemented on backend, returns placeholder response

⸻

5. Development Commands

Lint

pnpm lint

Build

pnpm build

Start production build locally

pnpm build
pnpm start


⸻

6. Adding New Demo Pages
	1.	Add directory: app/<route>/
	2.	Add page.tsx
	3.	If backend calls needed:
	•	Add route in app/api/<name>/route.ts
	•	Call RIC from server-side only
	4.	Optionally update:
	•	CONTRIBUTING.md
	•	CHANGELOG.md

⸻

7. Style & TypeScript Rules
	•	No any
	•	Prefer unknown + refinements
	•	Keep components deterministic
	•	No random, no Date.now() except footer year
	•	Tailwind for all styling
	•	Keep imports small and contained

⸻

8. Deployment Notes

Production deploys automatically when pushing to main.

Environment variables are controlled in:
	•	Vercel → Settings → Environment Variables

Required:
	•	RIC_URL
	•	MODEL_PROVIDER (anthropic)
	•	ANTHROPIC_API_KEY
	•	ANTHROPIC_MODEL

Optional:
	•	OPENAI_API_KEY
	•	OPENAI_MODEL

⸻

9. Versioning

For milestone releases:

git tag v0.1.0-demo
git push origin v0.1.0-demo


⸻