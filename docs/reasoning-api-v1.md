# Reasoning API v1 (RIC-Core)

Base URL (public proxy):

POST https://resonanceintelligencecore.com/api/reason-run

Request:

{
  "inputs": [
    { "text": "first reasoning step" },
    { "text": "second reasoning step" }
  ]
}

Response:

{
  "ok": true,
  "id": "reason-…",
  "version": "ric-v2",
  "graph": {
    "version": "reasoning_v1",
    "steps": [
      { "tick": "0", "content": "first reasoning step", "proofHash": "…" },
      { "tick": "1", "content": "second reasoning step", "proofHash": "…" }
    ],
    "edges": [
      { "from": "0", "to": "1", "kind": "NEXT" }
    ],
    "graphHash": "…"
  }
}