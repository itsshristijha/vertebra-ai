/**
 * Deterministic demo dataset.
 *
 * VERTEBRA-AI must work end-to-end even without a webcam, an IMU or a real
 * ML backend (see project brief "DEMO MODE"). Every value returned from
 * here is clearly synthetic and is always surfaced in the UI with a
 * "Demo Data" label — never presented as a live AI prediction.
 *
 * All numbers are generated with a seeded PRNG (mulberry32) rather than
 * Math.random(), so the exact same values are produced on the server
 * (route handlers) and the client (initial render), which avoids React
 * hydration mismatches and gives the "demo dataset" a consistent, stable
 * identity across a session.
 *
 * The project report explicitly states that final experimental accuracy,
 * calibration and latency have not yet been established (Chapter 5.6) —
 * nothing here should ever be read as a validated result.
 */

import { mulberry32, round, clamp } from "@/lib/utils";
import type { TrendPoint, TrendRange, TrendData, SpineHealthScore, WeeklyReport, Exercise } from "@/types/health";
import type { RiskPrediction, RiskExplanation, RiskCondition } from "@/types/risk";
import type { PersonalBaseline, IMUReading } from "@/types/posture";
import type { User } from "@/types/user";
import { calculateSpineHealthScore, calculateTrend } from "@/lib/posture/calculations";

const SEED = 190426; // fixed seed => fixed demo dataset
const DAY_MS = 24 * 60 * 60 * 1000;

export const DEMO_DISCLAIMER =
  "VERTEBRA-AI is a research and wellness prototype. It does not diagnose spinal disorders or replace professional medical assessment.";

export const DEMO_USER: User = {
  id: "demo-user-001",
  name: "Sukant",
  email: "sukant8586jha@gmail.com",
  age: 22,
  anthropometrics: { heightCm: 175, shoulderWidthCm: 42, torsoLengthCm: 58 },
  createdAt: "2026-08-01T00:00:00.000Z",
  hasCompletedOnboarding: true,
  hasCalibratedBaseline: true,
  imuConnected: true,
  privacyModeEnabled: true,
};

export function getPersonalBaseline(): PersonalBaseline {
  return {
    id: "baseline-001",
    userId: DEMO_USER.id,
    capturedAt: "2026-08-02T09:14:00.000Z",
    headPositionBaselineDeg: 4.2,
    shoulderAlignmentBaselineDeg: 1.6,
    spineOrientationBaselineDeg: 2.1,
    craniovertebralAngleBaselineDeg: 54.5,
    qualityScore: 92,
  };
}

/** Generates a smooth, mildly-improving daily series so charts look like a real trend rather than noise. */
function generateSeries(days: number, base: number, amplitude: number, driftPerDay: number, seedOffset: number) {
  const rand = mulberry32(SEED + seedOffset);
  const points: TrendPoint[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * DAY_MS);
    const dayIndex = days - 1 - i;
    const weekday = date.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? amplitude * 0.15 : 0;
    const noise = (rand() - 0.5) * amplitude * 0.5;
    const wave = Math.sin(dayIndex / 4.2) * amplitude * 0.3;
    const value = base + driftPerDay * dayIndex + wave + noise - weekendDip;
    points.push({ date: date.toISOString().slice(0, 10), value: round(clamp(value, 0, 100), 1) });
  }
  return points;
}

function rangeToDays(range: TrendRange) {
  return range === "7d" ? 7 : range === "30d" ? 30 : 90;
}

export function getTrends(range: TrendRange): TrendData {
  const days = rangeToDays(range);
  const spineHealthScore = generateSeries(days, 71, 10, 0.14, 1);
  const posturalLoad = generateSeries(days, 46, 14, -0.12, 2).map((p) => ({ ...p, value: round(clamp(p.value, 5, 95)) }));
  const sittingDurationMinutes = generateSeries(days, 230, 60, 0.2, 3).map((p) => ({
    ...p,
    value: Math.round(clamp(p.value * 4.2, 90, 520)),
  }));
  const headAlignment = generateSeries(days, 78, 12, 0.15, 4);
  const shoulderSymmetry = generateSeries(days, 85, 8, 0.05, 5);

  return {
    spineHealthScore: { metric: "Spine Health Score", unit: "score", range, points: spineHealthScore },
    posturalLoad: { metric: "Postural Load", unit: "load", range, points: posturalLoad },
    sittingDurationMinutes: { metric: "Sitting Duration", unit: "minutes", range, points: sittingDurationMinutes },
    headAlignment: { metric: "Head Alignment", unit: "score", range, points: headAlignment },
    shoulderSymmetry: { metric: "Shoulder Symmetry", unit: "score", range, points: shoulderSymmetry },
    insights: {
      mostImproved: "Head Alignment (+9% over the period)",
      needsAttention: "Postural Load during long afternoon sitting blocks",
      bestDay: formatBestDay(spineHealthScore),
    },
    isDemoData: true,
  };
}

function formatBestDay(points: TrendPoint[]) {
  const best = points.reduce((a, b) => (b.value > a.value ? b : a), points[0]);
  return new Date(best.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function getSpineHealthScore(): SpineHealthScore {
  const breakdown = {
    headAlignment: 86,
    shoulderSymmetry: 91,
    spineAlignment: 78,
    posturalLoad: 26, // stored as "load" so downstream inversion happens in calculateSpineHealthScore
    sittingBehaviour: 80,
  };
  return {
    score: calculateSpineHealthScore(breakdown),
    computedAt: new Date().toISOString(),
    breakdown,
    contributingFactors: [
      "Forward head deviation during extended screen sessions",
      "Prolonged sitting duration in the afternoon block",
      "Mild shoulder asymmetry during typing posture",
    ],
    isDemoData: true,
  };
}

export function getDashboardSummary() {
  const health = getSpineHealthScore();
  return {
    spineHealthScore: health.score,
    currentPosture: "Mostly Neutral" as const,
    posturalLoad: "Low" as const,
    sittingTimeMinutes: 258,
    weeklyChangePercent: 8,
    cameraStatus: "connected" as const,
    imuStatus: "connected" as const,
    privacyStatus: "protected" as const,
    isDemoData: true,
  };
}

const RISK_META: Record<RiskCondition, { label: string; summary: string }> = {
  "forward-head-posture": {
    label: "Forward Head Posture",
    summary:
      "Research-prototype risk indicator based on sustained craniovertebral-angle deviation and screen-time patterns.",
  },
  "thoracic-hyperkyphosis": {
    label: "Thoracic Hyperkyphosis",
    summary: "Research-prototype risk indicator based on upper-back curvature and shoulder-position trends.",
  },
  "non-specific-low-back-pain": {
    label: "Non-specific Low Back Pain",
    summary: "Research-prototype risk indicator based on pelvic tilt, sitting duration and postural load trends.",
  },
};

export function getRiskPredictions(): RiskPrediction[] {
  const configs: { condition: RiskCondition; currentLevel: RiskPrediction["currentLevel"]; base: number; slope: number }[] = [
    { condition: "forward-head-posture", currentLevel: "moderate", base: 0.32, slope: 0.055 },
    { condition: "thoracic-hyperkyphosis", currentLevel: "low", base: 0.12, slope: 0.02 },
    { condition: "non-specific-low-back-pain", currentLevel: "low-moderate", base: 0.21, slope: 0.03 },
  ];
  const horizonWeeks = [2, 4, 8, 12] as const;
  return configs.map((c) => ({
    condition: c.condition,
    label: RISK_META[c.condition].label,
    currentLevel: c.currentLevel,
    summary: RISK_META[c.condition].summary,
    horizons: horizonWeeks.map((w) => {
      const probability = round(clamp(c.base + c.slope * (w / 4), 0.03, 0.85), 2);
      return { horizonWeeks: w, probability, level: probabilityToLevel(probability) };
    }),
    isDemoData: true,
  }));
}

function probabilityToLevel(p: number): RiskPrediction["currentLevel"] {
  if (p < 0.15) return "low";
  if (p < 0.3) return "low-moderate";
  if (p < 0.5) return "moderate";
  if (p < 0.65) return "moderate-high";
  return "high";
}

export function getRiskExplanation(condition: RiskCondition = "forward-head-posture"): RiskExplanation {
  return {
    condition,
    headline: "Why did your risk indicator change?",
    narrative:
      "Your recent increase in forward-head deviation, combined with longer sitting periods, contributed to the change in your postural-load indicator. This is a research-prototype estimate, not a diagnosis.",
    contributions: [
      { factor: "Head / Neck position", region: "head-neck", contributionPercent: 18 },
      { factor: "Upper Back curvature", region: "upper-back", contributionPercent: 11 },
      { factor: "Shoulder Alignment", region: "shoulders", contributionPercent: 6 },
      { factor: "Sitting Duration", region: "behaviour", contributionPercent: 9 },
    ],
    table: [
      { joint: "Craniovertebral angle (head/neck)", magnitudeDeg: 8.4, durationMinutes: 46, trend: "worsening" },
      { joint: "Thoracic curvature (upper back)", magnitudeDeg: 5.1, durationMinutes: 31, trend: "stable" },
      { joint: "Shoulder symmetry", magnitudeDeg: 2.3, durationMinutes: 18, trend: "improving" },
      { joint: "Pelvic tilt", magnitudeDeg: 3.6, durationMinutes: 24, trend: "stable" },
    ],
    generatedAt: new Date().toISOString(),
    isDemoData: true,
  };
}

export function getWeeklyReport(): WeeklyReport {
  const trend = getTrends("7d");
  const scoreTrend = calculateTrend(trend.spineHealthScore.points);
  const now = new Date();
  const weekStart = new Date(now.getTime() - 6 * DAY_MS);
  return {
    weekStart: weekStart.toISOString().slice(0, 10),
    weekEnd: now.toISOString().slice(0, 10),
    overallTrend: scoreTrend.direction === "up" ? "Improving" : scoreTrend.direction === "down" ? "Needs Attention" : "Stable",
    averageSpineHealthScore: Math.round(
      trend.spineHealthScore.points.reduce((s, p) => s + p.value, 0) / trend.spineHealthScore.points.length
    ),
    totalSittingTimeHours: round(
      trend.sittingDurationMinutes.points.reduce((s, p) => s + p.value, 0) / 60,
      1
    ),
    mostFrequentDeviation: "Forward Head Posture",
    weeklyChangePercent: 8,
    recommendation: "Take regular posture breaks and perform the suggested mobility exercises.",
    dailyScores: trend.spineHealthScore.points,
    isDemoData: true,
  };
}

export function getIMUReading(): IMUReading {
  return {
    timestamp: Date.now(),
    pitch: 6.4,
    roll: -2.1,
    yaw: 1.8,
    signalQuality: "strong",
    batteryPercent: 78,
    connected: true,
  };
}

export function getAssessmentMetrics() {
  return {
    craniovertebralAngleDeg: 52.4,
    headTiltDeg: 4.8,
    shoulderDifferenceDeg: 2.1,
    spineTiltDeg: 3.4,
    pelvicTiltDeg: 2.9,
    isDemoMeasurement: true,
  };
}

export const EXERCISES: Exercise[] = [
  {
    id: "chin-tucks",
    name: "Chin Tucks",
    category: "neck",
    targets: "Forward-head posture",
    durationLabel: "30 seconds × 3",
    isTimed: true,
    totalSeconds: 30,
    sets: 3,
    mediaUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85",
    mediaAlt: "Person practicing a controlled posture exercise",
    videoUrl: "https://www.youtube.com/results?search_query=physical+therapist+chin+tuck+exercise",
    instructions: [
      "Sit or stand tall with shoulders relaxed.",
      "Gently draw your chin straight back, as if making a double chin.",
      "Hold for 3-5 seconds, keeping your gaze level.",
      "Release slowly and repeat for the set duration.",
    ],
  },
  {
    id: "shoulder-blade-retraction",
    name: "Shoulder Blade Retraction",
    category: "shoulders",
    targets: "Rounded shoulders",
    durationLabel: "10 repetitions × 3",
    isTimed: false,
    reps: 10,
    sets: 3,
    mediaUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=85",
    mediaAlt: "Person exercising with shoulders open",
    videoUrl: "https://www.youtube.com/results?search_query=physical+therapist+shoulder+blade+retraction+exercise",
    instructions: [
      "Sit tall with arms relaxed at your sides.",
      "Squeeze your shoulder blades together and slightly down.",
      "Hold for 2 seconds, then release with control.",
      "Repeat for the target number of repetitions.",
    ],
  },
  {
    id: "thoracic-extension",
    name: "Thoracic Extension",
    category: "upper-back",
    targets: "Upper-back mobility",
    durationLabel: "30 seconds × 3",
    isTimed: true,
    totalSeconds: 30,
    sets: 3,
    mediaUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=85",
    mediaAlt: "Person practicing a mindful mobility pose",
    videoUrl: "https://www.youtube.com/results?search_query=physical+therapist+thoracic+extension+exercise",
    instructions: [
      "Sit tall, hands gently clasped behind your head.",
      "Gently arch your upper back over the top of a chair or foam roller.",
      "Breathe steadily and hold, avoiding lower-back strain.",
      "Return to neutral slowly and repeat.",
    ],
  },
  {
    id: "doorway-chest-stretch",
    name: "Doorway Chest Stretch",
    category: "mobility",
    targets: "Chest tightness contributing to rounded shoulders",
    durationLabel: "20 seconds × 2 per side",
    isTimed: true,
    totalSeconds: 20,
    sets: 2,
    mediaUrl: "https://images.unsplash.com/photo-1597452485677-d7d27fba9ee2?auto=format&fit=crop&w=900&q=85",
    mediaAlt: "Person stretching for mobility",
    videoUrl: "https://www.youtube.com/results?search_query=physical+therapist+doorway+chest+stretch",
    instructions: [
      "Stand in a doorway with forearms on the frame, elbows at shoulder height.",
      "Step forward gently until a mild stretch is felt across the chest.",
      "Hold, breathing normally, then switch sides.",
    ],
  },
  {
    id: "seated-cat-cow",
    name: "Seated Cat-Cow",
    category: "core",
    targets: "Spinal mobility and pelvic tilt awareness",
    durationLabel: "8 repetitions",
    isTimed: false,
    reps: 8,
    sets: 1,
    mediaUrl: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=900&q=85",
    mediaAlt: "Person practicing a seated stretch",
    videoUrl: "https://www.youtube.com/results?search_query=physical+therapist+seated+cat+cow+exercise",
    instructions: [
      "Sit toward the edge of your chair, hands on knees.",
      "Inhale, arch your back and lift your chest (cow).",
      "Exhale, round your spine and tuck your chin (cat).",
      "Move slowly between the two positions.",
    ],
  },
  {
    id: "neck-side-stretch",
    name: "Neck Side Stretch",
    category: "neck",
    targets: "Neck tension from prolonged screen time",
    durationLabel: "20 seconds × 2 per side",
    isTimed: true,
    totalSeconds: 20,
    sets: 2,
    mediaUrl: "https://images.unsplash.com/photo-1603988363607-e1a32f17cdbb?auto=format&fit=crop&w=900&q=85",
    mediaAlt: "Person practicing a gentle neck stretch",
    videoUrl: "https://www.youtube.com/results?search_query=physical+therapist+neck+side+stretch",
    instructions: [
      "Sit tall and gently tilt one ear toward the same shoulder.",
      "Use light hand pressure only if comfortable — never force it.",
      "Hold, breathing steadily, then switch sides.",
    ],
  },
];
