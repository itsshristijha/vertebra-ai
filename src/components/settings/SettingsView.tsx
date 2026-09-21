"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Shield, User, Watch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store/appStore";
import { useSessionUser } from "@/lib/auth/sessionUser";

const NOTIFICATION_ROWS: { key: keyof ReturnType<typeof useAppStore.getState>["notificationSettings"]; label: string; description: string }[] = [
  { key: "postureReminders", label: "Posture reminders", description: "Gentle nudges when a deviation has been sustained." },
  { key: "breakReminders", label: "Break reminders", description: "Reminders to stand up after long sitting blocks." },
  { key: "weeklyReports", label: "Weekly reports", description: "A summary of your Spine Health trend every week." },
  { key: "riskTrendChanges", label: "Risk trend changes", description: "Notify when a risk indicator meaningfully shifts." },
  { key: "exerciseReminders", label: "Exercise reminders", description: "Occasional suggestions from the exercise library." },
];

export function SettingsView() {
  const router = useRouter();
  const notificationSettings = useAppStore((s) => s.notificationSettings);
  const updateNotificationSettings = useAppStore((s) => s.updateNotificationSettings);
  const user = useSessionUser();

  function signOut() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("vertebra_token");
      sessionStorage.removeItem("vertebra_user");
    }
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account, notifications and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-4 w-4" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {NOTIFICATION_ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-sm font-medium text-foreground">{row.label}</Label>
                <p className="text-xs text-muted-foreground">{row.description}</p>
              </div>
              <Switch
                checked={notificationSettings[row.key] as boolean}
                onCheckedChange={(v) => updateNotificationSettings({ [row.key]: v })}
              />
            </div>
          ))}

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">Reminder frequency</Label>
              <span className="text-xs text-muted-foreground">every {notificationSettings.reminderFrequencyMinutes} min</span>
            </div>
            <p className="text-xs text-muted-foreground">Kept low-frequency by design to avoid alert fatigue.</p>
            <Slider
              className="mt-3"
              min={15}
              max={120}
              step={15}
              value={[notificationSettings.reminderFrequencyMinutes]}
              onValueChange={([v]) => updateNotificationSettings({ reminderFrequencyMinutes: v })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Manage local processing, data retention and deletion.</p>
          <Button variant="outline" asChild>
            <Link href="/privacy">Open Privacy settings</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Watch className="h-4 w-4" /> Wearable IMU
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Connect or manage an optional wrist/upper-back IMU.</p>
          <Button variant="outline" asChild>
            <Link href="/imu">Manage wearable</Link>
          </Button>
        </CardContent>
      </Card>

      <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={signOut}>
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
    </div>
  );
}
