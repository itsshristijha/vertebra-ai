import {
  Video,
  Crosshair,
  HeartPulse,
  AlertTriangle,
  LineChart,
  Bell,
  Dumbbell,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  { icon: Video, title: "Live Monitor", body: "Real-time skeleton overlay and posture-state feedback from your webcam." },
  { icon: Crosshair, title: "Personal Calibration", body: "A guided enrolment scan builds your own posture baseline." },
  { icon: HeartPulse, title: "Spine Health Score", body: "One interpretable number, broken down into what's driving it." },
  { icon: AlertTriangle, title: "Risk Outlook", body: "2–12 week research-prototype indicators, never a diagnosis." },
  { icon: Sparkles, title: "Explainability", body: "See which joint, magnitude and duration drove a change." },
  { icon: LineChart, title: "Trends", body: "Daily and weekly charts across score, load and alignment." },
  { icon: Bell, title: "Low-frequency Nudges", body: "Gentle reminders designed to avoid alert fatigue." },
  { icon: Dumbbell, title: "Exercise Library", body: "Targeted mobility exercises for neck, shoulders and upper back." },
  { icon: ShieldCheck, title: "Privacy by Design", body: "Local-first processing and full control over stored data." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Features</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need to understand daily posture behaviour.
        </h2>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
