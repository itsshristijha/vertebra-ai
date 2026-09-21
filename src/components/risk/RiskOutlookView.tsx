"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskCard } from "./RiskCard";
import { RiskTrendChart } from "./RiskTrendChart";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import type { RiskPrediction, RiskHorizonWeeks } from "@/types/risk";

const HORIZONS: RiskHorizonWeeks[] = [2, 4, 8, 12];

export function RiskOutlookView({ predictions }: { predictions: RiskPrediction[] }) {
  const [horizon, setHorizon] = useState<RiskHorizonWeeks>(4);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Postural Risk Outlook</h1>
          <p className="mt-1 text-sm text-muted-foreground">Research-prototype risk indicators — not medical diagnoses.</p>
        </div>
        <DemoDataBadge />
      </div>

      <Tabs value={String(horizon)} onValueChange={(v) => setHorizon(Number(v) as RiskHorizonWeeks)}>
        <TabsList>
          {HORIZONS.map((h) => (
            <TabsTrigger key={h} value={String(h)}>
              {h} weeks
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {predictions.map((p) => (
          <RiskCard key={p.condition} prediction={p} horizonWeeks={horizon} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk trend across forecast horizons</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskTrendChart predictions={predictions} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Want to know why?</p>
              <p className="text-xs text-muted-foreground">See which joint, magnitude and duration are driving these indicators.</p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/risk/explainability">View Explainability</Link>
          </Button>
        </CardContent>
      </Card>

      <RiskDisclaimer />
    </div>
  );
}
