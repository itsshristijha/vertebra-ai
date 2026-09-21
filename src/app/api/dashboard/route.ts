import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/demo/data";

/**
 * GET /api/dashboard
 *
 * Mock implementation backed by lib/demo/data.ts. In production this would
 * be replaced by a call into the FastAPI backend's session/aggregate
 * endpoint (see project report Chapter 4.4 "Application Layer"), which
 * would read the user's latest posture session, IMU status and privacy
 * settings from a database rather than returning a fixed demo dataset.
 */
export async function GET() {
  return NextResponse.json(getDashboardSummary());
}
