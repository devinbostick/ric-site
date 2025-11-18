RIC Bundle Format

This document describes the JSON bundle format emitted by RIC v2 and displayed at:
	•	/bundle/[id] (public viewer)
	•	/api/bundle/[id] (Next.js proxy to RIC)

A bundle is the deterministic proof object for a single RIC run.

⸻

1. Top-Level Shape

A typical bundle has this structure:

{
  "version": "ric-v2.0.0",
  "codeHash": "hex-string",
  "emitted": 1,
  "header": {
    "program": "legalityDemo",
    "timestamp": "2025-11-18T17:42:12Z",
    "meta": {
      "source": "demo-site"
    }
  },
  "trace": {
    "id": "run-0000000000000001",
    "steps": [
      {
        "idx": 0,
        "op": "INIT",
        "reason": "start",
        "state": { "...": "..." }
      }
    ]
  },
  "graph": {
    "nodes": [
      {
        "id": "n0",
        "stepIdx": 0,
        "kind": "INIT",
        "reason": "start"
      }
    ],
    "edges": [
      {
        "from": "n0",
        "to": "n1",
        "kind": "NEXT"
      }
    ]
  },
  "graphHash": "hex-string",
  "bundleHash": "hex-string",
  "metrics": {
    "runCount": 123,
    "replayCount": 4
  }
}

Notes:
	•	Fields may be extended in future versions.
	•	Existing fields keep the same meaning and type.
	•	The viewer (/bundle/[id]) is coded defensively (optional checks).

⸻

2. Core Fields

2.1 version

"version": "ric-v2.0.0"

	•	Semantic version of the RIC substrate that produced this bundle.
	•	Used for compatibility and migration.

2.2 codeHash

"codeHash": "hex"

	•	Hash of the code and configuration that produced the run.
	•	Guarantees that the same code base is being referenced for replay.

2.3 emitted

"emitted": 1

	•	Number of emission ticks (e.g., 0 or more discrete outputs).
	•	Used in the demo viewer to display “Emitted ticks”.

⸻

3. Header

"header": {
  "program": "legalityDemo",
  "timestamp": "2025-11-18T17:42:12Z",
  "meta": {
    "source": "demo-site"
  }
}

	•	program: program name or tag (e.g., "legalityDemo", "stemOde").
	•	timestamp: creation time for the bundle (does not affect core determinism).
	•	meta: arbitrary metadata (source, environment, etc.).

The legality of the run is determined solely by deterministic state; timestamp and meta are informational.

⸻

4. Trace

"trace": {
  "id": "run-0000000000000001",
  "steps": [
    {
      "idx": 0,
      "op": "INIT",
      "reason": "start",
      "state": { "...": "..." }
    }
  ]
}

4.1 trace.id
	•	Unique identifier for the run (e.g., run-<counter>).
	•	Used in URLs: /bundle/<trace.id>.

4.2 trace.steps[]

Each step has:

{
  "idx": 0,
  "op": "string",
  "reason": "string",
  "state": { "..." : "..." }
}

	•	idx: zero-based index in the run.
	•	op: operation name (e.g., "INIT", "CHECK_DATE_WINDOW", "HALT").
	•	reason: short explanation of what occurred.
	•	state: deterministic state snapshot or delta (Q32 encoded values, flags, etc.).

The sequence of steps is deterministic for a given input and version.

⸻

5. Graph

"graph": {
  "nodes": [
    {
      "id": "n0",
      "stepIdx": 0,
      "kind": "INIT",
      "reason": "start"
    }
  ],
  "edges": [
    {
      "from": "n0",
      "to": "n1",
      "kind": "NEXT"
    }
  ]
}

5.1 graph.nodes[]

Each node typically mirrors a trace step:

{
  "id": "n0",
  "stepIdx": 0,
  "kind": "INIT",
  "reason": "start"
}

	•	id: node identifier (string).
	•	stepIdx: index in trace.steps.
	•	kind: node type (e.g., INIT, CHECK, HALT, EMIT).
	•	reason: short label or description.

The viewer summarizes:
	•	graphNodeCount = nodes.length

5.2 graph.edges[]

{
  "from": "n0",
  "to": "n1",
  "kind": "NEXT"
}

	•	from: source node id.
	•	to: target node id.
	•	kind: link type (e.g., "NEXT", "CAUSE", "DEPENDENCY").

The viewer summarizes:
	•	graphEdgeCount = edges.length

Graph structure is deterministic for a given run and version.

⸻

6. Hashes

6.1 graphHash

"graphHash": "hex"

	•	Hash over graph.nodes and graph.edges.
	•	Changes if any node or edge content changes.
	•	Used to verify structural integrity of the legality graph.

6.2 bundleHash

"bundleHash": "hex"

	•	Final hash over:
	•	Header
	•	Trace
	•	graphHash
	•	Acts as the top-level integrity hash for the bundle.
	•	Same input + same version → same bundleHash.

Both hashes are displayed on /bundle/[id] when present.

⸻

7. Metrics (Optional)

"metrics": {
  "runCount": 123,
  "replayCount": 4
}

	•	Aggregate counters at the time of this run.
	•	Used to track usage, not to drive determinism.

Fields may include:
	•	runCount: total number of runs so far.
	•	replayCount: number of replays.

⸻

8. Viewer Expectations

The bundle viewer (/bundle/[id]) expects:
	•	Top-level JSON with at least:
	•	trace.id
	•	graph.nodes (optional but preferred)
	•	graph.edges (optional but preferred)
	•	graphHash (optional)
	•	bundleHash (optional)
	•	emitted (optional)

Behavior:
	•	If graph is missing or partially missing, counts fall back to —.
	•	Full JSON is always rendered in a scrollable <pre> block.
	•	No assumptions are made about additional fields.

⸻

9. Determinism Guarantees

Given:
	•	Same RIC version
	•	Same codeHash
	•	Same inputs

Then:
	•	trace.steps are identical
	•	graph.nodes and graph.edges are identical
	•	graphHash is identical
	•	bundleHash is identical

This is the basis for:
	•	Deterministic replay
	•	Auditable legality decisions
	•	Stable proofs over time.