import { NextResponse } from "next/server";
import { getWeeklyReport } from "@/lib/demo/data";

/**
 * GET /api/reports/weekly
 * Backed by the Trend and Report Service (Chapter 4.5). A production
 * implementation would generate and cache this weekly (e.g. a scheduled
 * job in the FastAPI backend) rather than computing it on every request.
 */
export async function GET() {
  return NextResponse.json(getWeeklyReport());
}
