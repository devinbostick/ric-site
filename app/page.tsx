export default function Page() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Resonance Intelligence Core</h1>
      <p className="mt-4 text-lg md:text-xl text-neutral-600 dark:text-neutral-300">
        Deterministic emission at the substrate. Replayable legality.
      </p>

      <p className="mt-10 text-sm text-neutral-500">Launching soon — want updates?</p>

      <form
        action="https://formspree.io/f/mvgbybpa"
        method="POST"
        className="mt-4 mx-auto flex w-full max-w-sm flex-col items-stretch gap-3"
      >
        <input type="text" name="_gotcha" className="hidden" autoComplete="off" />

        <input
          type="email"
          name="email"
          placeholder="you@email.com"
          required
          className="px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
        />
        <input type="hidden" name="_subject" value="New RIC subscriber" />
        <input type="hidden" name="_next" value="/thanks" />

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold hover:opacity-90"
        >
          Notify me
        </button>

        <p className="text-xs text-neutral-500">
          We’ll email when we launch. No spam.
        </p>
      </form>

      <p className="mt-16 text-sm text-neutral-400">© {new Date().getFullYear()} Resonance Intelligence Core</p>
    </section>
  );
}
