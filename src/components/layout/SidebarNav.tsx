"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { NAV_ITEMS } from "./navItems";
import { cn } from "@/lib/utils";

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link href="/dashboard" className="flex items-center gap-2 px-6 py-6" onClick={onNavigate}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 text-white shadow-sm">
          <Activity className="h-5 w-5" />
        </span>
        <span className="text-base font-semibold tracking-tight text-white">VERTEBRA-AI</span>
      </Link>

      <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 pb-6 scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-6 rounded-xl bg-white/5 p-4 text-xs text-slate-300">
        <p className="font-medium text-white">Research &amp; wellness prototype</p>
        <p className="mt-1 leading-relaxed">
          VERTEBRA-AI does not diagnose spinal disorders or replace professional medical assessment.
        </p>
      </div>
    </div>
  );
}
