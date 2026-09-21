"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/services/authService";

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", age: "", heightCm: "", weightKg: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        age: form.age ? Number(form.age) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      });
      if (typeof window !== "undefined") sessionStorage.setItem("vertebra_token", token);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Create your account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We keep medical information collection minimal — only what&apos;s needed for anthropometric normalisation.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Doe" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" min={13} max={100} required value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="22" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" type="number" min={100} max={230} required value={form.heightCm} onChange={(e) => update("heightCm", e.target.value)} placeholder="175" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="weight">Weight (kg) — optional</Label>
          <Input id="weight" type="number" min={30} max={250} value={form.weightKg} onChange={(e) => update("weightKg", e.target.value)} placeholder="68" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required autoComplete="new-password" minLength={8} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="At least 8 characters" />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
