import { NextResponse } from "next/server";
import { getRiskPredictions } from "@/lib/demo/data";

/**
 * GET /api/risk
 *
 * Returns research-prototype risk indicators for Forward Head Posture,
 * Thoracic Hyperkyphosis and Non-specific Low Back Pain across 2/4/8/12
 * week horizons. The project report states that probability calibration
 * has not yet been established — these values are illustrative demo data,
 * never medical predictions.
 */
export async function GET() {
  return NextResponse.json(getRiskPredictions());
}
