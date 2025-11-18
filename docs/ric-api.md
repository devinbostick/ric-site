RIC API Specification

This document defines the RIC v2 HTTP API surface used by the demo site.
All endpoints are deterministic: fixed-point Q32 arithmetic, no randomness, no time-based behavior.

⸻

1. Base URL

RIC_URL = http://<host>:8787

All endpoints below are relative to this base.

⸻

2. Endpoints

2.1 Health

GET /healthz
Returns service liveness.

Example:

{ "status": "ok" }


⸻

2.2 Metrics

GET /metrics
Returns deterministic counters.

Example:

{
  "runs": 124,
  "replays": 12,
  "stemRuns": 8,
  "version": "ric-v2"
}


⸻

2.3 Run Program

POST /run
Main deterministic execution endpoint.

Request:

{
  "program": { ... }
}

Response (HALT):

{
  "decision": "HALT",
  "reason": "…",
  "traceId": "run-xxxx",
  "version": "ric-v2"
}

Response (PASS):

{
  "decision": "PASS",
  "traceId": "run-xxxx",
  "version": "ric-v2"
}


⸻

2.4 Replay

POST /replay
Given a trace id and its program, deterministically replays the run.

Request:

{
  "traceId": "run-xxxx",
  "program": { ... }
}

Response:

{
  "traceId": "run-xxxx",
  "replayed": true,
  "version": "ric-v2"
}

Replay must always match the original run bit-for-bit.

⸻

2.5 Bundle Retrieval

GET /bundle/:id
Returns the full proof-of-legality bundle for a given run.

Response:

{
  "header": { ... },
  "trace": {
    "id": "run-xxxx",
    "steps": [ ... ]
  },
  "graph": {
    "nodes": [ ... ],
    "edges": [ ... ]
  },
  "graphHash": "hex-string",
  "bundleHash": "hex-string"
}

The bundle is fully deterministic; hashes must match across all machines.

⸻

2.6 STEM Engine

POST /stem/run
Runs a deterministic STEM program.

Request:

{
  "program": "ode" | "linsys",
  "A": [[ "q32", ... ]],
  "b": [ "q32", ... ],
  "y0": [ "q32", ... ],
  "dt": "q32",
  "steps": 16
}

Response:

{
  "result": { ... },
  "traceId": "run-xxxx",
  "version": "ric-v2"
}


⸻

3. Determinism Rules

Every endpoint must obey:
	•	Q32 fixed-point arithmetic
	•	No floats
	•	No randomness
	•	No time dependence
	•	Identical request → identical response → identical bundleHash

⸻

4. Error Format

On error, endpoints return:

{
  "error": "string",
  "detail": "optional description"
}

With appropriate status codes (400/500).

⸻

5. Versioning

All responses must include:

"version": "ric-v2"

This identifies the deterministic substrate version used for execution.

⸻

6. Notes
	•	The demo site calls /run and /bundle/:id through Next.js server routes.
	•	The legality demo calls Anthropic only after a PASS decision.
	•	/stem/run is used by the STEM demo, and may initially be a stub until full engine activation.

This file provides the complete API required by the site.