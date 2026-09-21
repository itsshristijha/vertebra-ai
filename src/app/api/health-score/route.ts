import { NextResponse } from "next/server";
import { getSpineHealthScore } from "@/lib/demo/data";

/**
 * GET /api/health-score
 * Backed by the demo dataset. A real backend would compute this from the
 * Clinical Risk Layer described in the project architecture (CVA, RULA,
 * REBA-informed features -> calculateSpineHealthScore).
 */
export async function GET() {
  return NextResponse.json(getSpineHealthScore());
}
