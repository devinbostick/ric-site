RIC Legality Layer

This document defines the deterministic legality layer used by the demo site.
The legality layer is a gating system: it decides whether a downstream model call is permitted.

⸻

1. Purpose

The legality layer enforces:
	•	Deterministic evaluation of a claim
	•	Deterministic matching of allowed question types
	•	Deterministic PASS / HALT gating
	•	Full proof bundle creation
	•	Deterministic replay of the decision

All decisions occur before any model call.

⸻

2. Input Structure

The demo uses the following structure (wrapped by the front-end):

{
  "claim": "string",
  "question": "string"
}

The API route converts this into the RIC legality program:

{
  "program": {
    "type": "legalityDemo",
    "claim": "string",
    "question": "string"
  }
}


⸻

3. Decision Logic (Deterministic)

The legality layer produces:
	•	"PASS" — downstream model call is allowed
	•	"HALT" — model call is blocked

The legality decision is based on:
	1.	Structural validity of the input
	2.	Internal PAS_h thresholds
	3.	Rule checks encoded in the legalityDemo program
	4.	ΔPAS_zeta drift constraints
	5.	GLYPHLOCK structural gates

The legality logic returns the decision and binds it to a proof bundle.

⸻

4. PASS Case

If the legality program returns "PASS":
	•	The trace is recorded
	•	A proof bundle is generated
	•	A model call is permitted
	•	The downstream model output is returned alongside the legality metadata

PASS response shape:

{
  "decision": "PASS",
  "traceId": "run-xxxx",
  "proposalHash": "hex",
  "promptHash": "hex",
  "version": "ric-v2"
}

The demo site then performs one model call using the Anthropic backend.

⸻

5. HALT Case

If the legality program returns "HALT":
	•	No model calls occur
	•	The user receives the reason for the halt
	•	The bundle can still be viewed

HALT response shape:

{
  "decision": "HALT",
  "reason": "string",
  "traceId": "run-xxxx",
  "version": "ric-v2"
}


⸻

6. Proof Bundles

Every legality decision produces a deterministic bundle.

The bundle contains:

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
  "graphHash": "hex",
  "bundleHash": "hex"
}

Bundle properties:
	•	Can be replayed deterministically
	•	Same input → same bundleHash
	•	No randomness
	•	No time dependence
	•	Fully inspectable

⸻

7. Replay

Users may deterministically replay decisions by:

POST /replay

Replay verifies:
	•	Same traceId
	•	Same legality decision
	•	Same node/edge counts
	•	Same graphHash and bundleHash

Replay must be bit-identical.

⸻

8. Front-End Integration

The front-end uses:

/api/demo-run
	•	Sends { claim, question }
	•	Calls RIC /run
	•	For PASS: calls Anthropic once
	•	For HALT: returns HALT immediately
	•	Links to the bundle viewer: /bundle/<id>

/demo (UI)

Displays:
	•	PASS or HALT
	•	Reason (if HALT)
	•	Model output (if PASS)
	•	Bundle summary
	•	Deterministic replay results

⸻

9. Guarantees

The legality layer provides:
	1.	Deterministic decision
	2.	Deterministic proof
	3.	Deterministic replay
	4.	Strict gating before any model is executed
	5.	Full transparency via bundles

This completes the legality subsystem specification.