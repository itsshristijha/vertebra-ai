"use client";

import { Activity, Clock, Gauge, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DynamicScore } from "@/components/spine-health/DynamicScore";
import { ModeBadge } from "@/components/posture/DemoDataBadge";
import { useAppStore } from "@/lib/store/appStore";
import { formatMinutes, signed } from "@/lib/utils";
import type { getDashboardSummary } from "@/lib/demo/data";

type Summary = ReturnType<typeof getDashboardSummary>;

export function DashboardCards({ summary }: { summary: Summary }) {
  const mode = useAppStore((s) => s.mode);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Spine Health Score</CardTitle>
          <ModeBadge mode={mode} />
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-2">
          <DynamicScore initialScore={summary.spineHealthScore} size={160} />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Composite of head alignment, shoulder symmetry, spine alignment, postural load and sitting behaviour.
          </p>
        </CardContent>
      </Card>

      <StatCard
        icon={Activity}
        title="Current Posture"
        value={summary.currentPosture}
        tone="good"
        footer={<ModeBadge mode={mode} />}
      />
      <StatCard
        icon={Gauge}
        title="Postural Load"
        value={summary.posturalLoad}
        tone={summary.posturalLoad === "Low" ? "good" : "warning"}
        footer={<ModeBadge mode={mode} />}
      />
      <StatCard
        icon={Clock}
        title="Sitting Time"
        value={formatMinutes(summary.sittingTimeMinutes)}
        tone="neutral"
        footer={<span className="text-xs text-muted-foreground">Today, so far</span>}
      />
      <StatCard
        icon={TrendingUp}
        title="Weekly Change"
        value={`${signed(summary.weeklyChangePercent)}%`}
        tone={summary.weeklyChangePercent >= 0 ? "good" : "warning"}
        footer={<span className="text-xs text-muted-foreground">Spine Health Score vs. last week</span>}
      />
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  tone,
  footer,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  tone: "good" | "warning" | "neutral";
  footer: React.ReactNode;
}) {
  const toneClass = tone === "good" ? "text-emerald-600 bg-emerald-50" : tone === "warning" ? "text-amber-600 bg-amber-50" : "text-indigo-600 bg-indigo-50";
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-muted-foreground font-medium">{title}</CardTitle>
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        <div className="mt-2">{footer}</div>
      </CardContent>
    </Card>
  );
}
