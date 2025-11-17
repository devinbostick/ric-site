export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <section className="mx-auto w-full max-w-4xl text-center space-y-14">
        {/* Hero */}
        <header className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Resonance Intelligence Core
          </h1>
          <p className="text-base md:text-lg text-neutral-700">
            A deterministic reasoning substrate with a full audit trail.
          </p>
          <p className="text-sm md:text-base text-neutral-600">
            Same request → same answer → signed proof bundle you can replay at any time.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/demo"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold bg-black text-white hover:opacity-90"
            >
              Open contradiction demo
            </a>
            <a
              href="/stem"
              className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold border border-neutral-300 bg-white text-black hover:bg-neutral-50"
            >
              Open RIC-STEM engine
            </a>
          </div>
        </header>

        {/* Three-point explainer */}
        <section className="grid gap-6 md:grid-cols-3 text-left md:text-center text-sm md:text-base">
          <div className="space-y-1">
            <h2 className="font-semibold">Deterministic</h2>
            <p className="text-neutral-700">
              All core math runs in fixed-point Q32. No randomness, no hidden drift, no “sometimes” answers.
            </p>
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Replayable</h2>
            <p className="text-neutral-700">
              Every run can be replayed bit-for-bit with the same inputs, so investigations and audits never rely on memory.
            </p>
          </div>
          <div className="space-y-1">
            <h2 className="font-semibold">Auditable</h2>
            <p className="text-neutral-700">
              Each run lives in a proof bundle with hashes, steps, and legality reasons that you can store, sign, and verify.
            </p>
          </div>
        </section>

        {/* API access / email capture */}
        <section className="max-w-xl mx-auto space-y-4">
          <h2 className="text-base md:text-lg font-semibold">
            Want API access or to run a pilot?
          </h2>
          <p className="text-sm md:text-base text-neutral-700">
            Share your email and a short note. We&apos;ll reach out as we open access to the substrate and RIC-STEM.
          </p>

          <form
            action="https://formspree.io/f/mvgbybpa"
            method="POST"
            className="mt-2 mx-auto flex w-full flex-col items-stretch gap-3"
          >
            {/* honeypot */}
            <input type="text" name="_gotcha" className="hidden" autoComplete="off" />

            <input
              type="email"
              name="email"
              placeholder="you@email.com"
              required
              className="px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm md:text-base"
            />
            <textarea
              name="message"
              placeholder="Tell us briefly how you’d like to use RIC (e.g. legal, STEM, audit)…"
              rows={3}
              className="px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm md:text-base"
            />

            <input type="hidden" name="_subject" value="RIC API / pilot interest" />
            <input type="hidden" name="_next" value="/thanks" />

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-black text-white font-semibold text-sm md:text-base hover:opacity-90"
            >
              Contact me about access
            </button>

            <p className="text-xs text-neutral-500">
              One-time replies only. No lists, no spam.
            </p>
          </form>
        </section>

        <footer className="pt-6 border-t text-xs text-neutral-400">
          © {new Date().getFullYear()} Resonance Intelligence Core
        </footer>
      </section>
    </main>
  );
}