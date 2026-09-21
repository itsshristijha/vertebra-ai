"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import type { TrendPoint } from "@/types/health";

export function WeeklySnapshotChart({ points }: { points: TrendPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Spine Health Score — last 7 days</CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4338ca" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#4338ca" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              labelFormatter={(v) => formatDateShort(v as string)}
              formatter={(value) => [`${value}`, "Score"]}
              contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
            />
            <Area type="monotone" dataKey="value" stroke="#4338ca" strokeWidth={2} fill="url(#scoreGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
