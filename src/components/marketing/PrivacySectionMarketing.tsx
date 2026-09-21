import { Lock, EyeOff, Server, UserCog } from "lucide-react";

const CARDS = [
  { icon: Server, title: "Local Processing", body: "Pose processing can happen on-device rather than sending video to a server." },
  { icon: EyeOff, title: "Minimal Data", body: "Posture features are preferred over raw video storage wherever possible." },
  { icon: Lock, title: "Secure Storage", body: "Sensitive information should be encrypted at rest and in transit." },
  { icon: UserCog, title: "User Control", body: "Pause monitoring and delete stored data at any time." },
];

export function PrivacySectionMarketing() {
  return (
    <section id="privacy" className="bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">Privacy</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your posture data stays yours.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <div key={c.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
