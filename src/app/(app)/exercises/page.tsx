import type { Metadata } from "next";
import { EXERCISES } from "@/lib/demo/data";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";

export const metadata: Metadata = { title: "Exercises" };

export default function ExercisesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Exercise Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">Targeted mobility exercises to complement your posture routine.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {EXERCISES.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>

      <RiskDisclaimer />
    </div>
  );
}
