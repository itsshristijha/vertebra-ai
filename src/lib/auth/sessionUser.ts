"use client";

import { useSyncExternalStore } from "react";
import { DEMO_USER } from "@/lib/demo/data";
import type { User } from "@/types/user";

export const SESSION_USER_KEY = "vertebra_user";

let cachedRaw: string | null = null;
let cachedUser: User = DEMO_USER;

export function readSessionUser(): User {
  if (typeof window === "undefined") return DEMO_USER;
  const stored = sessionStorage.getItem(SESSION_USER_KEY);
  if (!stored) return DEMO_USER;
  try {
    return { ...DEMO_USER, ...JSON.parse(stored) } as User;
  } catch {
    return DEMO_USER;
  }
}

export function useSessionUser() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key === SESSION_USER_KEY) onStoreChange();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    () => {
      const raw = sessionStorage.getItem(SESSION_USER_KEY);
      if (raw === cachedRaw) return cachedUser;
      cachedRaw = raw;
      cachedUser = readSessionUser();
      return cachedUser;
    },
    () => DEMO_USER,
  );
}