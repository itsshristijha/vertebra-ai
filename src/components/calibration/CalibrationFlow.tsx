"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Crosshair, Loader2, ShieldCheck, WifiOff } from "lucide-react";
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            <Crosshair className="h-3.5 w-3.5" /> Personal setup
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Find your neutral position.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Sit naturally while VERTEBRA-AI learns your baseline. Future posture signals are compared with you, not a generic model.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-teal-600" /> Camera frames stay in your session
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
        <Card className="overflow-hidden border-0 bg-navy p-2 shadow-xl shadow-slate-300/40">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius)-0.25rem)] bg-[#071024] sm:aspect-video">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(145deg,#101b40,#071024)]" />
            <PoseSkeleton landmarks={STATIC_DEMO_LANDMARKS} className="absolute inset-0 h-full w-full opacity-95" highlightColor="#5eead4" />
            <div className="absolute inset-[9%] rounded-[1.75rem] border border-dashed border-teal-200/35" />
            <div className="absolute inset-[12%] rounded-[1.35rem] border border-white/10" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
              <span className={`h-2 w-2 rounded-full ${running ? "animate-pulse bg-amber-300" : done ? "bg-teal-300" : "bg-slate-400"}`} />
              {running ? "Reading posture" : done ? "Baseline ready" : "Camera preview"}
            </div>
            <div className="absolute right-5 top-5">
              <DemoDataBadge />
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
              <div className="text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200">Frame yourself</p>
                <p className="mt-1 text-sm font-medium">Keep your shoulders relaxed and both feet grounded.</p>
              </div>
              <div className="shrink-0 rounded-xl border border-white/15 bg-slate-950/50 p-2.5 text-teal-200 backdrop-blur-md">
                <Camera className="h-5 w-5" />
              </div>
            </div>
            {done && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy/75 backdrop-blur-[2px]">
                <div className="text-center text-white">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-400/15 ring-1 ring-teal-300/40">
                    <CheckCircle2 className="h-8 w-8 text-teal-300" />
                  </span>
                  <p className="mt-3 text-base font-semibold">Personal baseline established</p>
                  <p className="mt-1 text-xs text-slate-300">Your neutral posture is ready to use.</p>
                </div>
              </div>
            )}
          </div>
          <div className="px-3 pb-2 pt-3 sm:px-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300">
              <span>Calibration progress</span>
              <span className="text-teal-200">{progress}%</span>
            </div>
            <Progress value={progress} className="mt-2 h-1.5 bg-white/10 [&>div]:bg-teal-300" />
          </div>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardContent className="flex h-full flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 border-b border-border pb-5">
              <div>
                <p className="text-sm font-semibold text-foreground">Calibration steps</p>
                <p className="mt-1 text-xs text-muted-foreground">About 10 seconds</p>
              </div>
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">{activeStepIndex + 1}/4</span>
            </div>
            <ul className="space-y-1 py-5">
              {STEPS.map((step, i) => {
                const complete = done || i < activeStepIndex;
                const active = running && i === activeStepIndex && !done;
                return (
                  <li key={step} className={`relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active ? "bg-indigo-50 text-indigo-900" : complete ? "text-foreground" : "text-muted-foreground"}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${complete ? "bg-teal-100 text-teal-700" : active ? "bg-indigo-600 text-white" : "bg-muted text-muted-foreground"}`}>
                      {complete ? <CheckCircle2 className="h-4 w-4" /> : active ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className="text-xs font-semibold">{i + 1}</span>}
                    </span>
                    <span className={active ? "font-semibold" : ""}>{step}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-auto space-y-3">
              {networkError ? (
                <StateBanner
                  icon={WifiOff}
                  title="Network error"
                  description="Your baseline couldn&apos;t be saved. Check your connection and try again."
                  tone="bad"
                  action={<Button size="sm" onClick={start}>Try again</Button>}
                />
              ) : !done ? (
                <Button onClick={start} disabled={running} className="h-11 w-full shadow-lg shadow-indigo-600/15">
                  {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  {running ? "Calibrating..." : progress > 0 ? "Restart calibration" : "Begin calibration"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <BaselineRow label="Head position" value={`${baseline.headPositionBaselineDeg}° deviation`} />
                    <BaselineRow label="Shoulder alignment" value={`${baseline.shoulderAlignmentBaselineDeg}° deviation`} />
                    <BaselineRow label="Spine orientation" value={`${baseline.spineOrientationBaselineDeg}° deviation`} />
                  </div>
                  <Button className="h-11 w-full" onClick={() => router.push("/dashboard")}>Continue to dashboard</Button>
                </div>
              )}
            </div>
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
