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
  { icon: Crosshair, title: "Personal Posture Digital Twin", body: "Learns your normal neck, shoulder and pelvic alignment so deviations are judged against your baseline, not a generic threshold." },
  { icon: AlertTriangle, title: "Early Risk Prediction", body: "Detects sustained forward-head or asymmetric patterns before they become entrenched habits." },
  { icon: LineChart, title: "Posture Fatigue Detection", body: "Tracks how your posture drifts over time and flags gradual fatigue before the score drops sharply." },
  { icon: Sparkles, title: "AI Why Is My Posture Bad?", body: "Explains the cause in plain language — forward head, shoulder drop, pelvic asymmetry and persistence over time." },
  { icon: Bell, title: "Intelligent Micro-Breaks", body: "Issues short reset prompts only when your posture worsens, avoiding noisy reminders and alert fatigue." },
  { icon: Dumbbell, title: "Corrective Exercise Recommendations", body: "Pairs detected issues with guided actions such as chin tucks, shoulder resets and brief posture walks." },
  { icon: Video, title: "Live Monitor", body: "Real-time skeleton overlay and posture-state feedback from your webcam." },
  { icon: HeartPulse, title: "Spine Health Score", body: "One interpretable number, broken down into what's driving it." },
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
