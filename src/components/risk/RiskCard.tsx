import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskPrediction, RiskLevel } from "@/types/risk";
import { cn } from "@/lib/utils";

const LEVEL_STYLES: Record<RiskLevel, { label: string; badge: "muted" | "success" | "warning" | "destructive" }> = {
  low: { label: "Low", badge: "success" },
  "low-moderate": { label: "Low–Moderate", badge: "warning" },
  moderate: { label: "Moderate", badge: "warning" },
  "moderate-high": { label: "Moderate–High", badge: "destructive" },
  high: { label: "High", badge: "destructive" },
};

export function RiskCard({ prediction, horizonWeeks }: { prediction: RiskPrediction; horizonWeeks: number }) {
  const point = prediction.horizons.find((h) => h.horizonWeeks === horizonWeeks) ?? prediction.horizons[0];
  const level = LEVEL_STYLES[point.level];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{prediction.label}</CardTitle>
        <Badge variant={level.badge}>{level.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-1">
          <span className="text-3xl font-semibold tabular-nums text-foreground">{Math.round(point.probability * 100)}%</span>
          <span className="mb-1 text-xs text-muted-foreground">at {horizonWeeks} weeks</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full",
              level.badge === "success" ? "bg-emerald-500" : level.badge === "warning" ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${Math.round(point.probability * 100)}%` }}
          />
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{prediction.summary}</p>
      </CardContent>
    </Card>
  );
}
