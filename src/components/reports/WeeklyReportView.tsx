"use client";

import { useState } from "react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Share2, Check, FileClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StateBanner } from "@/components/ui/state-banner";
import { DemoDataBadge } from "@/components/posture/DemoDataBadge";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { formatDateShort } from "@/lib/utils";
import { useAppStore } from "@/lib/store/appStore";
import type { WeeklyReport } from "@/types/health";
import { ReportExportPanel } from "@/components/reports/ReportExportPanel";

export function WeeklyReportView({ report }: { report: WeeklyReport }) {
  const [copied, setCopied] = useState(false);
  const hasCalibratedBaseline = useAppStore((s) => s.hasCalibratedBaseline);

  if (!hasCalibratedBaseline) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your Weekly Spine Health Report</h1>
        <StateBanner
          icon={FileClock}
          title="Insufficient data for a weekly report"
          description="A full week of posture sessions is needed to generate a report. Complete calibration to get started."
          action={
            <Button asChild size="sm">
              <Link href="/calibration">Go to Calibration</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (report.isDemoData) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your Weekly Spine Health Report</h1>
          <p className="mt-1 text-sm text-muted-foreground">Verified history is required before a report can be generated.</p>
        </div>
        <StateBanner
          icon={FileClock}
          title="No verified historical data yet"
          description="This prototype does not turn demo values into a personal report. Complete real camera sessions in Live Monitor and connect a persistent data backend before using weekly trends or averages."
          action={<Button asChild size="sm"><Link href="/live-monitor">Start Live Monitor</Link></Button>}
        />
        <ReportExportPanel report={report} disabled />
        <RiskDisclaimer />
      </div>
    );
  }

  async function shareReport() {
    const text = `VERTEBRA-AI Weekly Report — Spine Health Score ${report.averageSpineHealthScore}, trend ${report.overallTrend.toLowerCase()}. Demo data — research prototype.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "VERTEBRA-AI Weekly Report", text });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your Weekly Spine Health Report</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatDateShort(report.weekStart)} – {formatDateShort(report.weekEnd)}
          </p>
        </div>
        <DemoDataBadge />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryTile label="Overall Trend" value={report.overallTrend} badgeTone={report.overallTrend === "Improving" ? "success" : report.overallTrend === "Stable" ? "outline" : "warning"} />
        <SummaryTile label="Average Spine Health Score" value={String(report.averageSpineHealthScore)} />
        <SummaryTile label="Total Sitting Time" value={`${report.totalSittingTimeHours}h`} />
        <SummaryTile label="Most Frequent Deviation" value={report.mostFrequentDeviation} />
        <SummaryTile label="Weekly Change" value={`${report.weeklyChangePercent >= 0 ? "+" : ""}${report.weeklyChangePercent}%`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Spine Health Score</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={report.dailyScores} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tickFormatter={formatDateShort} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={32} />
              <Tooltip labelFormatter={(v) => formatDateShort(v as string)} contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#4338ca" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <ReportExportPanel report={report} />

      <Card>
        <CardContent className="p-6">
          <p className="text-sm font-semibold text-foreground">Recommendation</p>
          <p className="mt-1 text-sm text-muted-foreground">{report.recommendation}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline" onClick={shareReport}>
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied to clipboard" : "Share Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <RiskDisclaimer />
    </div>
  );
}

function SummaryTile({ label, value, badgeTone }: { label: string; value: string; badgeTone?: "success" | "warning" | "outline" }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {badgeTone ? (
          <Badge variant={badgeTone} className="mt-2 text-sm">
            {value}
          </Badge>
        ) : (
          <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}
