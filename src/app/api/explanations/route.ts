import { NextRequest, NextResponse } from "next/server";
import { getRiskExplanation } from "@/lib/demo/data";
import type { RiskCondition } from "@/types/risk";

/**
 * GET /api/explanations?condition=forward-head-posture
 * Backed by the Explainability Service described in the project's
 * subsystem list (Chapter 4.5). Returns joint/magnitude/duration/trend
 * attribution used by the /risk/explainability page and the Live Monitor
 * "Why am I seeing this?" panel.
 */
export async function GET(req: NextRequest) {
  const condition = (req.nextUrl.searchParams.get("condition") as RiskCondition) || "forward-head-posture";
  return NextResponse.json(getRiskExplanation(condition));
}
