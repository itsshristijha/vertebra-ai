import type { RiskCondition } from "@/types/risk";

const BASE = "";

export async function fetchRiskPredictions() {
  const res = await fetch(`${BASE}/api/risk`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load risk predictions");
  return res.json();
}

export async function fetchExplanation(condition: RiskCondition = "forward-head-posture") {
  const res = await fetch(`${BASE}/api/explanations?condition=${condition}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load explanation");
  return res.json();
}
