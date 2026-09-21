import { Camera, Crosshair, Waves, BrainCircuit, HeartPulse } from "lucide-react";

const STEPS = [
  {
    icon: Camera,
    title: "Capture",
    body: "3D body landmarks are extracted from an ordinary webcam using MediaPipe BlazePose, optionally supplemented by one wearable IMU.",
  },
  {
    icon: Crosshair,
    title: "Calibrate",
    body: "A short enrolment scan establishes your personal posture baseline instead of relying on a fixed population threshold.",
  },
  {
    icon: Waves,
    title: "Normalise & fuse",
    body: "Joint angles are normalised using your anthropometry, then fused into interpretable posture features over time.",
  },
  {
    icon: BrainCircuit,
    title: "Model over time",
    body: "A temporal architecture (BiLSTM / lightweight Transformer-ready) accumulates postural load across hours and days — not just single frames.",
  },
  {
    icon: HeartPulse,
    title: "Score & explain",
    body: "Features are linked to clinically recognised indices (CVA, RULA, REBA) to produce a Spine Health Score with explainable attribution.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From a webcam frame to a longitudinal spine-health signal.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="text-xs font-semibold text-muted-foreground">Step {i + 1}</span>
              <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
