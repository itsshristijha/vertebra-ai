import type { Metadata } from "next";
import { Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PoseSkeleton, STATIC_DEMO_LANDMARKS } from "@/components/posture/PoseSkeleton";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getAssessmentMetrics } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Assessment" };

const SIDE_LANDMARKS = {
  ...STATIC_DEMO_LANDMARKS,
  leftEar: { ...STATIC_DEMO_LANDMARKS.leftEar, x: 0.56 },
  rightEar: { ...STATIC_DEMO_LANDMARKS.rightEar, x: 0.6 },
  nose: { ...STATIC_DEMO_LANDMARKS.nose, x: 0.62 },
  leftShoulder: { ...STATIC_DEMO_LANDMARKS.leftShoulder, x: 0.5 },
  rightShoulder: { ...STATIC_DEMO_LANDMARKS.rightShoulder, x: 0.54 },
};

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-4 w-4" /> Camera Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="front">
            <TabsList>
              <TabsTrigger value="front">Front View</TabsTrigger>
              <TabsTrigger value="side">Side View</TabsTrigger>
            </TabsList>
            <TabsContent value="front">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-navy">
                <PoseSkeleton landmarks={STATIC_DEMO_LANDMARKS} className="absolute inset-0 h-full w-full" highlightColor="#5eead4" />
                <Badge variant="warning" className="absolute left-3 top-3">Demo measurement</Badge>
              </div>
            </TabsContent>
            <TabsContent value="side">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-navy">
                <PoseSkeleton landmarks={SIDE_LANDMARKS} className="absolute inset-0 h-full w-full" highlightColor="#5eead4" />
                <Badge variant="warning" className="absolute left-3 top-3">Demo measurement</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

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
