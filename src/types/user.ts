/**
 * User & account related types.
 *
 * NOTE: In this prototype, auth is mocked entirely on the client/Next.js
 * route-handler layer. A production deployment would replace
 * `services/authService.ts` with calls to a real backend (see
 * app/api/auth/* route handlers for where that swap happens) and would
 * never store password hashes or session secrets in the frontend bundle.
 */

export type BiologicalSex = "female" | "male" | "unspecified";

export interface AnthropometricProfile {
  /** centimetres */
  heightCm: number;
  /** kilograms — optional per spec, kept minimal */
  weightKg?: number;
  /** approximate torso length used to normalise CVA / spine-tilt features */
  torsoLengthCm?: number;
  /** approximate shoulder width used to normalise shoulder symmetry */
  shoulderWidthCm?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  anthropometrics: AnthropometricProfile;
  createdAt: string; // ISO date
  hasCompletedOnboarding: boolean;
  hasCalibratedBaseline: boolean;
  imuConnected: boolean;
  privacyModeEnabled: boolean;
}

export interface AuthSession {
  user: User;
  /** opaque mock token — a real backend would issue a signed JWT/session cookie */
  token: string;
}

export interface NotificationSettings {
  postureReminders: boolean;
  breakReminders: boolean;
  weeklyReports: boolean;
  riskTrendChanges: boolean;
  exerciseReminders: boolean;
  /** minutes between low-frequency posture nudges — kept high to avoid alert fatigue */
  reminderFrequencyMinutes: number;
}

export interface PrivacySettings {
  privacyModeEnabled: boolean;
  localProcessingOnly: boolean;
  storeRawVideo: boolean;
  dataRetentionDays: number;
}
