# RIC Request Flow (Architecture-Level)

This file describes the deterministic flow from user action → RIC substrate.

---

## 1. Browser → Next.js (Client → Server)

1. User loads a page:
   - `/demo`
   - `/bundle/<id>`
   - `/stem`

2. Next.js server components load.

---

## 2. Next.js API Route Layer

All backend actions go through:

- `/api/demo-run`
- `/api/demo-raw-claude`
- `/api/bundle/[id]`
- `/api/stem-run`

These routes:
- validate input
- call RIC_URL
- return structured JSON

No secrets or backend calls happen in the browser.

---

## 3. RIC v2 Substrate (Deterministic Core)

Endpoints:

- `POST /run`
- `GET /bundle/:id`
- `POST /stem/run`
- `GET /metrics`
- `GET /healthz`

The substrate:
- uses Q32 fixed-point arithmetic  
- has no floats, randomness, or time sources  
- produces deterministic bundles with trace, nodes, edges  
- signs output with graphHash and bundleHash  

---

## 4. Return Path

1. RIC returns structured JSON
2. Next.js sanitizes + forwards JSON
3. Browser renders:
   - pass/halt result
   - model output (if PASS)
   - deterministic bundle ID
   - link to `/bundle/<id>`

---

## 5. Deterministic Guarantees

- Same input → same output bit-for-bit
- Bundle replay ensures auditability
- Graph structure ensures no implicit branches