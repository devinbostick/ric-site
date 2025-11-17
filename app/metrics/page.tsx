<section className="mt-8 border rounded-2xl p-4 md:p-5 bg-white shadow-sm space-y-2">
  <h2 className="text-lg font-semibold">RIC-STEM v1 (deterministic STEM engine)</h2>
  <p className="text-sm text-neutral-700">
    RIC-STEM v1 runs ODE integration and linear algebra on the same fixed-point
    Q32 substrate as the core legality engine. Every STEM run is fully
    replayable: the same request yields the same bitwise bundle on any machine.
  </p>
  <ul className="list-disc list-inside text-sm text-neutral-700 space-y-1">
    <li>
      <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
        /stem/run
      </code>{" "}
      – linear ODE systems (Q32 integrator, deterministic t/y grid).
    </li>
    <li>
      <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
        /algebra/run
      </code>{" "}
      – deterministic linear solver (Q32 outputs + float views).
    </li>
    <li>
      Golden tests cover Q32 arithmetic, API schema stability, and replay
      determinism up through{" "}
      <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">
        golden-55
      </code>
      .
    </li>
  </ul>
</section>