/**
 * Pose sensing, feature-engineering and session types.
 *
 * These mirror the pipeline described in the VERTEBRA-AI project report:
 * Webcam + IMU -> Pose/Orientation Extraction -> Synchronisation ->
 * Anthropometric Normalisation -> Feature Fusion -> Temporal Model ->
 * Clinical Risk Layer -> Spine Health Score -> Explainability/Trend/Nudge.
 */

/** A single 3D landmark as produced by a BlazePose-style model. */
export interface Landmark3D {
  x: number;
  y: number;
  z: number;
  /** model confidence for this landmark, 0-1 */
  visibility: number;
}

/**
 * Subset of MediaPipe BlazePose landmark indices actually used by the
 * posture-feature calculations. The full BlazePose topology has 33 points;
 * we only name the ones VERTEBRA-AI's feature set depends on.
 */
export type PoseLandmarkKey =
  | "nose"
  | "leftEar"
  | "rightEar"
  | "leftShoulder"
  | "rightShoulder"
  | "leftHip"
  | "rightHip"
  | "leftEye"
  | "rightEye";

export type PoseLandmarks = Record<PoseLandmarkKey, Landmark3D>;

/** One extracted pose frame, source-tagged so the UI can label demo vs. live output. */
export interface PoseFrame {
  timestamp: number; // epoch ms
  landmarks: PoseLandmarks;
  source: "webcam-live" | "demo-simulated";
  frameQuality: "good" | "partial-occlusion" | "no-person";
}

/** Orientation reading from a single wearable IMU (wrist or upper-back mount). */
export interface IMUReading {
  timestamp: number;
  pitch: number; // degrees
  roll: number; // degrees
  yaw: number; // degrees
  signalQuality: "strong" | "moderate" | "weak" | "lost";
  batteryPercent: number;
  connected: boolean;
}

/** A short enrolment scan establishing the user's own neutral posture. */
export interface PersonalBaseline {
  id: string;
  userId: string;
  capturedAt: string; // ISO date
  headPositionBaselineDeg: number;
  shoulderAlignmentBaselineDeg: number;
  spineOrientationBaselineDeg: number;
  craniovertebralAngleBaselineDeg: number;
  /** 0-100, how consistent the enrolment frames were */
  qualityScore: number;
}

/** Anthropometry-normalised, per-frame posture features. */
export interface PostureFeatures {
  timestamp: number;
  /** Craniovertebral angle in degrees — clinically linked FHP measure. */
  craniovertebralAngleDeg: number;
  headAlignmentDeg: number;
  shoulderSymmetryDeg: number;
  spineTiltDeg: number;
  pelvicTiltDeg: number;
  /** magnitude of deviation from personal baseline, degrees */
  deviationMagnitudeDeg: number;
  /** seconds the current deviation has been sustained */
  deviationDurationSec: number;
  /** composite ergonomic load proxy, 0-100 (higher = more sustained load) */
  posturalLoad: number;
}

export type PostureState = "neutral" | "mild-deviation" | "moderate-deviation" | "significant-deviation";

export interface PostureSession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  durationSec: number;
  averagePosturalLoad: number;
  dominantState: PostureState;
  source: "webcam-live" | "demo-simulated";
  imuAssisted: boolean;
}

export type CameraStatus = "connected" | "unavailable" | "permission-denied" | "no-person" | "partial-occlusion";
export type IMUStatus = "connected" | "disconnected" | "low-signal" | "not-paired";
export type AppMode = "live-ai" | "demo";
