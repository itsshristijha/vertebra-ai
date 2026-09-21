import type { Metadata } from "next";
import {
  Eye,
  ScanLine,
  Box,
  Watch,
  Ruler,
  BrainCircuit,
  Sparkles,
  Cpu,
} from "lucide-react";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";

export const metadata: Metadata = { title: "About / Research" };

const TECHNOLOGIES = [
  { icon: Eye, label: "Computer Vision" },
  { icon: ScanLine, label: "MediaPipe BlazePose" },
  { icon: Box, label: "3D Pose Estimation" },
  { icon: Watch, label: "Wearable IMU" },
  { icon: Ruler, label: "Anthropometric Normalisation" },
  { icon: BrainCircuit, label: "Temporal Deep Learning" },
  { icon: Sparkles, label: "Explainable AI" },
  { icon: Cpu, label: "Edge AI" },
];

const TEAM = ["Akshaya Murugan", "Ayushi Taralkar", "Anoushka Sharma", "Shristi Jha"];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">About / Research</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        VERTEBRA-AI is an AI in Healthcare / Health Informatics capstone project.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Developed as a B.Tech Computer Science and Engineering (Health Informatics specialisation) capstone, VERTEBRA-AI focuses on continuous posture
        monitoring and early prediction of spine-disorder risk — moving beyond the conventional objective of
        identifying whether a person is sitting correctly at a particular instant.
      </p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">Technology</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TECHNOLOGIES.map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <t.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">The research gap</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A review of forty studies across five sub-domains — vision-based posture estimation, seat-pressure sensing
          chairs, wearable inertial systems, automated ergonomic risk scoring, and radiographic/MRI analysis of
          spinal disorders — found that existing systems commonly focus on identifying <em>current</em> posture,
          while clinical imaging systems typically assess spinal disorders only after they have developed.
          VERTEBRA-AI is designed around accumulated postural behaviour and future-risk indicators instead, bridging
          posture sensing and clinical risk interpretation through temporal modelling, personal baselines and
          validated ergonomic indices.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This is the research direction proposed by the project team based on their literature survey — it reflects
          a documented gap in the reviewed material, not a universally proven claim, and has not yet undergone
          independent peer review or clinical validation.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">What has and hasn&apos;t been validated</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">Established</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              <li>Research gap and literature review (40 studies, 5 sub-domains)</li>
              <li>Proposed system architecture and functional modules</li>
              <li>Personalisation and clinical-linkage strategy</li>
              <li>Cross-subject evaluation plan</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm font-semibold text-foreground">Not yet established</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
              <li>Final model accuracy, sensitivity, specificity or calibration</li>
              <li>Prospective clinical validation</li>
              <li>A published, shared multi-subject benchmark dataset</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-foreground">Project team</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {TEAM.join(" · ")} — Health Informatics capstone project team.
        </p>
      </section>

      <div className="mt-12">
        <RiskDisclaimer />
      </div>
    </div>
  );
}
