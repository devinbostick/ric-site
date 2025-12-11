export default function Page() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 md:py-10">

        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
              RIC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Resonance
              </span>
              <span className="text-sm font-medium text-neutral-800">
                Intelligence Core
              </span>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 px-6 py-8 shadow-sm md:px-8 md:py-10">
          <div className="max-w-3xl space-y-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-500">
              Deterministic substrate
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              A resonance-based infrastructure
              <br />
              for structured reasoning.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-neutral-700 md:text-base">
              RIC is a coherence-driven reasoning substrate. It executes symbolic
              operations through deterministic phase alignment — the same input
              always produces the same internal structure, the same sequence of steps,
              and the same conclusion.
              Its purpose is not prediction. Its purpose is stability.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <a
                href="https://philpapers.org/rec/BOSTRV-2"
                className="inline-flex w-fit items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                Read the vision paper
              </a>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mt-10 rounded-3xl bg-neutral-900 px-6 py-8 text-neutral-50 md:px-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <p className="text-xs font-medium uppercase tracking-[0.26em] text-neutral-400">
                Architecture overview
              </p>
              <p className="mt-2 text-sm text-neutral-200 leading-relaxed">
                RIC operates as a closed, deterministic pipeline:
                phase alignment → structured steps → legality gates → stable output.
              </p>
            </div>

            <div className="grid flex-1 gap-4 text-xs md:grid-cols-3 md:text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                  Deterministic core
                </p>
                <p className="leading-snug text-neutral-100">
                  Fixed-point Q32 numerics.
                  No randomness. No timing drift.
                  Identical replay across machines.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                  Structural reasoning
                </p>
                <p className="leading-snug text-neutral-100">
                  Each reasoning sequence forms a verifiable chain of steps protected
                  by legality checks and structural gating.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                  Stability first
                </p>
                <p className="leading-snug text-neutral-100">
                  Designed for environments where stability matters more than
                  statistical performance or speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why RIC exists */}
        <section className="mt-10 grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">
              A substrate built for long-horizon reliability.
            </h2>
            <p className="text-sm leading-relaxed text-neutral-700">
              Some systems cannot tolerate drift.
              Alignment must hold over months, years, or lifetimes.
              RIC offers a coherence-based approach to symbolic processing that
              retains its structure regardless of context or environment.
            </p>
            <p className="text-sm leading-relaxed text-neutral-700">
              It behaves more like a metronome or a quartz reference than a model.
              Its role is to provide a stable foundation that other software can
              build upon.
            </p>
          </div>

          <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Where this substrate fits.</h2>
            <ul className="space-y-2 text-sm leading-relaxed text-neutral-700">
              <li>• Systems requiring reproducibility across long timescales.</li>
              <li>• Multi-party environments needing shared, verifiable reasoning.</li>
              <li>• Embedded or edge deployments where drift breaks guarantees.</li>
              <li>• Safety-critical workflows requiring deterministic constraints.</li>
              <li>• Any process needing structured, inspectable reasoning.</li>
            </ul>
          </div>
        </section>

        {/* Reasoning structure */}
        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">
            A reasoning process you can inspect.
          </h2>
          <p className="text-sm leading-relaxed text-neutral-700 max-w-xl">
            RIC treats reasoning as a physical artifact.
            Each run produces a structured sequence of steps that form a traceable,
            deterministic chain. These structures are stable, replayable, and suitable
            for long-term audit.
          </p>

          <div className="mt-4 grid gap-3 text-xs text-neutral-800 md:grid-cols-2 md:text-sm">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <ul className="space-y-1 leading-snug">
                <li>• Ordered symbolic steps</li>
                <li>• Deterministic legality checks</li>
                <li>• Stable structural transitions</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <ul className="space-y-1 leading-snug">
                <li>• Environment-independent outcomes</li>
                <li>• Verifiable structural integrity</li>
                <li>• Long-horizon reproducibility</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quiet link */}
        <section className="mt-10 rounded-3xl bg-neutral-900 px-6 py-8 text-neutral-50 md:px-8 md:py-10">
          <div className="max-w-md space-y-4">
            <h2 className="text-lg font-semibold">A calm introduction.</h2>
            <p className="text-sm leading-relaxed text-neutral-300">
              For those who want a deeper understanding of the structure,
              the written overview explains how resonance, coherence, and determinism
              form the foundation of the substrate.
            </p>
            <a
              href="https://philpapers.org/rec/BOSTRV-2"
              className="inline-flex w-fit items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 hover:opacity-80"
            >
              Read the vision paper
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex w-full flex-col items-center justify-between gap-2 border-t border-neutral-200 pt-4 text-[11px] text-neutral-500 md:flex-row">
          <span>© {new Date().getFullYear()} Resonance Intelligence Core</span>
        </footer>

      </div>
    </main>
  );
}