import Link from "next/link";

export default function AgiPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
              RIC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Resonance
              </span>
              <span className="text-sm font-medium text-neutral-800">
                Intelligence Core
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-4 text-xs md:flex md:text-sm">
            <Link
              href="/"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Home
            </Link>
            <Link
              href="/demo"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Legality demo
            </Link>
            <Link
              href="/stem"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              RIC-STEM
            </Link>
            <Link
              href="/reason"
              className="text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Reasoning
            </Link>
            <Link
              href="/agi"
              className="text-neutral-900 underline-offset-4 hover:text-neutral-900 hover:underline"
            >
              Deterministic AGI
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="mb-8 max-w-3xl space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Deterministic AGI
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A replayable AGI agent with a visible world, identity, and proof.
            </h1>
            <p className="text-sm leading-relaxed text-neutral-700">
              RIC-Core implements a deterministic agent stack. For each run, the
              engine emits a world model, identity state, PAS_h and drift, and a
              proof bundle with stable hashes. The same inputs always produce
              the same bundleHash, graphHash, and reasoning trace.
            </p>
            <p className="text-sm leading-relaxed text-neutral-700">
              The console gives you a read-only view into those internals for a
              concrete Helix claims scenario. You can run the agent, inspect the
              world and proof bundle, and replay the same run as many times as
              you like.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/console"
              className="inline-flex items-center justify-center rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-black"
            >
              Open deterministic AGI console
            </Link>
            <p className="max-w-md text-[11px] leading-snug text-neutral-600">
              In the console, press{" "}
              <span className="font-semibold">Run Helix scenario</span> to
              execute a deterministic AGI run for a small, clean claim. Then
              inspect the world, PAS_h, drift, and proof bundle.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
