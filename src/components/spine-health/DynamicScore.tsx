"use client";

import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DynamicScore({ initialScore, size = 188 }: { initialScore: number; size?: number }) {
  void initialScore;
  void size;
  return <div className="flex max-w-xs flex-col items-center gap-3 rounded-2xl border border-dashed border-amber-200 bg-amber-50/70 p-6 text-center"><Radio className="h-8 w-8 text-amber-600" /><p className="text-sm font-semibold text-amber-950">No verified live score yet</p><p className="text-xs leading-5 text-amber-900/75">Start Live Monitor to calculate posture from your camera. Demo values are not presented as real measurements.</p><Button size="sm" asChild><Link href="/live-monitor">Start Live Monitor <ArrowRight className="h-4 w-4" /></Link></Button></div>;
}