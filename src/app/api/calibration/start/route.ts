import { NextResponse } from "next/server";

/**
 * POST /api/calibration/start
 * In production this would create a server-side calibration session record
 * tied to the authenticated user. Here it just mints a mock session id so
 * the frontend calibration flow has something to reference.
 */
export async function POST() {
  return NextResponse.json({
    calibrationSessionId: `calib_${Math.random().toString(36).slice(2, 10)}`,
    startedAt: new Date().toISOString(),
  });
}
