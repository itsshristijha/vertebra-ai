"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { RiskPrediction } from "@/types/risk";

const COLORS: Record<string, string> = {
  "forward-head-posture": "#4338ca",
  "thoracic-hyperkyphosis": "#0d9488",
  "non-specific-low-back-pain": "#d97706",
};

export function RiskTrendChart({ predictions }: { predictions: RiskPrediction[] }) {
  const data = [2, 4, 8, 12].map((w) => {
    const row: Record<string, number | string> = { horizon: `${w}w` };
    predictions.forEach((p) => {
      const point = p.horizons.find((h) => h.horizonWeeks === w);
      row[p.label] = point ? Math.round(point.probability * 100) : 0;
    });
    return row;
  });

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="horizon" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
          <YAxis unit="%" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={40} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {predictions.map((p) => (
            <Line
              key={p.condition}
              type="monotone"
              dataKey={p.label}
              stroke={COLORS[p.condition]}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
