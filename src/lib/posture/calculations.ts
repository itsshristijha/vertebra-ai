/**
 * Posture feature calculations.
 *
 * These functions implement the geometric definitions described in the
 * VERTEBRA-AI project report (Chapter 4/5): joint angles are computed from
 * 3D BlazePose-style landmarks, then normalised against the user's personal
 * baseline (established during calibration) rather than a fixed
 * population-level threshold.
 *
 * IMPORTANT: this module is intentionally isolated from any UI or
 * networking code so it can later be:
 *   1. Unit-tested independently (see Chapter 5.5 "Unit Testing").
 *   2. Swapped out for / validated against the team's actual Python
 *      research implementation without touching the frontend.
 *
 * All functions currently operate on demo/mock landmark data. When a real
 * MediaPipe BlazePose stream is wired in (see lib/mediapipe/), the same
 * functions accept its output because both conform to the `PoseLandmarks`
 * type in types/posture.ts.
 */

import type { PersonalBaseline, PoseLandmarks, PostureFeatures, PostureState } from "@/types/posture";
import type { TrendPoint } from "@/types/health";
import { clamp, round } from "@/lib/utils";

function midpoint(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
}

function angleDeg(dx: number, dy: number) {
  return (Math.atan2(dx, dy) * 180) / Math.PI;
}

/**
 * Craniovertebral angle (CVA) proxy: the angle between the horizontal and
 * the line from the tragus (approximated by ear landmark) to C7 (approximated
 * here by the shoulder midpoint, a common simplification for webcam-only
 * setups without a visible cervical spine marker). Lower CVA is associated
 * with forward head posture in the clinical literature the project report
 * cites (RULA/REBA-linked ergonomic indices).
 */
export function calculateHeadAngle(landmarks: PoseLandmarks): number {
  const ear = midpoint(landmarks.leftEar, landmarks.rightEar);
  const shoulder = midpoint(landmarks.leftShoulder, landmarks.rightShoulder);
  const dx = ear.x - shoulder.x;
  const dy = shoulder.y - ear.y;
  // Convert to a CVA-style angle where ~50-60deg is a commonly cited neutral range.
  const raw = 90 - Math.abs(angleDeg(dx, dy));
  return round(clamp(raw + 50, 25, 75), 1);
}

/** Shoulder symmetry: vertical offset between shoulders, normalised to a 0 (poor) - 100 (perfect) score. */
export function calculateShoulderSymmetry(landmarks: PoseLandmarks): number {
  const dy = Math.abs(landmarks.leftShoulder.y - landmarks.rightShoulder.y);
  const shoulderWidth = Math.max(
    0.05,
    Math.hypot(
      landmarks.leftShoulder.x - landmarks.rightShoulder.x,
      landmarks.leftShoulder.y - landmarks.rightShoulder.y
    )
  );
  const ratio = clamp(dy / shoulderWidth, 0, 1);
  return round(clamp(100 - ratio * 140, 0, 100), 1);
}

/** Spine tilt: lateral deviation of the shoulder midpoint from the hip midpoint, in degrees. */
export function calculateSpineTilt(landmarks: PoseLandmarks): number {
  const shoulder = midpoint(landmarks.leftShoulder, landmarks.rightShoulder);
  const hip = midpoint(landmarks.leftHip, landmarks.rightHip);
  const dx = shoulder.x - hip.x;
  const dy = hip.y - shoulder.y || 0.0001;
  return round(Math.abs(angleDeg(dx, dy)), 1);
}

/** Pelvic tilt proxy: vertical offset between the two hip landmarks, expressed in degrees. */
export function calculatePelvicTilt(landmarks: PoseLandmarks): number {
  const dy = landmarks.leftHip.y - landmarks.rightHip.y;
  const hipWidth = Math.max(
    0.05,
    Math.hypot(landmarks.leftHip.x - landmarks.rightHip.x, landmarks.leftHip.y - landmarks.rightHip.y)
  );
  return round(Math.abs(Math.atan2(dy, hipWidth) * (180 / Math.PI)), 1);
}

/**
 * Postural load: a composite 0-100 ergonomic-load proxy loosely inspired by
 * RULA/REBA scoring logic — it increases with deviation magnitude and with
 * how long a deviation has been sustained, since sustained load (not just
 * instantaneous angle) is what the project targets for prediction.
 */
export function calculatePosturalLoad(deviationMagnitudeDeg: number, deviationDurationSec: number): number {
  const magnitudeComponent = clamp((deviationMagnitudeDeg / 30) * 60, 0, 60);
  const durationComponent = clamp((deviationDurationSec / (30 * 60)) * 40, 0, 40);
  return round(clamp(magnitudeComponent + durationComponent, 0, 100));
}

/**
 * Deviation duration: given a history of boolean "in-deviation" samples at a
 * known sample interval, returns the number of seconds the most recent
 * deviation streak has been sustained. Isolated as a pure function so it can
 * be unit tested against synthetic sequences.
 */
export function calculateDeviationDuration(inDeviationSamples: boolean[], sampleIntervalSec: number): number {
  let streak = 0;
  for (let i = inDeviationSamples.length - 1; i >= 0; i--) {
    if (inDeviationSamples[i]) streak++;
    else break;
  }
  return round(streak * sampleIntervalSec);
}

/**
 * Combines per-feature sub-scores into the overall Spine Health Score.
 * Weights approximate the relative emphasis the report places on head/neck
 * posture (forward-head posture and CVA) versus general sitting behaviour.
 */
export function calculateSpineHealthScore(breakdown: {
  headAlignment: number;
  shoulderSymmetry: number;
  spineAlignment: number;
  posturalLoad: number;
  sittingBehaviour: number;
}): number {
  const weights = {
    headAlignment: 0.28,
    shoulderSymmetry: 0.16,
    spineAlignment: 0.24,
    posturalLoad: 0.2,
    sittingBehaviour: 0.12,
  };
  const posturalLoadScore = 100 - breakdown.posturalLoad; // invert: lower load = higher score
  const composite =
    breakdown.headAlignment * weights.headAlignment +
    breakdown.shoulderSymmetry * weights.shoulderSymmetry +
    breakdown.spineAlignment * weights.spineAlignment +
    posturalLoadScore * weights.posturalLoad +
    breakdown.sittingBehaviour * weights.sittingBehaviour;
  return round(clamp(composite, 0, 100));
}

/** Simple linear trend (percent change from first to last point) used across trend/report views. */
export function calculateTrend(points: TrendPoint[]): { direction: "up" | "down" | "flat"; changePercent: number } {
  if (points.length < 2) return { direction: "flat", changePercent: 0 };
  const first = points[0].value;
  const last = points[points.length - 1].value;
  if (first === 0) return { direction: "flat", changePercent: 0 };
  const changePercent = round(((last - first) / first) * 100, 1);
  return {
    direction: changePercent > 1 ? "up" : changePercent < -1 ? "down" : "flat",
    changePercent,
  };
}

/** Derives a categorical posture state from a computed feature set, relative to a personal baseline. */
export function classifyPostureState(features: PostureFeatures, baseline: PersonalBaseline): PostureState {
  const cvaDelta = Math.abs(features.craniovertebralAngleDeg - baseline.craniovertebralAngleBaselineDeg);
  const combined = cvaDelta + features.deviationMagnitudeDeg * 0.5;
  if (combined < 4) return "neutral";
  if (combined < 9) return "mild-deviation";
  if (combined < 16) return "moderate-deviation";
  return "significant-deviation";
}

export function postureStateLabel(state: PostureState): string {
  switch (state) {
    case "neutral":
      return "Mostly Neutral";
    case "mild-deviation":
      return "Mild Deviation";
    case "moderate-deviation":
      return "Moderate Deviation";
    case "significant-deviation":
      return "Significant Deviation";
  }
}
