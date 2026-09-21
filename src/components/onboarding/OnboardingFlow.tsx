"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Camera,
  CheckCircle2,
  Crosshair,
  ShieldCheck,
  Sparkles,
  Watch,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store/appStore";

const STEP_LABELS = ["Welcome", "How it works", "Camera", "Wearable", "Baseline"];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [cameraState, setCameraState] = useState<"idle" | "granted" | "denied" | "skipped">("idle");
  const [imuState, setImuState] = useState<"idle" | "connected" | "skipped">("idle");
  const setCameraStatus = useAppStore((s) => s.setCameraStatus);
  const setImuStatus = useAppStore((s) => s.setImuStatus);

  const total = STEP_LABELS.length;
  const progressPercent = ((step + 1) / total) * 100;

  async function requestCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setCameraState("granted");
      setCameraStatus("connected");
    } catch {
      setCameraState("denied");
      setCameraStatus("permission-denied");
    }
  }

  function finish() {
    router.push("/calibration");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-teal-500 text-white">
          <Activity className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold text-foreground">VERTEBRA-AI</span>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>
            Step {step + 1} of {total}
          </span>
          <span>{STEP_LABELS[step]}</span>
        </div>
        <Progress value={progressPercent} className="mt-2" />
      </div>

      <div className="mt-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <StepShell
                icon={Sparkles}
                title="Welcome to VERTEBRA-AI"
                description="A short, five-step setup gets your dashboard ready. It takes about two minutes, and every step can be skipped."
              >
                <p className="text-sm leading-relaxed text-muted-foreground">
                  VERTEBRA-AI is a research and wellness prototype. It does not diagnose spinal disorders or replace
                  professional medical assessment.
                </p>
              </StepShell>
            )}

            {step === 1 && (
              <StepShell
                icon={Activity}
                title="How VERTEBRA-AI works"
                description="A quick overview before we turn on your camera."
              >
                <ul className="space-y-3">
                  {[
                    "Your webcam captures 3D body landmarks using MediaPipe BlazePose.",
                    "A short calibration builds your own personal posture baseline.",
                    "Over time, VERTEBRA-AI tracks accumulated postural load — not just single frames.",
                    "You get a Spine Health Score, research-prototype risk indicators, and clear explanations.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" /> {t}
                    </li>
                  ))}
                </ul>
              </StepShell>
            )}

            {step === 2 && (
              <StepShell icon={Camera} title="Camera permission" description="Live posture monitoring needs access to your webcam.">
                <div className="rounded-xl border border-border bg-muted/40 p-5">
                  {cameraState === "idle" && (
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-sm text-muted-foreground">
                        Processing is designed to happen locally in your browser. You can change this anytime in Privacy
                        settings.
                      </p>
                      <div className="flex gap-3">
                        <Button onClick={requestCamera} size="sm">
                          <Camera className="h-4 w-4" /> Allow camera access
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setCameraState("skipped")}>
                          Skip for now
                        </Button>
                      </div>
                    </div>
                  )}
                  {cameraState === "granted" && (
                    <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Camera access granted.
                    </p>
                  )}
                  {cameraState === "denied" && (
                    <p className="flex items-center gap-2 text-sm font-medium text-amber-700">
                      <X className="h-4 w-4" /> Camera permission was denied — you can still use Demo Mode.
                    </p>
                  )}
                  {cameraState === "skipped" && (
                    <p className="text-sm font-medium text-muted-foreground">
                      Skipped — you can enable the camera later from Live Monitor.
                    </p>
                  )}
                </div>
              </StepShell>
            )}

            {step === 3 && (
              <StepShell icon={Watch} title="Optional wearable IMU" description="Adds robustness if your camera view is partially blocked.">
                <div className="rounded-xl border border-border bg-muted/40 p-5">
                  {imuState === "idle" && (
                    <div className="flex flex-col items-start gap-3">
                      <p className="text-sm text-muted-foreground">
                        A single wrist or upper-back IMU is optional. VERTEBRA-AI works from webcam data alone.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() => {
                            setImuState("connected");
                            setImuStatus("connected");
                          }}
                        >
                          <Watch className="h-4 w-4" /> Connect device
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setImuState("skipped");
                            setImuStatus("not-paired");
                          }}
                        >
                          Continue with camera only
                        </Button>
                      </div>
                    </div>
                  )}
                  {imuState === "connected" && (
                    <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Wearable connected (demo).
                    </p>
                  )}
                  {imuState === "skipped" && (
                    <p className="text-sm font-medium text-muted-foreground">Continuing with camera only.</p>
                  )}
                </div>
              </StepShell>
            )}

            {step === 4 && (
              <StepShell icon={Crosshair} title="Personal baseline" description="Last step — a short scan establishes your neutral posture.">
                <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-sm text-indigo-900">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    We&apos;ll now walk you through a guided calibration so posture deviations are measured against{" "}
                    <em>your</em> natural posture, not a generic threshold.
                  </p>
                </div>
              </StepShell>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
          Back
        </Button>
        {step < total - 1 ? (
          <Button onClick={() => setStep((s) => Math.min(total - 1, s + 1))}>Continue</Button>
        ) : (
          <Button onClick={finish}>Start calibration</Button>
        )}
      </div>
    </div>
  );
}

function StepShell({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white">
        <Icon className="h-6 w-6" />
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
