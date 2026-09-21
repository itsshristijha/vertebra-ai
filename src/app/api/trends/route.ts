import { NextRequest, NextResponse } from "next/server";
import { getTrends } from "@/lib/demo/data";
import type { TrendRange } from "@/types/health";

/**
 * GET /api/trends?range=7d|30d|90d
 * Backed by the demo dataset's deterministic series generator. A real
 * backend would query stored PostureSession/PostureFeatures rows.
 */
export async function GET(req: NextRequest) {
  const range = (req.nextUrl.searchParams.get("range") as TrendRange) || "7d";
  return NextResponse.json(getTrends(range));
}
