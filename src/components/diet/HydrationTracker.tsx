"use client";

import { useMemo, useState } from "react";
import { Bell, Droplets, Minus, Plus, RotateCcw, TimerReset } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Gender = "female" | "male" | "other";

function dailyTarget(age: number, gender: Gender) {
  if (age >= 65) return gender === "male" ? 2500 : 2200;
  if (age < 18) return gender === "male" ? 2400 : 2200;
  return gender === "male" ? 3000 : 2300;
}

function nextReminder() {
  const next = new Date(Date.now() + 60 * 60 * 1000);
  return next.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function HydrationTracker() {
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<Gender>("other");
  const [drunk, setDrunk] = useState(0);
  const [reminderTime, setReminderTime] = useState(nextReminder);
  const target = useMemo(() => dailyTarget(age, gender), [age, gender]);
  const bottleLevel = Math.max(0, 1 - drunk / target);
  const progress = Math.min(100, Math.round((drunk / target) * 100));
  const remaining = Math.max(0, target - drunk);

  function addWater(amount: number) {
    setDrunk((current) => Math.min(target, Math.max(0, current + amount)));
  }

  return (
    <Card className="overflow-hidden border-sky-100">
      <CardHeader className="bg-gradient-to-r from-sky-50 to-teal-50/70">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg"><Droplets className="h-5 w-5 text-sky-600" /> Hydration reminder</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Water supports energy, focus and comfortable movement throughout the day.</p>
          </div>
          <div className="hidden rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 sm:block">Daily estimate</div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-5">
          <div className="relative h-44 w-24 overflow-hidden rounded-b-[1.7rem] rounded-t-xl border-4 border-sky-200 bg-white shadow-inner">
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sky-500 to-cyan-300 transition-all duration-500" style={{ height: `${Math.max(8, bottleLevel * 100)}%` }} />
            <div className="absolute inset-x-2 top-3 h-1 rounded-full bg-sky-100" />
            <div className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-white/75 px-2 py-1 text-xs font-bold text-sky-800">{remaining.toLocaleString()} ml left</span></div>
          </div>
          <div className="mt-4 text-center"><p className="text-sm font-semibold">Today&apos;s water</p><p className="mt-1 text-2xl font-bold text-sky-700">{(drunk / 1000).toFixed(2)} L <span className="text-sm font-medium text-muted-foreground">consumed</span></p><p className="mt-1 text-xs text-muted-foreground">{(remaining / 1000).toFixed(2)} L remaining of {(target / 1000).toFixed(1)} L</p><div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-sky-100"><div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} /></div></div>
        </div>

        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1.5 text-xs font-medium text-muted-foreground">Age
              <input className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-foreground" type="number" min="10" max="100" value={age} onChange={(event) => setAge(Math.min(100, Math.max(10, Number(event.target.value) || 10)))} />
            </label>
            <label className="space-y-1.5 text-xs font-medium text-muted-foreground">Gender reference
              <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm text-foreground" value={gender} onChange={(event) => setGender(event.target.value as Gender)}>
                <option value="female">Female</option><option value="male">Male</option><option value="other">Prefer not to say / other</option>
              </select>
            </label>
          </div>
          <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-4"><p className="text-sm font-semibold text-sky-950">Your estimated daily target</p><p className="mt-1 text-2xl font-bold text-sky-700">{(target / 1000).toFixed(1)} L <span className="text-xs font-medium text-sky-800">({target.toLocaleString()} ml)</span></p><p className="mt-1 text-xs leading-5 text-slate-600">{(drunk / 1000).toFixed(2)} L logged · {(remaining / 1000).toFixed(2)} L left</p><p className="mt-1 text-xs leading-5 text-slate-600">About {Math.ceil(target / 250)} glasses of 250 ml. This is a general fluid estimate, not a medical prescription.</p></div>
          <div className="flex flex-wrap gap-2"><Button size="sm" onClick={() => addWater(250)}><Plus className="h-4 w-4" /> Log 250 ml</Button><Button size="sm" variant="outline" onClick={() => addWater(500)}><Plus className="h-4 w-4" /> Log 500 ml</Button><Button size="sm" variant="ghost" onClick={() => setDrunk(0)}><RotateCcw className="h-4 w-4" /> Reset</Button></div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Bell className="h-4 w-4 text-amber-500" /><span>Next gentle reminder: <strong className="text-foreground">{reminderTime}</strong></span></div><Button size="sm" variant="outline" onClick={() => setReminderTime(nextReminder())}><TimerReset className="h-4 w-4" /> Remind me later</Button></div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Minus className="h-3.5 w-3.5 text-sky-500" /> Drink steadily through the day instead of waiting until you feel thirsty.</div>
        </div>
      </CardContent>
      <div className="border-t border-sky-100 px-5 py-3 text-xs leading-5 text-muted-foreground">Needs vary with body size, exercise, heat, pregnancy, breastfeeding, illness and medication. Ask a clinician about your personal target if you have kidney, heart or fluid-balance concerns.</div>
    </Card>
  );
}