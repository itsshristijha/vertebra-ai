"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CircularScore({
  value,
  size = 168,
  strokeWidth = 12,
  label,
  sublabel,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  const color = value >= 80 ? "#0d9488" : value >= 60 ? "#4338ca" : value >= 40 ? "#d97706" : "#dc2626";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--muted)" strokeWidth={strokeWidth} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-semibold tabular-nums text-foreground">{Math.round(value)}</span>
        {label && <span className="text-xs text-muted-foreground mt-0.5">{label}</span>}
        {sublabel && <span className="text-[11px] text-muted-foreground/70">{sublabel}</span>}
      </div>
    </div>
  );
}
