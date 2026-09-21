/**
 * Spine Health Score, trends and reporting types.
 *
 * Important: VERTEBRA-AI is a research/wellness prototype. Nothing in this
 * file should be read as clinically validated accuracy — see
 * lib/demo/data.ts and the /about page for the honesty disclaimers
 * required by the project report (Chapter 5: "No final numerical model
 * performance is claimed").
 */

export interface SpineHealthScoreBreakdown {
  headAlignment: number; // 0-100
  shoulderSymmetry: number; // 0-100
  spineAlignment: number; // 0-100
  posturalLoad: number; // 0-100
  sittingBehaviour: number; // 0-100
}

export interface SpineHealthScore {
  score: number; // 0-100 composite
  computedAt: string; // ISO date
  breakdown: SpineHealthScoreBreakdown;
  contributingFactors: string[];
  isDemoData: boolean;
}

export interface TrendPoint {
  date: string; // ISO date (day granularity)
  value: number;
}

export type TrendRange = "7d" | "30d" | "90d";

export interface TrendSeries {
  metric: string;
  unit: string;
  range: TrendRange;
  points: TrendPoint[];
}

export interface TrendData {
  spineHealthScore: TrendSeries;
  posturalLoad: TrendSeries;
  sittingDurationMinutes: TrendSeries;
  headAlignment: TrendSeries;
  shoulderSymmetry: TrendSeries;
  insights: {
    mostImproved: string;
    needsAttention: string;
    bestDay: string;
  };
  isDemoData: boolean;
}

export interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  overallTrend: "Improving" | "Stable" | "Needs Attention";
  averageSpineHealthScore: number;
  totalSittingTimeHours: number;
  mostFrequentDeviation: string;
  weeklyChangePercent: number;
  recommendation: string;
  dailyScores: TrendPoint[];
  isDemoData: boolean;
}

export type ExerciseCategory = "neck" | "shoulders" | "upper-back" | "core" | "mobility";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targets: string;
  durationLabel: string; // e.g. "30 seconds x 3" or "10 reps x 3"
  instructions: string[];
  isTimed: boolean;
  totalSeconds?: number;
  reps?: number;
  sets?: number;
  mediaUrl?: string;
  mediaAlt?: string;
  videoUrl?: string;
}
