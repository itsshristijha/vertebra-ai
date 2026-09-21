"use client";

import { motion } from "framer-motion";
import type { RiskContribution } from "@/types/risk";
import { cn } from "@/lib/utils";

const REGION_POSITIONS: Record<RiskContribution["region"], { x: number; y: number }> = {
  "head-neck": { x: 50, y: 12 },
  "upper-back": { x: 50, y: 30 },
  shoulders: { x: 50, y: 24 },
  pelvis: { x: 50, y: 62 },
  behaviour: { x: 82, y: 45 },
};

export function BodyContributionDiagram({ contributions }: { contributions: RiskContribution[] }) {
  return (
    <div className="relative mx-auto aspect-[3/4] max-w-xs">
      <svg viewBox="0 0 100 130" className="h-full w-full">
        <ellipse cx="50" cy="14" rx="10" ry="12" fill="var(--muted)" />
        <rect x="42" y="24" width="16" height="10" rx="4" fill="var(--muted)" />
        <path d="M30 34 h40 a6 6 0 0 1 6 6 v28 a6 6 0 0 1 -6 6 h-40 a6 6 0 0 1 -6 -6 v-28 a6 6 0 0 1 6 -6 z" fill="var(--muted)" />
        <rect x="18" y="36" width="10" height="42" rx="5" fill="var(--muted)" />
        <rect x="72" y="36" width="10" height="42" rx="5" fill="var(--muted)" />
        <rect x="38" y="74" width="10" height="46" rx="5" fill="var(--muted)" />
        <rect x="52" y="74" width="10" height="46" rx="5" fill="var(--muted)" />
      </svg>

      {contributions.map((c, i) => {
        const pos = REGION_POSITIONS[c.region];
        const size = 26 + Math.min(28, Math.abs(c.contributionPercent) * 1.4);
        const positive = c.contributionPercent >= 0;
        return (
          <motion.div
            key={c.factor}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 16 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-full border-2 text-center shadow-sm",
                positive ? "border-amber-400 bg-amber-50 text-amber-800" : "border-emerald-400 bg-emerald-50 text-emerald-800"
              )}
              style={{ width: size, height: size }}
            >
              <span className="text-[11px] font-semibold leading-none">
                {positive ? "+" : ""}
                {c.contributionPercent}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
