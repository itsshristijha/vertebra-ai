import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/posture/session
 * Would persist a completed PostureSession summary (duration, average
 * postural load, dominant state) for use in /trends and /reports. Returns
 * a mock acknowledgement in this prototype.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ saved: true, sessionId: `sess_${Math.random().toString(36).slice(2, 10)}`, ...body });
}
