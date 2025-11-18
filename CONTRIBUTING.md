Contributing to RIC Site

This repository hosts the production demo stack for Resonance Intelligence Core (RIC):
	•	Home page (/)
	•	Legality demo (/demo)
	•	Public bundle viewer (/bundle/[id])
	•	Legality overview (/legality-demo)
	•	STEM demo (/stem)
	•	STEM overview (/ric-stem)

The goal is to keep this stack simple, deterministic, and easy to reason about.

⸻

1. Prerequisites
	•	Node.js 20+
	•	pnpm (preferred) or npm / yarn
	•	Access to:
	•	A running RIC v2 substrate (HTTP API, usually on port 8787)
	•	An Anthropic API key for the legality demo

⸻

2. Local Setup

Install dependencies:

pnpm install
# or
npm install

Create .env.local:

RIC_URL=http://localhost:8787
ANTHROPIC_API_KEY=sk-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

Start development mode:

pnpm dev

Visit:
	•	http://localhost:3000 — home
	•	http://localhost:3000/demo — legality demo
	•	http://localhost:3000/stem — STEM demo
	•	http://localhost:3000/legality-demo
	•	http://localhost:3000/ric-stem

⸻

3. RIC API Expectations

The front-end expects the RIC API at RIC_URL to expose:
	•	POST /run
	•	GET /bundle/:id
	•	POST /stem/run (or stub)
	•	GET /metrics
	•	GET /healthz

All must be deterministic:
	•	No floats
	•	No randomness
	•	No time-based variability

⸻

4. Linting & Build

pnpm lint
pnpm build

Both must pass before commit.

⸻

5. TypeScript Style
	•	No any
	•	Prefer unknown then narrow
	•	Keep client components light
	•	Use Tailwind for all styling
	•	Keep deterministic behavior (no Date.now() except cosmetic footer)

⸻

6. Adding New Pages
	1.	Add directory under app/<route>/
	2.	Add page.tsx
	3.	If backend calls needed: add route under app/api/<name>/route.ts
	4.	Call RIC from server routes only (never client-side)

⸻

7. Branching & Commits

git checkout -b feature/<name>
# make changes
pnpm lint && pnpm build
git commit -m "feat: <description>"
git push


⸻

8. Deployment (Vercel)

Production is tied to main.
Push → auto-deploy.
Env vars managed in Vercel dashboard.

⸻

9. Version Tags

For milestone releases:

git tag v0.1.0-demo
git push origin v0.1.0-demo


⸻

10. UX / Copy Principles
	•	Keep copy short and concrete
	•	Emphasize determinism, replayability, proof bundles
	•	Always distinguish:
	•	RIC substrate
	•	Model gated by RIC

⸻