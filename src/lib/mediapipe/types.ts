import type { PoseFrame } from "@/types/posture";

/**
 * Abstraction over "something that produces PoseFrames".
 *
 * Two implementations exist:
 *  - DemoPoseProvider: deterministic, synthetic landmarks — always available,
 *    used whenever the app is in Demo Mode or when the real provider fails.
 *  - BlazePoseProvider: wraps @mediapipe/tasks-vision's PoseLandmarker
 *    running against a live <video> element (webcam), matching the
 *    project report's "MediaPipe BlazePose" sensing layer.
 *
 * The Live Monitor UI only talks to this interface, so a future Python/
 * FastAPI-backed provider (e.g. streaming server-side inference results
 * over WebSocket) can be added later without touching page components.
 */
export interface PoseProvider {
  readonly kind: "demo" | "blazepose";
  init(video: HTMLVideoElement): Promise<void>;
  start(onFrame: (frame: PoseFrame) => void): void;
  stop(): void;
  dispose(): void;
}

export class PoseProviderError extends Error {
  code: "camera-permission-denied" | "camera-unavailable" | "model-unavailable" | "no-person" | "unknown";
  constructor(code: PoseProviderError["code"], message: string) {
    super(message);
    this.code = code;
    this.name = "PoseProviderError";
  }
}
