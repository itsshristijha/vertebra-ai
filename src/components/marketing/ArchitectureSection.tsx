const STAGES = [
  "Webcam + IMU",
  "Pose / Orientation Extraction",
  "Synchronisation",
  "Anthropometric Normalisation",
  "Feature Fusion",
  "Temporal Model",
  "Clinical Risk Layer",
  "Spine Health Score",
  "Explainability / Trend Report / Predictive Nudge",
];

export function ArchitectureSection() {
  return (
    <section className="bg-navy py-20 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">AI architecture</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          A modular pipeline, from sensing to preventive feedback.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
          Each stage is an isolated service in the proposed architecture, so the sensing, modelling and presentation
          layers can evolve independently — and so a future Python/FastAPI backend can slot in behind this same
          frontend without redesigning it.
        </p>

        <div className="mt-12 flex flex-wrap items-stretch gap-3">
          {STAGES.map((stage, i) => (
            <div key={stage} className="flex items-center gap-3">
              <div className="flex min-h-[76px] w-40 flex-col justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
                <span className="text-xs font-medium leading-snug text-slate-100">{stage}</span>
              </div>
              {i < STAGES.length - 1 && <span className="text-slate-500">→</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
