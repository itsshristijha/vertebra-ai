import { Camera, ScanLine, Building2 } from "lucide-react";

const ITEMS = [
  {
    icon: Camera,
    title: "Detection, not prediction",
    body:
      "Most posture apps only tell you what's happening right now. They rarely connect today's slouch to tomorrow's spine-health outcome.",
  },
  {
    icon: ScanLine,
    title: "One-size-fits-all thresholds",
    body:
      "Fixed population-level angle thresholds ignore individual anthropometry, so the same posture can be flagged very differently for different bodies.",
  },
  {
    icon: Building2,
    title: "Clinical imaging comes too late",
    body:
      "X-ray and MRI-based systems can measure spinal deformity accurately, but only after it has already developed — not while it's still preventable.",
  },
];

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">The problem</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Prolonged static posture is a preventable risk — but today&apos;s tools react instead of predicting.
        </h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          Sustained forward head posture and repetitive spinal loading are recognised contributors to musculoskeletal
          problems among students, office workers and remote employees. Existing computational solutions are largely
          split between reactive posture classifiers and after-the-fact clinical imaging.
        </p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
