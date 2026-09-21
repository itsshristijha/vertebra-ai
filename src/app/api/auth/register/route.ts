import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/register
 *
 * SECURITY NOTE: this is a mock endpoint for prototype/demo purposes only.
 * It does not hash or persist credentials. A real deployment must move
 * registration to a backend with proper password hashing (argon2/bcrypt),
 * server-side session/JWT issuance, and never accept or log raw passwords
 * in a way that reaches client-visible code or logs.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }
  return NextResponse.json({
    token: `mock_token_${Math.random().toString(36).slice(2, 12)}`,
    user: {
      id: `user_${Math.random().toString(36).slice(2, 10)}`,
      name: body.name ?? "New User",
      email: body.email,
      age: body.age ?? null,
      hasCompletedOnboarding: false,
      hasCalibratedBaseline: false,
    },
  });
}
