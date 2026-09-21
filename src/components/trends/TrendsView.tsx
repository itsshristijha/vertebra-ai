"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Award, DatabaseZap, Sparkles, TrendingDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StateBanner } from "@/components/ui/state-banner";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import { getTrends } from "@/lib/demo/data";
import { useAppStore } from "@/lib/store/appStore";
import type { TrendRange } from "@/types/health";
import { TodayTrends } from "@/components/trends/TodayTrends";

const RANGE_LABEL: Record<TrendRange, string> = { "7d": "7 Days", "30d": "30 Days", "90d": "90 Days" };
type ViewRange = TrendRange | "today";

export function TrendsView() {
  const [range, setRange] = useState<ViewRange>("today");
  const data = useMemo(() => range === "today" ? null : getTrends(range), [range]);
  const hasCalibratedBaseline = useAppStore((s) => s.hasCalibratedBaseline);

  if (!hasCalibratedBaseline) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Trends</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daily and weekly patterns across your posture metrics.</p>
        </div>
        <StateBanner
          icon={DatabaseZap}
          title="No historical data yet"
          description="Complete calibration to establish your baseline — trend charts will populate once posture sessions accumulate."
          action={
            <Button asChild size="sm">
              <Link href="/calibration">Go to Calibration</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Trends</h1>
          <p className="mt-1 text-sm text-muted-foreground">Daily and weekly patterns across your posture metrics.</p>
        </div>
        <DemoDataBadge />
      </div>

      <Tabs value={range} onValueChange={(v) => setRange(v as ViewRange)}>
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          {(Object.keys(RANGE_LABEL) as TrendRange[]).map((r) => (
            <TabsTrigger key={r} value={r}>
              {RANGE_LABEL[r]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {range === "today" ? <TodayTrends /> : data && <>
      <div className="mb-4 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-800">7, 30 and 90 day views require verified stored sessions. These existing charts are demo history and are labelled accordingly.</div>
      <div className="grid gap-4 sm:grid-cols-3">
        <InsightCard icon={Sparkles} label="Most improved" value={data.insights.mostImproved} tone="good" />
        <InsightCard icon={TrendingDown} label="Needs attention" value={data.insights.needsAttention} tone="warning" />
        <InsightCard icon={Award} label="Best day" value={data.insights.bestDay} tone="neutral" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TrendLineChart series={data.spineHealthScore} color="#4338ca" />
        <TrendLineChart series={data.posturalLoad} color="#d97706" />
        <TrendLineChart series={data.headAlignment} color="#0d9488" />
        <TrendLineChart series={data.shoulderSymmetry} color="#2563eb" />
        <div className="lg:col-span-2">
          <TrendLineChart series={data.sittingDurationMinutes} color="#64748b" height={260} />
        </div>
      </div>
      </>}
    </div>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "good" | "warning" | "neutral";
}) {
  const toneClass = tone === "good" ? "bg-emerald-50 text-emerald-600" : tone === "warning" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600";
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-5">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
