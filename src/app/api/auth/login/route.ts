import { NextRequest, NextResponse } from "next/server";
import { DEMO_USER } from "@/lib/demo/data";

function nameFromEmail(email: string) {
  return email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * POST /api/auth/login
 * Mock login — see security note in app/api/auth/register/route.ts. Any
 * credentials succeed in this prototype and return the demo user profile.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  return NextResponse.json({
    token: `mock_token_${Math.random().toString(36).slice(2, 12)}`,
    user: { ...DEMO_USER, name: nameFromEmail(body.email), email: body.email },
  });
}
