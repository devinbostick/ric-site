RIC-STEM Overview

RIC-STEM is the deterministic STEM engine running on top of the RIC v2 substrate.
It exposes linear ODE integration and linear system solving in fixed-point Q32.

⸻

1. Capabilities

RIC-STEM v1 provides:

1.1 Linear ODEs

Form:

dy/dt = A y + b

	•	Q32 fixed-point arithmetic
	•	Deterministic Euler integrator
	•	No floats, no randomness, no time-based behavior

1.2 Linear Systems

Form:

A x = b

	•	Deterministic Gaussian elimination
	•	Q32 fixed-point row operations
	•	Deterministic pivoting rules

⸻

2. Endpoints

POST /stem/run

Request:

{
  "program": "ode" | "linsys",
  "A": [[ "q32", ... ]],
  "b": [ "q32", ... ],
  "y0": [ "q32", ... ],
  "dt": "q32",
  "steps": 32
}

Response:

{
  "result": { ... },
  "traceId": "run-xxxx",
  "version": "ric-v2"
}

GET /metrics

Returns counters:
	•	total STEM runs
	•	total ODE runs
	•	total linear system runs
	•	average ticks per run

⸻

3. Determinism
	•	All numerics use Q32 fixed-point
	•	No float operations anywhere
	•	No random seeds
	•	No Date/time
	•	Same inputs → same output → same bundleHash

⸻

4. How the Front-End Uses It

The site calls /api/stem-run which proxies to:

POST RIC_URL/stem/run

The UI displays:
	•	inputs
	•	deterministic output
	•	bundle link if emitted
	•	error messages when backend is not implemented

⸻

5. Example Request

{
  "program": "ode",
  "A": [[ "65536" ]],
  "b": [ "0" ],
  "y0": [ "65536" ],
  "dt": "65536",
  "steps": 4
}


⸻

6. Example Response

{
  "result": {
    "y": ["131072"]
  },
  "traceId": "run-abc123",
  "version": "ric-v2"
}


⸻

7. Roadmap

Planned additions:
	•	Q32 Runge–Kutta integrators
	•	Deterministic FFT
	•	Deterministic polynomial solver
	•	Deterministic symbolic simplifier

RIC-STEM expansions will follow substrate legality rules and produce full replayable proof bundles.