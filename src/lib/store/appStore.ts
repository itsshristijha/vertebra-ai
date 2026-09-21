"use client";

/**
 * Global client-side app store (zustand).
 *
 * Holds cross-page UI state that isn't worth threading through props or
 * refetching from the mock API on every navigation: the LIVE AI / DEMO MODE
 * toggle, sensor connection status, and user-editable settings. A real
 * deployment would hydrate parts of this from a backend session on load
 * (see services/*.ts for where those calls would go) instead of the
 * hard-coded demo defaults below.
 */

import { create } from "zustand";
import type { AppMode, CameraStatus, IMUStatus } from "@/types/posture";
import type { NotificationSettings, PrivacySettings } from "@/types/user";

interface AppState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;

  cameraStatus: CameraStatus;
  setCameraStatus: (s: CameraStatus) => void;

  imuStatus: IMUStatus;
  setImuStatus: (s: IMUStatus) => void;

  sidebarOpenMobile: boolean;
  setSidebarOpenMobile: (open: boolean) => void;

  notificationSettings: NotificationSettings;
  updateNotificationSettings: (partial: Partial<NotificationSettings>) => void;

  privacySettings: PrivacySettings;
  updatePrivacySettings: (partial: Partial<PrivacySettings>) => void;

  hasCalibratedBaseline: boolean;
  setHasCalibratedBaseline: (v: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: "demo",
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((s) => ({ mode: s.mode === "demo" ? "live-ai" : "demo" })),

  cameraStatus: "connected",
  setCameraStatus: (cameraStatus) => set({ cameraStatus }),

  imuStatus: "connected",
  setImuStatus: (imuStatus) => set({ imuStatus }),

  sidebarOpenMobile: false,
  setSidebarOpenMobile: (sidebarOpenMobile) => set({ sidebarOpenMobile }),

  notificationSettings: {
    postureReminders: true,
    breakReminders: true,
    weeklyReports: true,
    riskTrendChanges: true,
    exerciseReminders: false,
    reminderFrequencyMinutes: 45,
  },
  updateNotificationSettings: (partial) =>
    set((s) => ({ notificationSettings: { ...s.notificationSettings, ...partial } })),

  privacySettings: {
    privacyModeEnabled: true,
    localProcessingOnly: true,
    storeRawVideo: false,
    dataRetentionDays: 30,
  },
  updatePrivacySettings: (partial) => set((s) => ({ privacySettings: { ...s.privacySettings, ...partial } })),

  hasCalibratedBaseline: true,
  setHasCalibratedBaseline: (hasCalibratedBaseline) => set({ hasCalibratedBaseline }),
}));
