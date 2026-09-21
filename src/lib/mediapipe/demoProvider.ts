import type { PoseFrame, PoseLandmarks } from "@/types/posture";
import type { PoseProvider } from "./types";

/**
 * Synthetic pose stream used by Demo Mode. Produces smoothly drifting,
 * time-based landmark positions (not random noise) so the Live Monitor
 * skeleton and metrics animate believably without ever touching a camera.
 * Every frame is tagged `source: "demo-simulated"` and the UI must always
 * label it "Demo Data".
 */
export class DemoPoseProvider implements PoseProvider {
  readonly kind = "demo" as const;
  private raf: number | null = null;
  private startedAt = 0;

  async init(): Promise<void> {
    this.startedAt = performance.now();
  }

  start(onFrame: (frame: PoseFrame) => void) {
    const tick = () => {
      const t = (performance.now() - this.startedAt) / 1000;
      onFrame(this.synthesize(t));
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  dispose() {
    this.stop();
  }

  private synthesize(t: number): PoseFrame {
    // Slow forward-head drift (sine) layered on a gentle idle sway, in
    // normalised [0,1] image coordinates typical of BlazePose output.
    const drift = Math.sin(t / 14) * 0.02 + 0.01;
    const sway = Math.sin(t / 3) * 0.004;
    const breathing = Math.sin(t / 1.6) * 0.002;

    const landmarks: PoseLandmarks = {
      nose: { x: 0.5 + sway, y: 0.22 + drift * 0.4, z: -0.3, visibility: 0.98 },
      leftEye: { x: 0.485 + sway, y: 0.205 + drift * 0.4, z: -0.28, visibility: 0.97 },
      rightEye: { x: 0.515 + sway, y: 0.205 + drift * 0.4, z: -0.28, visibility: 0.97 },
      leftEar: { x: 0.47 + sway + drift, y: 0.215 + drift * 0.5, z: -0.2, visibility: 0.95 },
      rightEar: { x: 0.53 + sway - drift * 0.2, y: 0.215 + drift * 0.5, z: -0.2, visibility: 0.95 },
      leftShoulder: { x: 0.4 + sway * 0.5, y: 0.42 + breathing, z: -0.1, visibility: 0.99 },
      rightShoulder: { x: 0.6 + sway * 0.5, y: 0.418 + breathing, z: -0.1, visibility: 0.99 },
      leftHip: { x: 0.44, y: 0.72, z: 0, visibility: 0.9 },
      rightHip: { x: 0.56, y: 0.718, z: 0, visibility: 0.9 },
    };

    return {
      timestamp: Date.now(),
      landmarks,
      source: "demo-simulated",
      frameQuality: "good",
    };
  }
}
