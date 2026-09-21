import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lightbulb, TrendingUp, AlertTriangle, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { getTrends, getRiskPredictions, getWeeklyReport } from "@/lib/demo/data";

export const metadata: Metadata = { title: "Insights" };

export default function InsightsPage() {
  const trends = getTrends("30d");
  const risks = getRiskPredictions();
  const report = getWeeklyReport();
  const risingRisk = risks.find((r) => r.horizons[3].probability - r.horizons[0].probability > 0.15);

  const insights = [
    {
      icon: TrendingUp,
      category: "Improving",
      tone: "good" as const,
      title: trends.insights.mostImproved,
      body: "Sustained over the last 30 days — keep reinforcing this with regular breaks.",
      href: "/trends",
      cta: "View trend",
    },
    {
      icon: AlertTriangle,
      category: "Needs attention",
      tone: "warning" as const,
      title: trends.insights.needsAttention,
      body: "Consider a standing break or the Thoracic Extension exercise during long sitting blocks.",
      href: "/exercises",
      cta: "See exercises",
    },
    ...(risingRisk
      ? [
          {
            icon: AlertTriangle,
            category: "Risk trend",
            tone: "warning" as const,
            title: `${risingRisk.label} indicator is trending upward over the 12-week horizon`,
            body: "This is a research-prototype estimate — see the full breakdown and explanation before drawing conclusions.",
            href: "/risk",
            cta: "View Risk Outlook",
          },
        ]
      : []),
    {
      icon: Dumbbell,
      category: "Recommendation",
      tone: "neutral" as const,
      title: report.recommendation,
      body: `Most frequent deviation this week: ${report.mostFrequentDeviation}.`,
      href: "/exercises",
      cta: "Open exercise library",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Insights</h1>
          <p className="mt-1 text-sm text-muted-foreground">A synthesized view across your trends, risk outlook and recommendations.</p>
        </div>
        <DemoDataBadge />
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.title}>
            <CardContent className="flex items-start gap-4 p-5">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  insight.tone === "good" ? "bg-emerald-50 text-emerald-600" : insight.tone === "warning" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <insight.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <Badge variant={insight.tone === "good" ? "success" : insight.tone === "warning" ? "warning" : "outline"} className="mb-1.5">
                  {insight.category}
                </Badge>
                <p className="text-sm font-medium text-foreground">{insight.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{insight.body}</p>
                <Link href={insight.href} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  {insight.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 shrink-0" />
            Insights are generated from your demo dataset and refresh as your posture sessions accumulate.
          </CardContent>
        </Card>
      </div>

      <RiskDisclaimer />
    </div>
  );
}
