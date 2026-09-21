const BASE = "";

/**
 * SECURITY NOTE: see the app/api/auth route handlers — these are mock endpoints.
 * A production build must never keep auth tokens in plain localStorage
 * long-term without additional protections; this prototype uses
 * sessionStorage purely to demonstrate the client flow.
 */

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Login failed");
  return res.json();
}

export async function register(payload: { name: string; email: string; password: string; age?: number; heightCm?: number; weightKg?: number }) {
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error ?? "Registration failed");
  return res.json();
}
