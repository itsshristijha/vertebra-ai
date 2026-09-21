"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-teal-600" />
        <h1 className="mt-4 text-xl font-semibold text-foreground">Check your email</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your password.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Reset your password</h1>
      <p className="mt-2 text-sm text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
