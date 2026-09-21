import type { Metadata } from "next";
import { Apple, Brain, Check, CircleAlert, HeartPulse, Leaf, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { RecipeBrowser } from "@/components/diet/RecipeBrowser";
import { HydrationTracker } from "@/components/diet/HydrationTracker";

export const metadata: Metadata = { title: "Diet & Wellbeing" };

const EAT_MORE = [
  ["Protein at each meal", "Dal, beans, eggs, fish, tofu, yogurt or chicken help support muscle maintenance."],
  ["Colourful plants", "Leafy greens, berries, citrus, tomatoes and peppers add fibre and a range of micronutrients."],
  ["Calcium and vitamin D foods", "Yogurt, milk or fortified alternatives, tofu and fish with edible bones can support bone health."],
  ["Healthy fats and hydration", "Nuts, seeds, olive or mustard oil, and regular water intake support energy and routine recovery."],
];

const LIMIT = [
  "Very salty packaged foods and frequent sugary drinks.",
  "Highly processed snacks that replace balanced meals.",
  "Alcohol excess, which can affect sleep, mood and recovery.",
  "Extreme restrictive diets or supplement megadoses without professional guidance.",
];

const WELLBEING = [
  ["Eat on a rhythm", "Regular meals can make energy and concentration feel steadier. Avoid judging a day by one meal."],
  ["Build a calming pause", "Try 3 minutes of slow breathing, a short walk or a screen break alongside your food routine."],
  ["Protect sleep", "A consistent sleep window and less caffeine late in the day often support mood and recovery more than a new supplement."],
];

export default function DietPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl bg-navy px-6 py-8 text-white shadow-xl shadow-slate-300/30 sm:px-8">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-200"><Leaf className="h-3.5 w-3.5" /> Daily wellbeing</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">Food that supports your routine.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">Simple, flexible ideas for spine-supportive eating and mental wellbeing. This is general wellness education, not a treatment plan.</p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Apple className="h-5 w-5 text-emerald-600" /> What to eat more often</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {EAT_MORE.map(([title, body]) => <div key={title} className="rounded-xl bg-emerald-50/70 p-4"><Check className="h-4 w-4 text-emerald-600" /><h2 className="mt-2 text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CircleAlert className="h-5 w-5 text-amber-600" /> What to limit</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {LIMIT.map((item) => <div key={item} className="flex gap-3 rounded-xl bg-amber-50/70 p-4 text-sm text-muted-foreground"><X className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" /><span>{item}</span></div>)}
          </CardContent>
        </Card>
      </div>

      <RecipeBrowser />

      <HydrationTracker />

      <Card className="border-indigo-100 bg-indigo-50/50">
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-indigo-600" /> Mental wellbeing is part of the routine</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">{WELLBEING.map(([title, body]) => <div key={title} className="rounded-xl bg-white/80 p-4"><HeartPulse className="h-4 w-4 text-indigo-600" /><h3 className="mt-2 text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/60"><CardContent className="flex gap-3 p-5 text-xs leading-5 text-amber-900"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><p>Check with a qualified clinician or dietitian before changing your diet if you are pregnant, managing a medical condition, taking medication, or have food allergies. Seek support promptly for persistent low mood, anxiety, or thoughts of self-harm.</p></CardContent></Card>
      <RiskDisclaimer compact />
    </div>
  );
}