"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#features", label: "Features" },
  { href: "/#privacy", label: "Privacy" },
  { href: "/about", label: "About / Research" },
];

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 text-white">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold tracking-tight text-white">VERTEBRA-AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Marketing">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-slate-300 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Start Posture Assessment</Link>
          </Button>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-navy px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Marketing mobile">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <Button variant="outline" asChild className="border-white/20 text-white hover:bg-white/10">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Start Posture Assessment</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
