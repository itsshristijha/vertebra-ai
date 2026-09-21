import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";

export function ResearchApproachSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Research approach</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Positioned as prediction, not classification.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            The VERTEBRA-AI project report reviews forty studies across five sub-domains — vision-based posture
            estimation, seat-pressure sensing chairs, wearable inertial systems, automated ergonomic risk scoring, and
            radiographic/MRI analysis of spinal disorders. Existing systems commonly focus on identifying{" "}
            <em>current</em> posture; VERTEBRA-AI is designed around accumulated postural behaviour and future-risk
            indicators instead.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This is the team&apos;s proposed research direction from a Health Informatics capstone project — not a
            universally proven claim, and not a substitute for peer-reviewed clinical validation.
          </p>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">What has been established</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-4">
              <li>A defined research gap between posture detection and future-risk prediction.</li>
              <li>A proposed multimodal sensing and personalisation strategy.</li>
              <li>A clinical-linkage and explainability plan (CVA, RULA, REBA).</li>
              <li>A cross-subject benchmark and evaluation plan.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">What has not been established yet</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc pl-4">
              <li>Final numerical model accuracy, sensitivity, specificity or calibration.</li>
              <li>Prospective clinical validation or regulatory clearance.</li>
              <li>A published, shared multi-subject benchmark dataset.</li>
            </ul>
          </div>
          <RiskDisclaimer />
        </div>
      </div>
    </section>
  );
}
