import type { Metadata } from "next";
import { Apple, Brain, Check, ChefHat, CircleAlert, Clock3, HeartPulse, Leaf, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";

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

const RECIPES = [
  {
    name: "Turmeric lentil bowl",
    time: "25 min",
    tag: "Protein + fibre",
    ingredients: "Red lentils, spinach, tomato, onion, cumin, turmeric, lemon and brown rice.",
    steps: ["Rinse lentils and simmer with tomato, onion, cumin and turmeric until soft.", "Fold in spinach for the final 2 minutes.", "Serve over brown rice and finish with lemon and a spoon of yogurt if desired."],
  },
  {
    name: "Calm evening yogurt bowl",
    time: "5 min",
    tag: "Simple evening snack",
    ingredients: "Plain yogurt, banana, oats, walnuts or pumpkin seeds and cinnamon.",
    steps: ["Add yogurt to a bowl and top with sliced banana and oats.", "Sprinkle with walnuts or pumpkin seeds and cinnamon.", "Eat slowly and pair with a screen-free wind-down if this is an evening snack."],
  },
  {
    name: "Salmon or tofu tray plate",
    time: "30 min",
    tag: "Omega-3 option",
    ingredients: "Salmon or firm tofu, sweet potato, broccoli, olive oil, pepper and lemon.",
    steps: ["Heat the oven to 200°C and place cubed sweet potato on a tray with a little oil.", "Add salmon or tofu and broccoli after 15 minutes; cook until tender.", "Finish with lemon and serve with water or unsweetened tea."],
  },
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

      <section className="space-y-4">
        <div><h2 className="text-xl font-semibold">Easy recipes</h2><p className="mt-1 text-sm text-muted-foreground">Balanced ideas with short ingredient lists and calm, repeatable instructions.</p></div>
        <div className="grid gap-4 lg:grid-cols-3">
          {RECIPES.map((recipe) => <Card key={recipe.name} className="flex h-full flex-col"><CardContent className="flex h-full flex-col p-5"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><ChefHat className="h-5 w-5" /></span><span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" /> {recipe.time}</span></div><h3 className="mt-4 text-base font-semibold">{recipe.name}</h3><span className="mt-2 w-fit rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-teal-700">{recipe.tag}</span><p className="mt-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Ingredients: </strong>{recipe.ingredients}</p><ol className="mt-4 flex-1 space-y-2 text-xs leading-5 text-muted-foreground">{recipe.steps.map((step, index) => <li key={step} className="flex gap-2"><span className="font-semibold text-indigo-600">{index + 1}.</span>{step}</li>)}</ol></CardContent></Card>)}
        </div>
      </section>

      <Card className="border-indigo-100 bg-indigo-50/50">
        <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-indigo-600" /> Mental wellbeing is part of the routine</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">{WELLBEING.map(([title, body]) => <div key={title} className="rounded-xl bg-white/80 p-4"><HeartPulse className="h-4 w-4 text-indigo-600" /><h3 className="mt-2 text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p></div>)}</CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/60"><CardContent className="flex gap-3 p-5 text-xs leading-5 text-amber-900"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /><p>Check with a qualified clinician or dietitian before changing your diet if you are pregnant, managing a medical condition, taking medication, or have food allergies. Seek support promptly for persistent low mood, anxiety, or thoughts of self-harm.</p></CardContent></Card>
      <RiskDisclaimer compact />
    </div>
  );
}