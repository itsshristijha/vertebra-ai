import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircularScore } from "@/components/charts/CircularScore";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getSpineHealthScore } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Spine Health Score" };

const BREAKDOWN_LABELS: Record<string, string> = {
  headAlignment: "Head Alignment",
  shoulderSymmetry: "Shoulder Symmetry",
  spineAlignment: "Spine Alignment",
  posturalLoad: "Postural Load",
  sittingBehaviour: "Sitting Behaviour",
};

export default function SpineHealthPage() {
  const health = getSpineHealthScore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Spine Health Score</h1>
          <p className="mt-1 text-sm text-muted-foreground">A single interpretable summary of today&apos;s posture behaviour.</p>
        </div>
        <DemoDataBadge />
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
          <CircularScore value={health.score} size={188} label="out of 100" />
          <div className="w-full space-y-4">
            {Object.entries(health.breakdown).map(([key, value]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{BREAKDOWN_LABELS[key] ?? key}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {key === "posturalLoad" ? `${value} load` : `${value} / 100`}
                  </span>
                </div>
                <Progress value={key === "posturalLoad" ? 100 - value : value} className="mt-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What influenced your score?</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {health.contributingFactors.map((factor, i) => (
              <li key={factor} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{factor}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <RiskDisclaimer />
    </div>
  );
}
