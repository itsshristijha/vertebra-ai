"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store/appStore";
import { DemoPoseProvider, BlazePoseProvider, PoseProviderError, type PoseProvider } from "@/lib/mediapipe";
import type { PoseFrame, PostureFeatures, PostureState } from "@/types/posture";
import {
  calculateHeadAngle,
  calculateShoulderSymmetry,
  calculateSpineTilt,
  calculatePelvicTilt,
  calculatePosturalLoad,
  calculateDeviationDuration,
  classifyPostureState,
} from "@/lib/posture/calculations";
import { getPersonalBaseline } from "@/lib/demo/data";
import { round } from "@/lib/utils";

const SAMPLE_INTERVAL_MS = 200;

export interface LiveMonitorState {
  videoRef: (node: HTMLVideoElement | null) => void;
  frame: PoseFrame | null;
  features: PostureFeatures | null;
  postureState: PostureState | null;
  sessionSeconds: number;
  error: PoseProviderError | null;
  retry: () => void;
}

/**
 * Owns the PoseProvider lifecycle (demo or real BlazePose) and turns raw
 * PoseFrames into PostureFeatures using the isolated calculation functions
 * in lib/posture/calculations.ts. Feature computation is throttled to
 * ~5 samples/sec to keep the UI smooth without re-rendering on every
 * animation frame (see project performance requirements).
 */
export function useLiveMonitor(): LiveMonitorState {
  const mode = useAppStore((s) => s.mode);
  const setCameraStatus = useAppStore((s) => s.setCameraStatus);

  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [frame, setFrame] = useState<PoseFrame | null>(null);
  const [features, setFeatures] = useState<PostureFeatures | null>(null);
  const [postureState, setPostureState] = useState<PostureState | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [error, setError] = useState<PoseProviderError | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  const providerRef = useRef<PoseProvider | null>(null);
  const lastSampleRef = useRef(0);
  const deviationHistoryRef = useRef<boolean[]>([]);
  const deviationStartRef = useRef<number | null>(null);
  const baseline = getPersonalBaseline();

  const videoRef = useCallback((node: HTMLVideoElement | null) => setVideoEl(node), []);
  const retry = useCallback(() => setRetryToken((t) => t + 1), []);

  useEffect(() => {
    // Resetting the timer here (rather than deriving it) is intentional:
    // switching modes or retrying starts a brand-new session, and the
    // interval below is the external timer this effect subscribes to.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionSeconds(0);
    const interval = setInterval(() => setSessionSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [mode, retryToken]);

  useEffect(() => {
    let cancelled = false;
    // Clearing prior provider state before (re)booting a new PoseProvider —
    // necessary imperative synchronization with an external system (camera
    // / model), not state derivable from props.
    /* eslint-disable react-hooks/set-state-in-effect */
    setError(null);
    setFrame(null);
    setFeatures(null);
    /* eslint-enable react-hooks/set-state-in-effect */
    deviationHistoryRef.current = [];
    deviationStartRef.current = null;

    async function boot() {
      if (mode === "live-ai" && !videoEl) return;

      const provider: PoseProvider = mode === "demo" ? new DemoPoseProvider() : new BlazePoseProvider();
      providerRef.current = provider;

      try {
        await provider.init(videoEl as HTMLVideoElement);
        if (cancelled) return;
        setCameraStatus("connected");

        provider.start((f) => {
          const now = performance.now();
          if (now - lastSampleRef.current < SAMPLE_INTERVAL_MS) return;
          lastSampleRef.current = now;
          setFrame(f);

          if (f.frameQuality !== "good") {
            setFeatures(null);
            setPostureState(null);
            return;
          }

          const craniovertebralAngleDeg = calculateHeadAngle(f.landmarks);
          const shoulderSymmetryDeg = calculateShoulderSymmetry(f.landmarks);
          const spineTiltDeg = calculateSpineTilt(f.landmarks);
          const pelvicTiltDeg = calculatePelvicTilt(f.landmarks);
          const headAlignmentDeg = round(Math.abs(craniovertebralAngleDeg - baseline.craniovertebralAngleBaselineDeg), 1);
          const deviationMagnitudeDeg = round(headAlignmentDeg + spineTiltDeg * 0.4, 1);

          const inDeviation = deviationMagnitudeDeg > 6;
          deviationHistoryRef.current.push(inDeviation);
          if (deviationHistoryRef.current.length > 900) deviationHistoryRef.current.shift();
          const deviationDurationSec = calculateDeviationDuration(deviationHistoryRef.current, SAMPLE_INTERVAL_MS / 1000);

          const posturalLoad = calculatePosturalLoad(deviationMagnitudeDeg, deviationDurationSec);

          const computed: PostureFeatures = {
            timestamp: f.timestamp,
            craniovertebralAngleDeg,
            headAlignmentDeg,
            shoulderSymmetryDeg,
            spineTiltDeg,
            pelvicTiltDeg,
            deviationMagnitudeDeg,
            deviationDurationSec,
            posturalLoad,
          };
          setFeatures(computed);
          setPostureState(classifyPostureState(computed, baseline));
        });
      } catch (err) {
        if (cancelled) return;
        const e = err instanceof PoseProviderError ? err : new PoseProviderError("unknown", "Unknown error");
        setError(e);
        if (e.code === "camera-permission-denied") setCameraStatus("permission-denied");
        else if (e.code === "camera-unavailable") setCameraStatus("unavailable");
        else setCameraStatus("unavailable");
      }
    }

    boot();

    return () => {
      cancelled = true;
      providerRef.current?.dispose();
      providerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, videoEl, retryToken]);

  return { videoRef, frame, features, postureState, sessionSeconds, error, retry };
}
