import { CheckCircle2 } from "lucide-react";
import { CircularScore } from "@/components/charts/CircularScore";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";

const POINTS = [
  "Fixed, population-level joint-angle thresholds don't account for individual anthropometry or natural resting posture.",
  "A short enrolment scan establishes your own neutral head, shoulder and spine orientation as the reference point.",
  "Deviations are interpreted relative to your personal baseline — improving cross-subject generalisation.",
  "The same design choice the VERTEBRA-AI research team prioritised after reviewing 40 studies across five sub-domains.",
];

const VISION_POINTS = [
  {
    title: "Personal Posture Digital Twin",
    body: "The system models your normal ranges and learns when your posture has drifted beyond your own baseline.",
  },
  {
    title: "Early Risk Prediction",
    body: "Instead of only flagging a bad frame, it watches sustained patterns such as forward-head posture and shoulder asymmetry.",
  },
  {
    title: "Posture Fatigue Detection",
    body: "It recognises gradual worsening over time and signals the moment your posture is trending toward strain.",
  },
  {
    title: "AI Explanation & Micro-Break Guidance",
    body: "Users receive plain-language feedback, short corrective exercises, and adaptive resets when risk increases.",
  },
];

export function PersonalisationSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Why personalisation matters</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your baseline, not a generic threshold.
          </h2>
          <ul className="mt-6 space-y-4">
            {POINTS.map((point) => (
              <li key={point} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                <span className="text-sm leading-relaxed text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center rounded-3xl border border-border bg-card p-10 shadow-sm">
          <div className="absolute left-6 top-6">
            <DemoDataBadge />
          </div>
          <div className="flex flex-col items-center gap-6">
            <CircularScore value={82} label="Spine Health Score" sublabel="Personalised baseline" size={180} />
            <div className="grid w-full grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Head baseline</p>
                <p className="text-sm font-semibold text-foreground">4.2° deviation</p>
              </div>
              <div className="rounded-xl bg-muted p-3">
                <p className="text-xs text-muted-foreground">Shoulder baseline</p>
                <p className="text-sm font-semibold text-foreground">1.6° deviation</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {VISION_POINTS.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
