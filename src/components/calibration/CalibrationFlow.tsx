"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Crosshair, Loader2, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StateBanner } from "@/components/ui/state-banner";
import { PoseSkeleton, STATIC_DEMO_LANDMARKS } from "@/components/posture/PoseSkeleton";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getPersonalBaseline } from "@/lib/demo/data";
import { startCalibration, completeCalibration } from "@/services/postureService";
import { useAppStore } from "@/lib/store/appStore";

const STEPS = ["Sit naturally", "Position yourself in frame", "Maintain neutral posture", "Complete calibration"];

export function CalibrationFlow() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const setHasCalibratedBaseline = useAppStore((s) => s.setHasCalibratedBaseline);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseline = getPersonalBaseline();

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Persists the calibration result through the mock API (see
  // app/api/calibration/*) so the same network path a real FastAPI backend
  // would use is exercised here, error handling included.
  async function finalizeCalibration() {
    try {
      await startCalibration();
      await completeCalibration();
      setDone(true);
      setHasCalibratedBaseline(true);
    } catch {
      setNetworkError(true);
    }
  }

  function start() {
    setRunning(true);
    setDone(false);
    setNetworkError(false);
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 2;
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRunning(false);
          finalizeCalibration();
          return 100;
        }
        return next;
      });
    }, 90);
  }

  const activeStepIndex = Math.min(STEPS.length - 1, Math.floor((progress / 100) * STEPS.length));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white">
          <Crosshair className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">Let&apos;s understand your natural posture.</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          The system creates a personal baseline instead of relying entirely on generic thresholds — deviations are
          later measured against <em>your</em> own neutral posture.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-navy">
            <PoseSkeleton landmarks={STATIC_DEMO_LANDMARKS} className="absolute inset-0 h-full w-full" highlightColor="#5eead4" />
            <div className="absolute inset-6 rounded-2xl border border-dashed border-white/20" />
            <div className="absolute left-3 top-3">
              <DemoDataBadge />
            </div>
            {!done && (
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/40 px-4 py-3 backdrop-blur">
                <div className="flex items-center justify-between text-xs font-medium text-white">
                  <span>Camera preview</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="mt-2 bg-white/20" />
              </div>
            )}
            {done && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/70">
                <div className="text-center text-white">
                  <CheckCircle2 className="mx-auto h-10 w-10 text-teal-300" />
                  <p className="mt-2 text-sm font-semibold">Personal baseline established</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <div>
              <p className="text-sm font-semibold text-foreground">Calibration steps</p>
              <ul className="mt-3 space-y-3">
                {STEPS.map((step, i) => {
                  const complete = done || i < activeStepIndex;
                  const active = running && i === activeStepIndex && !done;
                  return (
                    <li key={step} className="flex items-center gap-2.5 text-sm">
                      {complete ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-indigo-600" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      )}
                      <span className={complete ? "text-foreground" : "text-muted-foreground"}>{step}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {networkError ? (
              <StateBanner
                icon={WifiOff}
                title="Network error"
                description="Your baseline couldn't be saved. Check your connection and try again."
                tone="bad"
                action={
                  <Button size="sm" onClick={start}>
                    Try again
                  </Button>
                }
              />
            ) : !done ? (
              <Button onClick={start} disabled={running} className="w-full">
                {running ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {running ? "Calibrating…" : progress > 0 ? "Restart calibration" : "Begin calibration"}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <BaselineRow label="Head position baseline" value={`${baseline.headPositionBaselineDeg}° deviation`} />
                  <BaselineRow label="Shoulder alignment baseline" value={`${baseline.shoulderAlignmentBaselineDeg}° deviation`} />
                  <BaselineRow label="Spine orientation baseline" value={`${baseline.spineOrientationBaselineDeg}° deviation`} />
                </div>
                <Button className="w-full" onClick={() => router.push("/dashboard")}>
                  Continue
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RiskDisclaimer compact />
    </div>
  );
}

function BaselineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
