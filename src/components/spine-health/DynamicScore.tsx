"use client";

import { useEffect, useState } from "react";
import { CircularScore } from "@/components/charts/CircularScore";
import { getDemoSpineHealthScoreAt } from "@/lib/demo/data";

export function DynamicScore({ initialScore, size = 188 }: { initialScore: number; size?: number }) {
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    const interval = setInterval(() => setScore(getDemoSpineHealthScoreAt()), 2000);
    return () => clearInterval(interval);
  }, []);

  return <CircularScore value={score} label="out of 100" size={size} />;
}