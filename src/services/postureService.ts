import type { TrendRange } from "@/types/health";

/**
 * Thin fetch wrappers around the Next.js route handlers in app/api/.
 * Kept separate from components so the *only* thing that needs to change
 * when a real FastAPI backend replaces these mock endpoints is the base
 * URL / auth header logic below — component code never talks to `fetch`
 * directly.
 */

const BASE = ""; // same-origin route handlers; set to the FastAPI base URL in production

export async function fetchDashboardSummary() {
  const res = await fetch(`${BASE}/api/dashboard`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load dashboard summary");
  return res.json();
}

export async function fetchHealthScore() {
  const res = await fetch(`${BASE}/api/health-score`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load Spine Health Score");
  return res.json();
}

export async function fetchTrends(range: TrendRange) {
  const res = await fetch(`${BASE}/api/trends?range=${range}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load trends");
  return res.json();
}

export async function startCalibration() {
  const res = await fetch(`${BASE}/api/calibration/start`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to start calibration");
  return res.json();
}

export async function completeCalibration() {
  const res = await fetch(`${BASE}/api/calibration/complete`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to complete calibration");
  return res.json();
}

export async function submitPostureFrame(payload: unknown) {
  const res = await fetch(`${BASE}/api/posture/frame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchImuReading() {
  const res = await fetch(`${BASE}/api/imu/data`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load IMU reading");
  return res.json();
}
