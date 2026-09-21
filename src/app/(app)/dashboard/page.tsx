import type { Metadata } from "next";
import { getDashboardSummary, getTrends, DEMO_USER } from "@/lib/demo/data";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { WeeklySnapshotChart } from "@/components/dashboard/WeeklySnapshotChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const summary = getDashboardSummary();
  const trends = getTrends("7d");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back, {DEMO_USER.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s how your posture has been trending.</p>
      </div>

      <DashboardCards summary={summary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklySnapshotChart points={trends.spineHealthScore.points} />
        </div>
        <div className="flex flex-col justify-center gap-3 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-sm font-semibold text-foreground">This week&apos;s insight</h3>
          <p className="text-sm text-muted-foreground">{trends.insights.mostImproved}</p>
          <p className="text-sm text-muted-foreground">Needs attention: {trends.insights.needsAttention}</p>
          <p className="text-sm text-muted-foreground">Best day: {trends.insights.bestDay}</p>
        </div>
      </div>

      <QuickActions />

      <RiskDisclaimer />
    </div>
  );
}
