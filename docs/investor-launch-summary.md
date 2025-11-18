```md
# RIC Site v0.1.0 — Launch Summary

This release makes RIC publicly visible for the first time with a clean, deterministic demo surface.

---

## 1. What’s Live

### 1.1 Deterministic Legality Demo (`/demo`)
- Validates any model output through the RIC legality program  
- PASS → model is allowed; HALT → blocked  
- deterministic; replayable  
- Bundle URL provided for audit

### 1.2 Public Bundle Viewer (`/bundle/<id>`)
- Shows RIC proof bundle  
- graphHash + bundleHash  
- bit-for-bit replay guarantee

### 1.3 STEM Demo Surface (`/stem`)
- Hooks for ODE + linear algebra solver  
- Runs on Q32 deterministic math

### 1.4 Home + Theory Integration
- API form  
- Link to main CODES paper  
- Clear framing of RIC as deterministic substrate

---

## 2. Why This Matters

RIC is now:

- visible  
- testable  
- replayable  
- stable in production  
- integrated with Anthropic (PASS-gated only)

This is the first public demonstration of deterministic reasoning infrastructure.

---

## 3. Architecture Overview

Browser → Next.js (Vercel) → API routes → RIC v2 → proof bundles.

No client-side secrets.  
All computation deterministically replayable.

---

## 4. Stability Guarantees

- Bit-for-bit determinism  
- Q32 fixed-point arithmetic  
- Golden test suite (1–46)  
- Strict API schema  
- Vercel deployment tied to Git `main` branch

---

## 5. What's Next (Q4 2025 – Q1 2026)

- RIC-STEM v1 (ODE solver, linear algebra, proof bundles)  
- Legality program editor  
- Node + Python SDK hardening  
- Pilot integrations (legal tech, claims, STEM tools)  