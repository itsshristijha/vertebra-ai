import type { Metadata } from "next";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BodyContributionDiagram } from "@/components/risk/BodyContributionDiagram";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getRiskExplanation } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Explainability" };

const TREND_ICON = { worsening: TrendingUp, improving: TrendingDown, stable: Minus } as const;
const TREND_COLOR = { worsening: "text-red-600", improving: "text-emerald-600", stable: "text-muted-foreground" } as const;

export default function ExplainabilityPage() {
  const explanation = getRiskExplanation("forward-head-posture");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{explanation.headline}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Explainable attribution behind your Forward Head Posture indicator.</p>
        </div>
        <DemoDataBadge />
      </div>

      <Card>
        <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
          <BodyContributionDiagram contributions={explanation.contributions} />
          <div className="space-y-4">
            {explanation.contributions.map((c) => (
              <div key={c.factor} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <span className="text-sm font-medium text-foreground">{c.factor}</span>
                <span className={c.contributionPercent >= 0 ? "text-sm font-semibold text-amber-700" : "text-sm font-semibold text-emerald-700"}>
                  {c.contributionPercent >= 0 ? "+" : ""}
                  {c.contributionPercent}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Explanation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{explanation.narrative}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contributing factors in detail</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-3 font-medium">Joint</th>
                <th className="pb-3 font-medium">Magnitude</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {explanation.table.map((row) => {
                const Icon = TREND_ICON[row.trend];
                return (
                  <tr key={row.joint} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-foreground">{row.joint}</td>
                    <td className="py-3 pr-4 tabular-nums text-muted-foreground">{row.magnitudeDeg}°</td>
                    <td className="py-3 pr-4 tabular-nums text-muted-foreground">{row.durationMinutes} min</td>
                    <td className={`py-3 flex items-center gap-1.5 capitalize ${TREND_COLOR[row.trend]}`}>
                      <Icon className="h-3.5 w-3.5" /> {row.trend}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <RiskDisclaimer />
    </div>
  );
}
