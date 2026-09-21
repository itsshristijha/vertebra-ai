import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/posture/frame
 *
 * Accepts a single computed PostureFeatures payload from the client (never
 * raw video — see the Privacy page and project report's "local processing"
 * requirement). In production, frames would stream to a temporal model
 * (BiLSTM / lightweight Transformer, per Chapter 4.3 module 6) rather than
 * being echoed back.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid frame payload" }, { status: 400 });
  }
  return NextResponse.json({ received: true, echo: body });
}
