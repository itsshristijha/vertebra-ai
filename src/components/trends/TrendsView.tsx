"use client";

import { useState } from "react";
import Link from "next/link";
import { DatabaseZap } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StateBanner } from "@/components/ui/state-banner";
import { useAppStore } from "@/lib/store/appStore";
import type { TrendRange } from "@/types/health";
import { TodayTrends } from "@/components/trends/TodayTrends";

const RANGE_LABEL: Record<TrendRange, string> = { "7d": "7 Days", "30d": "30 Days", "90d": "90 Days" };
type ViewRange = TrendRange | "today";

export function TrendsView() {
  const [range, setRange] = useState<ViewRange>("today");
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

      {range === "today" ? <TodayTrends /> : <>
      <StateBanner
        icon={DatabaseZap}
        title="No verified trend data yet"
        description="There is no stored posture history for this period, so charts and insights are hidden. Start Live AI sessions to create measured records."
        action={<Button asChild size="sm"><Link href="/live-monitor">Start Live Monitor</Link></Button>}
      />
      </>}
    </div>
  );
}
