// app/stem/page.tsx

export default function StemPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          RIC-STEM v1
        </h1>

        <p className="text-base md:text-lg leading-relaxed text-neutral-700">
          This page will host the deterministic STEM engine for RIC v2:
          fixed-point ODE integration, algebra, and contradiction-checked
          reasoning over a replayable substrate.
        </p>

        <p className="text-base leading-relaxed text-neutral-700">
          The backend route for this ({`/api/stem-run`}) will be added once the
          RIC <code>/stem/run</code> endpoint is live. For now, this page is a
          placeholder pointing to the upcoming STEM module.
        </p>

        <div className="border rounded-xl px-4 py-3 text-sm bg-neutral-50 text-neutral-800">
          <p className="font-medium mb-1">Status</p>
          <ul className="list-disc list-inside space-y-1">
            <li>RIC v2 substrate: live on dedicated server.</li>
            <li>Legality demo: available at <code>/demo</code>.</li>
            <li>STEM engine: backend integration pending.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
