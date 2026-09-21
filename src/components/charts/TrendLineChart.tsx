"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/utils";
import type { TrendSeries } from "@/types/health";

export function TrendLineChart({ series, color = "#4338ca", height = 220 }: { series: TrendSeries; color?: string; height?: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{series.metric}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series.points} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDateShort}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              minTickGap={24}
            />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip
              labelFormatter={(v) => formatDateShort(v as string)}
              contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.25} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
