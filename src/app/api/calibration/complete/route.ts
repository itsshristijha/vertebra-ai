import { NextResponse } from "next/server";
import { getPersonalBaseline } from "@/lib/demo/data";

/**
 * POST /api/calibration/complete
 * Would persist the computed PersonalBaseline (anthropometric normalisation
 * + enrolment scan results, see Chapter 4 "User Enrolment & Personal
 * Baseline") to a database. Returns the demo baseline here.
 */
export async function POST() {
  return NextResponse.json(getPersonalBaseline());
}
