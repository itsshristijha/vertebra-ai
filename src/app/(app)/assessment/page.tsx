import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssessmentCamera } from "@/components/assessment/AssessmentCamera";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getAssessmentMetrics } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Assessment" };

export default function AssessmentPage() {
  const metrics = getAssessmentMetrics();

  const METRIC_ROWS = [
    { label: "Craniovertebral Angle", value: `${metrics.craniovertebralAngleDeg}°`, hint: "Lower values are associated with forward head posture" },
    { label: "Head Tilt", value: `${metrics.headTiltDeg}°`, hint: "Lateral deviation from vertical" },
    { label: "Shoulder Difference", value: `${metrics.shoulderDifferenceDeg}°`, hint: "Vertical offset between shoulders" },
    { label: "Spine Tilt", value: `${metrics.spineTiltDeg}°`, hint: "Lateral deviation of shoulder line from hip line" },
    { label: "Pelvic Tilt", value: `${metrics.pelvicTiltDeg}°`, hint: "Vertical offset between hip landmarks" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Assessment</h1>
        <p className="mt-1 text-sm text-muted-foreground">A structured front/side capture for a fuller posture snapshot.</p>
      </div>

      <AssessmentCamera />

      <Card>
        <CardHeader>
          <CardTitle>Measured metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            {METRIC_ROWS.map((row) => (
              <div key={row.label} className="flex items-center justify-between py-3">
                <div>
                  <dt className="text-sm font-medium text-foreground">{row.label}</dt>
                  <dd className="text-xs text-muted-foreground">{row.hint}</dd>
                </div>
                <span className="text-lg font-semibold tabular-nums text-foreground">{row.value}</span>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <RiskDisclaimer />
    </div>
  );
}
