import { NextResponse } from "next/server";
import { getIMUReading } from "@/lib/demo/data";

/**
 * GET/POST /api/imu/data
 * GET returns the latest demo IMU reading (pitch/roll/yaw, signal, battery).
 * POST would accept a real reading pushed from a paired wearable's
 * companion process. The app must keep working when this stream is absent
 * ("graceful degradation" — Chapter 3.6).
 */
export async function GET() {
  return NextResponse.json(getIMUReading());
}

export async function POST() {
  return NextResponse.json({ received: true });
}
