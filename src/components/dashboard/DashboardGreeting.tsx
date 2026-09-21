"use client";

import { useSessionUser } from "@/lib/auth/sessionUser";

export function DashboardGreeting() {
  const user = useSessionUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">Here&apos;s how your posture has been trending.</p>
    </div>
  );
}