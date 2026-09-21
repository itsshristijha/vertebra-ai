"use client";

import { useState } from "react";
import { ChefHat, Clock3, Filter, Leaf, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Cuisine = "Indian" | "Chinese" | "Korean" | "Japanese" | "Nepali" | "European";
type Meal = "Breakfast" | "Lunch" | "Snack" | "Dinner";
type Diet = "Veg" | "Non-veg";

type Recipe = {
  name: string;
  cuisine: Cuisine;
  meal: Meal;
  diet: Diet;
  time: string;
  tag: string;
  ingredients: string;
  steps: string[];
};

const RECIPES: Recipe[] = [
  { name: "Moong dal chilla", cuisine: "Indian", meal: "Breakfast", diet: "Veg", time: "20 min", tag: "Protein + fibre", ingredients: "Soaked moong dal, spinach, onion, cumin, ginger and yogurt.", steps: ["Blend soaked dal with ginger, cumin and a splash of water.", "Stir in chopped spinach and onion.", "Cook thin pancakes on a lightly oiled pan and serve with yogurt."] },
  { name: "Grilled fish thali", cuisine: "Indian", meal: "Dinner", diet: "Non-veg", time: "35 min", tag: "Balanced plate", ingredients: "Fish, brown rice, cucumber, dal, lemon and seasonal vegetables.", steps: ["Season fish with lemon, cumin and pepper, then grill until cooked through.", "Serve with a small portion of brown rice, dal and vegetables.", "Add cucumber and water for a fresh side."] },
  { name: "Tofu vegetable congee", cuisine: "Chinese", meal: "Lunch", diet: "Veg", time: "30 min", tag: "Gentle + warming", ingredients: "Rice, tofu, mushrooms, carrots, ginger, spring onion and sesame.", steps: ["Simmer rice with extra water and ginger until soft and creamy.", "Add mushrooms, carrots and tofu for the final 8 minutes.", "Top with spring onion and a few sesame seeds."] },
  { name: "Steamed chicken bao bowl", cuisine: "Chinese", meal: "Dinner", diet: "Non-veg", time: "35 min", tag: "Lean protein", ingredients: "Chicken, cabbage, brown rice, garlic, ginger and low-sodium soy sauce.", steps: ["Steam or pan-cook chicken with garlic and ginger until done.", "Layer chicken over brown rice with shredded cabbage.", "Use a small amount of soy sauce and add warm water or tea."] },
  { name: "Kimchi tofu rice bowl", cuisine: "Korean", meal: "Breakfast", diet: "Veg", time: "15 min", tag: "Quick savoury start", ingredients: "Firm tofu, cooked rice, mild kimchi, spinach, sesame and egg optional.", steps: ["Pan-sear tofu until lightly golden.", "Warm rice, spinach and mild kimchi together.", "Top with tofu and sesame; choose a low-sodium kimchi if needed."] },
  { name: "Korean beef and greens", cuisine: "Korean", meal: "Lunch", diet: "Non-veg", time: "25 min", tag: "Iron + protein", ingredients: "Lean beef, broccoli, carrots, rice, garlic and sesame.", steps: ["Cook thinly sliced beef with garlic until fully cooked.", "Steam broccoli and carrots until just tender.", "Serve with rice and sesame, keeping the sauce light."] },
  { name: "Miso oat breakfast", cuisine: "Japanese", meal: "Breakfast", diet: "Veg", time: "10 min", tag: "Fibre + comfort", ingredients: "Oats, mushrooms, spinach, mild miso, tofu and spring onion.", steps: ["Simmer oats with water or unsweetened milk until creamy.", "Stir in mushrooms, spinach and tofu.", "Add a small spoon of miso after turning off the heat."] },
  { name: "Salmon soba plate", cuisine: "Japanese", meal: "Dinner", diet: "Non-veg", time: "25 min", tag: "Omega-3 option", ingredients: "Salmon, soba noodles, edamame, cucumber, sesame and lemon.", steps: ["Bake or pan-cook salmon until it flakes easily.", "Cook soba and rinse briefly; toss with cucumber and edamame.", "Finish with lemon and sesame instead of a heavy sauce."] },
  { name: "Chiura yogurt bowl", cuisine: "Nepali", meal: "Breakfast", diet: "Veg", time: "10 min", tag: "No-cook meal", ingredients: "Beaten rice, plain yogurt, banana, apple, pumpkin seeds and cinnamon.", steps: ["Rinse beaten rice briefly and drain well.", "Fold through yogurt and chopped fruit.", "Top with pumpkin seeds and cinnamon; serve immediately."] },
  { name: "Chicken tarkari plate", cuisine: "Nepali", meal: "Lunch", diet: "Non-veg", time: "35 min", tag: "Home-style balance", ingredients: "Chicken, tomato, onion, ginger, turmeric, greens and rice.", steps: ["Cook onion, ginger, tomato and turmeric into a light base.", "Add chicken and simmer until fully cooked.", "Serve with rice and a generous side of greens."] },
  { name: "Berry oat overnight jar", cuisine: "European", meal: "Snack", diet: "Veg", time: "5 min + chill", tag: "Prep ahead", ingredients: "Oats, yogurt, berries, chia seeds and walnuts.", steps: ["Mix oats, yogurt and chia seeds in a jar.", "Fold in berries and chill overnight.", "Add walnuts just before eating for texture."] },
  { name: "Whole-wheat pasta primavera", cuisine: "European", meal: "Lunch", diet: "Veg", time: "25 min", tag: "Healthy pasta", ingredients: "Whole-wheat pasta, broccoli, bell pepper, courgette, garlic, olive oil, lemon and parmesan.", steps: ["Cook whole-wheat pasta until just tender and reserve a little cooking water.", "Saute garlic and vegetables in a small amount of olive oil until bright and tender.", "Toss pasta with the vegetables, lemon and a splash of cooking water; finish with a light sprinkle of parmesan."] },
  { name: "Mediterranean chicken tray", cuisine: "European", meal: "Dinner", diet: "Non-veg", time: "40 min", tag: "Colourful plate", ingredients: "Chicken, chickpeas, peppers, courgette, olive oil, lemon and herbs.", steps: ["Place chicken, chickpeas and vegetables on a tray with herbs and a little oil.", "Roast at 200°C until chicken is cooked through and vegetables are tender.", "Finish with lemon and serve with water or wholegrain bread."] },
];

const CUISINES: Array<Cuisine | "All"> = ["All", "Indian", "Chinese", "Korean", "Japanese", "Nepali", "European"];
const MEALS: Array<Meal | "All meals"> = ["All meals", "Breakfast", "Lunch", "Snack", "Dinner"];
const DIETS: Array<Diet | "All"> = ["All", "Veg", "Non-veg"];

function FilterGroup<T extends string>({ label, values, selected, onChange }: { label: string; values: T[]; selected: T; onChange: (value: T) => void }) {
  return <div className="space-y-2"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</p><div className="flex flex-wrap gap-2">{values.map((value) => <Button key={value} size="sm" variant={selected === value ? "default" : "outline"} onClick={() => onChange(value)}>{value}</Button>)}</div></div>;
}

function makeHealthyGuide(dish: string, meal: Meal | "All meals", diet: Diet | "All"): Recipe {
  const displayName = dish.trim().replace(/\s+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  const mealType = meal === "All meals" ? "Lunch" : meal;
  const dietType = diet === "All" ? "Veg" : diet;
  return {
    name: `${displayName} — healthy version`,
    cuisine: "European",
    meal: mealType,
    diet: dietType,
    time: "20–35 min",
    tag: "Custom healthy guide",
    ingredients: dietType === "Veg" ? `${displayName}, colourful vegetables, beans or tofu, a wholegrain base, herbs, lemon and a small amount of olive or mustard oil.` : `${displayName}, lean protein, colourful vegetables, a wholegrain base, herbs, lemon and a small amount of olive or mustard oil.`,
    steps: [`Keep the main flavours of ${displayName}, but choose grilling, steaming, baking or a light pan-cook instead of deep-frying.`, "Fill at least half the plate with vegetables, use a moderate portion of the main dish, and add beans, tofu or lean protein as needed.", "Use less excess salt, sugar and creamy sauce; finish with herbs, lemon or spices and serve with water.", "Taste before adding more seasoning and stop when comfortably satisfied."],
  };
}

export function RecipeBrowser() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState<Cuisine | "All">("All");
  const [meal, setMeal] = useState<Meal | "All meals">("All meals");
  const [diet, setDiet] = useState<Diet | "All">("All");
  const filtered = RECIPES.filter((recipe) => {
    const searchText = `${recipe.name} ${recipe.ingredients} ${recipe.cuisine} ${recipe.meal}`.toLowerCase();
    return (!query.trim() || searchText.includes(query.trim().toLowerCase())) && (cuisine === "All" || recipe.cuisine === cuisine) && (meal === "All meals" || recipe.meal === meal) && (diet === "All" || recipe.diet === diet);
  });
  const suggestions = ["dal", "tofu", "pasta", "salmon", "chicken", "oats"];
  const results = query.trim() && filtered.length === 0 ? [makeHealthyGuide(query, meal, diet)] : filtered;

  return <div className="space-y-5">
    <Card className="border-indigo-100 bg-indigo-50/40"><CardContent className="space-y-5 p-5"><div><div className="flex items-center gap-2"><Search className="h-4 w-4 text-indigo-600" /><p className="text-sm font-semibold">What dish are you craving?</p></div><p className="mt-1 text-xs text-muted-foreground">Type a dish name or ingredient to get a healthier version with ingredients and instructions.</p></div><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input aria-label="Search for a dish" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try moong dal, tofu, salmon, chicken..." className="h-12 w-full rounded-xl border border-indigo-200 bg-white pl-10 pr-4 text-sm text-foreground shadow-sm outline-none ring-indigo-500 placeholder:text-muted-foreground focus:ring-2" /></div><div className="flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground">Try:</span>{suggestions.map((suggestion) => <Button key={suggestion} size="sm" variant="outline" onClick={() => setQuery(suggestion)}>{suggestion}</Button>)}</div><div className="border-t border-indigo-100 pt-4"><div className="mb-3 flex items-center gap-2"><Filter className="h-4 w-4 text-indigo-600" /><span className="text-xs font-semibold text-foreground">Optional filters</span></div><div className="space-y-4"><FilterGroup label="Cuisine" values={CUISINES} selected={cuisine} onChange={setCuisine} /><FilterGroup label="Meal" values={MEALS} selected={meal} onChange={setMeal} /><FilterGroup label="Preference" values={DIETS} selected={diet} onChange={setDiet} /></div></div></CardContent></Card>
    {query.trim() ? <div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">Healthy recipe results</h2><p className="mt-1 text-sm text-muted-foreground">Instructions are adapted for balanced ingredients, gentle cooking and lower excess salt.</p></div><span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{results.length} found</span></div> : <Card className="border-dashed"><CardContent className="flex flex-col items-center p-8 text-center"><ChefHat className="h-8 w-8 text-orange-500" /><h2 className="mt-3 text-base font-semibold">Search for any dish to see a healthy recipe</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">Type any dish name, even one that is not in the library. You will get a flexible healthy version, ingredients and step-by-step instructions.</p></CardContent></Card>}
    {query.trim() && <div className="grid gap-4 lg:grid-cols-3">{results.map((recipe) => <Card key={recipe.name} className="flex h-full flex-col"><CardContent className="flex h-full flex-col p-5"><div className="flex items-start justify-between gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><ChefHat className="h-5 w-5" /></span><div className="flex flex-wrap justify-end gap-1.5"><span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">{recipe.name.includes("healthy version") ? "Custom guide" : recipe.cuisine}</span><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${recipe.diet === "Veg" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{recipe.diet}</span></div></div><h3 className="mt-4 text-base font-semibold">{recipe.name}</h3><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><span className="rounded-full bg-teal-50 px-2.5 py-1 font-semibold text-teal-700">{recipe.meal}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {recipe.time}</span></div><p className="mt-4 text-xs leading-5 text-muted-foreground"><strong className="text-foreground">Healthy ingredients: </strong>{recipe.ingredients}</p><ol className="mt-4 flex-1 space-y-2 text-xs leading-5 text-muted-foreground">{recipe.steps.map((step, index) => <li key={step} className="flex gap-2"><span className="font-semibold text-indigo-600">{index + 1}.</span>{step}</li>)}</ol></CardContent></Card>)}</div>}
    <p className="flex items-center gap-2 text-xs text-muted-foreground"><Leaf className="h-3.5 w-3.5 text-emerald-600" /> Choose the version that fits your culture, budget, allergies and preferences. The recipes are general wellness ideas.</p>
  </div>;
}