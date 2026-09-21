/**
 * Risk-prediction & explainability types.
 *
 * SAFETY: these are research-prototype *screening indicators*, never
 * diagnoses. UI copy must always use language such as "risk indicator",
 * "postural deviation", "research-prototype estimate" and must never state
 * that a user "has" a disorder or "will develop" one. See
 * components/risk/RiskDisclaimer.tsx, which every risk-related view renders.
 */

export type RiskCondition =
  | "forward-head-posture"
  | "thoracic-hyperkyphosis"
  | "non-specific-low-back-pain";

export type RiskLevel = "low" | "low-moderate" | "moderate" | "moderate-high" | "high";

export type RiskHorizonWeeks = 2 | 4 | 8 | 12;

export interface RiskHorizonPoint {
  horizonWeeks: RiskHorizonWeeks;
  /** calibrated probability, 0-1 — the report explicitly notes calibration
   * has not yet been established, so this is a *research-prototype*
   * estimate rather than a validated probability. */
  probability: number;
  level: RiskLevel;
}

export interface RiskPrediction {
  condition: RiskCondition;
  label: string;
  currentLevel: RiskLevel;
  horizons: RiskHorizonPoint[];
  summary: string;
  isDemoData: boolean;
}

export interface RiskContribution {
  factor: string;
  region: "head-neck" | "upper-back" | "shoulders" | "pelvis" | "behaviour";
  contributionPercent: number; // signed, can be negative (improving)
}

export interface RiskExplanation {
  condition: RiskCondition;
  headline: string;
  narrative: string;
  contributions: RiskContribution[];
  table: {
    joint: string;
    magnitudeDeg: number;
    durationMinutes: number;
    trend: "worsening" | "improving" | "stable";
  }[];
  generatedAt: string;
  isDemoData: boolean;
}
