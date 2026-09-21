"use client";

import Link from "next/link";
import { AlertTriangle, CameraOff, HelpCircle, ScanFace, ShieldOff, Timer, VideoOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StateBanner } from "@/components/ui/state-banner";
import { CircularScore } from "@/components/charts/CircularScore";
import { PoseSkeleton, STATIC_DEMO_LANDMARKS } from "@/components/posture/PoseSkeleton";
import { ModeBadge } from "@/components/posture/DemoDataBadge";
import { useAppStore } from "@/lib/store/appStore";
import { useLiveMonitor } from "@/components/posture/useLiveMonitor";
import { postureStateLabel } from "@/lib/posture/calculations";
import { cn } from "@/lib/utils";

function metricLabel(deg: number, goodBelow: number, moderateBelow: number) {
  if (deg <= goodBelow) return { text: "Good", tone: "good" as const };
  if (deg <= moderateBelow) return { text: "Moderate deviation", tone: "warning" as const };
  return { text: "Significant deviation", tone: "bad" as const };
}

export function LiveMonitorView() {
  const mode = useAppStore((s) => s.mode);
  const toggleMode = useAppStore((s) => s.toggleMode);
  const { videoRef, frame, features, postureState, sessionSeconds, error, retry } = useLiveMonitor();

  const minutes = Math.floor(sessionSeconds / 60);
  const seconds = sessionSeconds % 60;

  const landmarks = frame?.landmarks ?? STATIC_DEMO_LANDMARKS;
  const score = features ? Math.max(0, 100 - features.posturalLoad) : 78;

  const head = features ? metricLabel(features.headAlignmentDeg, 4, 9) : null;
  const shoulder = features ? metricLabel(100 - features.shoulderSymmetryDeg, 8, 18) : null;
  const spine = features ? metricLabel(features.spineTiltDeg, 3, 7) : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Live Monitor</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time posture feedback from your webcam.</p>
        </div>
        <button
          onClick={toggleMode}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-1 py-1 text-xs font-semibold"
        >
          <span className={cn("rounded-full px-3 py-1.5", mode === "live-ai" ? "bg-emerald-600 text-white" : "text-muted-foreground")}>LIVE AI</span>
          <span className={cn("rounded-full px-3 py-1.5", mode === "demo" ? "bg-indigo-700 text-white" : "text-muted-foreground")}>DEMO MODE</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-video w-full bg-navy">
            {mode === "live-ai" && (
              <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" style={{ transform: "scaleX(-1)" }} />
            )}

            {!error && (
              <div className="absolute inset-0" style={{ transform: mode === "live-ai" ? "scaleX(-1)" : undefined }}>
                <PoseSkeleton landmarks={landmarks} className="h-full w-full" highlightColor="#5eead4" />
              </div>
            )}

            <div className="absolute left-3 top-3 flex gap-2">
              <ModeBadge mode={mode} />
              {frame?.frameQuality === "partial-occlusion" && (
                <span className="rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-medium text-white">Partial occlusion</span>
              )}
              {frame?.frameQuality === "no-person" && (
                <span className="rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-medium text-white">No person detected</span>
              )}
            </div>

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy p-6">
                <ErrorContent code={error.code} onRetry={retry} />
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Live Posture</CardTitle>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Timer className="h-3.5 w-3.5" /> {minutes}m {seconds.toString().padStart(2, "0")}s
              </span>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-4">
                <CircularScore value={score} size={96} strokeWidth={8} />
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="text-lg font-semibold text-foreground">
                    {postureState ? postureStateLabel(postureState) : "Mostly Neutral"}
                  </p>
                </div>
              </div>

              <dl className="space-y-3">
                <MetricRow label="Head Alignment" value={head?.text ?? "Good"} tone={head?.tone ?? "good"} />
                <MetricRow label="Shoulder Symmetry" value={shoulder?.text ?? "Good"} tone={shoulder?.tone ?? "good"} />
                <MetricRow label="Spine Alignment" value={spine?.text ?? "Moderate deviation"} tone={spine?.tone ?? "warning"} />
                <MetricRow label="Postural Load" value={features ? `${features.posturalLoad < 35 ? "Low" : features.posturalLoad < 65 ? "Moderate" : "High"}` : "Low"} tone={features && features.posturalLoad >= 65 ? "bad" : features && features.posturalLoad >= 35 ? "warning" : "good"} />
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Detected Insight</p>
              <p className="text-sm text-foreground">
                Your head position has moved slightly forward during the last 10 minutes.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/risk/explainability">
                  <HelpCircle className="h-4 w-4" /> Why am I seeing this?
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, tone }: { label: string; value: string; tone: "good" | "warning" | "bad" }) {
  const dot = tone === "good" ? "bg-emerald-500" : tone === "warning" ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center justify-between text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex items-center gap-1.5 font-medium text-foreground">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} /> {value}
      </dd>
    </div>
  );
}

function ErrorContent({ code, onRetry }: { code: string; onRetry: () => void }) {
  const map: Record<string, { icon: typeof CameraOff; title: string; description: string }> = {
    "camera-permission-denied": {
      icon: CameraOff,
      title: "Camera permission denied",
      description: "Allow camera access in your browser settings, then try again — or continue in Demo Mode.",
    },
    "camera-unavailable": {
      icon: VideoOff,
      title: "Camera unavailable",
      description: "No webcam could be found on this device. Try Demo Mode to explore Live Monitor without a camera.",
    },
    "model-unavailable": {
      icon: ShieldOff,
      title: "Model unavailable",
      description: "The BlazePose model couldn't be loaded (likely a network issue). Demo Mode remains fully available.",
    },
    "no-person": {
      icon: ScanFace,
      title: "No person detected",
      description: "Make sure you're within frame and well-lit, then try again.",
    },
    unknown: {
      icon: AlertTriangle,
      title: "Something went wrong",
      description: "An unexpected error occurred while starting Live Monitor.",
    },
  };
  const entry = map[code] ?? map.unknown;
  return (
    <StateBanner
      icon={entry.icon}
      title={entry.title}
      description={entry.description}
      tone="warning"
      className="border-white/10 bg-white/5 text-white [&_svg]:text-white [&_p]:text-white"
      action={
        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}
