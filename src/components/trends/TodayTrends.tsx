"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Camera, Radio } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { useAppStore } from "@/lib/store/appStore";
import { useLiveMonitor } from "@/components/posture/useLiveMonitor";
import type { TrendPoint } from "@/types/health";

export function TodayTrends() {
  const mode = useAppStore((state) => state.mode);
  const { videoRef, features, sessionSeconds } = useLiveMonitor();
  const [scorePoints, setScorePoints] = useState<TrendPoint[]>([]);
  const [loadPoints, setLoadPoints] = useState<TrendPoint[]>([]);

  useEffect(() => {
    if (mode !== "live-ai" || !features) return;
    const now = new Date().toISOString();
    // Sampling the external camera stream into chart history is intentional.
    /* eslint-disable react-hooks/set-state-in-effect */
    setScorePoints((points) => [...points, { date: now, value: Math.max(0, Math.round(100 - features.posturalLoad)) }].slice(-30));
    setLoadPoints((points) => [...points, { date: now, value: features.posturalLoad }].slice(-30));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [features, mode]);

  if (mode !== "live-ai") {
    return <Card className="border-dashed border-sky-200"><CardContent className="flex flex-col items-center p-8 text-center"><Radio className="h-8 w-8 text-sky-600" /><h2 className="mt-3 text-base font-semibold">Today&apos;s live graph needs Live AI</h2><p className="mt-1 max-w-lg text-sm text-muted-foreground">Demo Mode has no real camera record. Switch to Live AI and allow the camera to see posture values measured from your current session.</p><Button className="mt-4" asChild><Link href="/live-monitor"><Camera className="h-4 w-4" /> Open Live Monitor</Link></Button></CardContent></Card>;
  }

  return <div className="space-y-4"><div className="relative overflow-hidden rounded-2xl bg-navy p-4 text-white"><video ref={videoRef} muted playsInline className="absolute right-4 top-4 h-20 w-32 rounded-lg object-cover opacity-80" style={{ transform: "scaleX(-1)" }} /><div className="pr-36"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-200"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> Live today</div><p className="mt-2 text-lg font-semibold">Current camera measurements</p><p className="mt-1 text-xs text-slate-300">{features ? `Session ${Math.floor(sessionSeconds / 60)}m ${sessionSeconds % 60}s · updated now` : "Waiting for a visible person in the camera frame..."}</p></div></div>{features ? <div className="grid gap-4 lg:grid-cols-2"><TrendLineChart series={{ metric: "Live Spine Health Score", unit: "score", range: "7d", points: scorePoints }} color="#2dd4bf" /><TrendLineChart series={{ metric: "Live Postural Load", unit: "load", range: "7d", points: loadPoints }} color="#fbbf24" /></div> : <Card><CardContent className="flex items-center gap-3 p-6 text-sm text-muted-foreground"><Activity className="h-5 w-5 text-sky-600" /> The live graph will begin as soon as the camera detects a person.</CardContent></Card>}</div>;
}