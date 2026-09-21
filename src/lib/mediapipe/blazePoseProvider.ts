import type { PoseFrame, PoseLandmarks } from "@/types/posture";
import type { PoseProvider } from "./types";
import { PoseProviderError } from "./types";

/**
 * Real webcam + MediaPipe BlazePose provider, using @mediapipe/tasks-vision's
 * PoseLandmarker (the browser-runnable successor to the classic MediaPipe
 * Pose solution referenced in the project report). Model + WASM assets are
 * fetched from Google's CDN on first use — if that network call fails (for
 * example, no internet, or the assets are blocked by a network policy),
 * `init()` throws a `PoseProviderError("model-unavailable")` so the caller
 * can fall back to Demo Mode gracefully instead of breaking the page.
 *
 * BlazePose's 33-point topology indices used here follow the public
 * MediaPipe Pose landmark map (0 nose, 2/5 eyes, 7/8 ears, 11/12 shoulders,
 * 23/24 hips).
 */
const LANDMARK_INDEX = {
  nose: 0,
  leftEye: 2,
  rightEye: 5,
  leftEar: 7,
  rightEar: 8,
  leftShoulder: 11,
  rightShoulder: 12,
  leftHip: 23,
  rightHip: 24,
} as const;

type NormalizedLandmark = { x: number; y: number; z: number; visibility?: number };

export class BlazePoseProvider implements PoseProvider {
  readonly kind = "blazepose" as const;
  private video: HTMLVideoElement | null = null;
  private landmarker: unknown = null;
  private running = false;
  private raf: number | null = null;
  private consecutiveMisses = 0;

  async init(video: HTMLVideoElement, existingStream?: MediaStream): Promise<void> {
    this.video = video;

    let stream = existingStream;
    if (!stream) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      } catch (err) {
        const e = err as DOMException;
        if (e.name === "NotAllowedError" || e.name === "SecurityError") {
          throw new PoseProviderError("camera-permission-denied", "Camera permission was denied.");
        }
        throw new PoseProviderError("camera-unavailable", "No camera could be accessed.");
      }
    }
    video.srcObject = stream;
    await video.play().catch(() => {});

    try {
      const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );
      this.landmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });
    } catch {
      throw new PoseProviderError("model-unavailable", "The BlazePose model could not be loaded.");
    }
  }

  start(onFrame: (frame: PoseFrame) => void) {
    if (!this.video || !this.landmarker) return;
    this.running = true;

    const loop = () => {
      if (!this.running || !this.video || !this.landmarker) return;
      const nowMs = performance.now();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (this.landmarker as any).detectForVideo(this.video, nowMs);
      const raw: NormalizedLandmark[] | undefined = result?.landmarks?.[0];

      if (!raw) {
        this.consecutiveMisses++;
        onFrame({
          timestamp: Date.now(),
          landmarks: emptyLandmarks(),
          source: "webcam-live",
          frameQuality: this.consecutiveMisses > 20 ? "no-person" : "partial-occlusion",
        });
      } else {
        this.consecutiveMisses = 0;
        onFrame({
          timestamp: Date.now(),
          landmarks: toPoseLandmarks(raw),
          source: "webcam-live",
          frameQuality: "good",
        });
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  dispose() {
    this.stop();
    const stream = this.video?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.landmarker as any)?.close?.();
    this.landmarker = null;
  }
}

function toPoseLandmarks(raw: NormalizedLandmark[]): PoseLandmarks {
  const get = (i: number) => {
    const p = raw[i];
    return { x: p?.x ?? 0.5, y: p?.y ?? 0.5, z: p?.z ?? 0, visibility: p?.visibility ?? 0 };
  };
  return {
    nose: get(LANDMARK_INDEX.nose),
    leftEye: get(LANDMARK_INDEX.leftEye),
    rightEye: get(LANDMARK_INDEX.rightEye),
    leftEar: get(LANDMARK_INDEX.leftEar),
    rightEar: get(LANDMARK_INDEX.rightEar),
    leftShoulder: get(LANDMARK_INDEX.leftShoulder),
    rightShoulder: get(LANDMARK_INDEX.rightShoulder),
    leftHip: get(LANDMARK_INDEX.leftHip),
    rightHip: get(LANDMARK_INDEX.rightHip),
  };
}

function emptyLandmarks(): PoseLandmarks {
  const zero = { x: 0.5, y: 0.5, z: 0, visibility: 0 };
  return {
    nose: zero,
    leftEye: zero,
    rightEye: zero,
    leftEar: zero,
    rightEar: zero,
    leftShoulder: zero,
    rightShoulder: zero,
    leftHip: zero,
    rightHip: zero,
  };
}
