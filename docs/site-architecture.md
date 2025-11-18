# RIC Site Architecture (v0.1.0)

This document describes the architecture connecting:
browser → Next.js (Vercel) → RIC v2 substrate.

---

## 1. High-Level Diagram

Browser
   ↓ HTTP
Next.js App Router (Vercel)
   • app/page.tsx
   • app/demo/page.tsx
   • app/bundle/[id]/page.tsx
   ↓ Server Actions / API Routes
Next.js API Routes
   • /api/demo-run
   • /api/demo-raw-claude
   • /api/bundle/[id]
   • /api/stem-run
   ↓ HTTP
RIC v2 Substrate (port 8787)
   • POST /run
   • GET /bundle/:id
   • POST /stem/run
   • GET /metrics
   • GET /healthz

---

## 2. Request Flow Examples

### 2.1 Legality Demo (PASS/HALT)

1. User → `/demo` UI  
2. UI → POST `/api/demo-run`  
3. `/api/demo-run` → POST `RIC_URL/run`  
4. RIC returns `{ decision: PASS|HALT, bundleId }`  
5. If PASS → `/api/demo-run` calls Anthropic once  
6. Response sent to UI  
7. UI links to `/bundle/<id>`

---

### 2.2 Bundle Viewer

1. User → `/bundle/<id>`  
2. Page → GET `/api/bundle/<id>`  
3. `/api/bundle/<id>` → GET `RIC_URL/bundle/<id>`  
4. Full JSON rendered

---

### 2.3 STEM Demo

1. User → `/stem`  
2. UI → POST `/api/stem-run`  
3. `/api/stem-run` → POST `RIC_URL/stem/run`  
4. Deterministic ODE/algebra response returned

---

## 3. Deployment Architecture

main branch → GitHub  
↓  
Vercel Build  
↓  
Static + Serverless output  
↓  
Production URL: https://resonanceintelligencecore.com

---

## 4. Determinism Requirements

- API routes never call the model unless RIC returns PASS  
- No client-side model calls  
- RIC_URL is the single backend authority  
- No Date.now(), timers, random values in logic surfaces

---

## 5. Future Extensions

- RIC-STEM rich solver UI  
- Legality program editor  
- Multi-run comparison tables  