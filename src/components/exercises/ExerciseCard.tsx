"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Image as ImageIcon, Pause, Play, RotateCcw, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CircularScore } from "@/components/charts/CircularScore";
import type { Exercise } from "@/types/health";

const CATEGORY_COLORS: Record<string, string> = {
  neck: "from-indigo-500 to-indigo-700",
  shoulders: "from-teal-500 to-teal-700",
  "upper-back": "from-sky-500 to-indigo-600",
  core: "from-amber-500 to-orange-600",
  mobility: "from-fuchsia-500 to-indigo-600",
};

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="flex h-full flex-col overflow-hidden">
        <div
          className={`relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br text-white ${CATEGORY_COLORS[exercise.category]}`}
          style={exercise.mediaUrl ? { backgroundImage: `url(${exercise.mediaUrl})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          <div className="absolute inset-0 bg-slate-950/35" />
          <Target className="relative h-10 w-10 opacity-90 drop-shadow-md" />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/55 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            <ImageIcon className="h-3 w-3" /> Exercise guide
          </span>
        </div>
        <CardContent className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="text-base font-semibold text-foreground">{exercise.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">Targets: {exercise.targets}</p>
          </div>
          <Badge variant="outline" className="w-fit gap-1">
            <Clock className="h-3 w-3" /> {exercise.durationLabel}
          </Badge>
          <ul className="flex-1 space-y-1.5 text-xs text-muted-foreground">
            {exercise.instructions.slice(0, 2).map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
          <Button size="sm" onClick={() => setOpen(true)} className="mt-auto">
            <Play className="h-4 w-4" /> Start
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{exercise.name}</DialogTitle>
            <DialogDescription>Targets: {exercise.targets}</DialogDescription>
          </DialogHeader>
          {exercise.mediaUrl && (
            <div
              className="relative h-40 overflow-hidden rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${exercise.mediaUrl})` }}
              role="img"
              aria-label={exercise.mediaAlt ?? `${exercise.name} exercise guide`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
              <span className="absolute bottom-3 left-3 text-xs font-medium text-white">Visual movement guide</span>
            </div>
          )}
          <ExerciseRunner exercise={exercise} />
          <p className="mt-4 text-xs text-muted-foreground">
            General wellness exercise guidance — not a substitute for supervised physiotherapy. Stop if you feel pain.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ExerciseRunner({ exercise }: { exercise: Exercise }) {
  const totalSets = exercise.sets ?? 1;
  const [currentSet, setCurrentSet] = useState(1);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(exercise.totalSeconds ?? 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  function toggle() {
    if (running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRunning(false);
      return;
    }
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          setCurrentSet((set) => Math.min(totalSets, set + 1));
          return exercise.totalSeconds ?? 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
    setSecondsLeft(exercise.totalSeconds ?? 0);
    setCurrentSet(1);
  }

  const progress = exercise.isTimed && exercise.totalSeconds ? ((exercise.totalSeconds - secondsLeft) / exercise.totalSeconds) * 100 : 0;

  return (
    <div className="space-y-5">
      <ol className="space-y-2 text-sm text-muted-foreground">
        {exercise.instructions.map((step, i) => (
          <li key={step} className="flex gap-2">
            <span className="font-medium text-foreground">{i + 1}.</span> {step}
          </li>
        ))}
      </ol>

      {exercise.isTimed ? (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-muted/50 p-5">
          <CircularScore value={progress} size={120} strokeWidth={9} label={`Set ${currentSet} / ${totalSets}`} sublabel={`${secondsLeft}s left`} />
          <div className="flex gap-2">
            <Button size="sm" onClick={toggle} disabled={currentSet > totalSets}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {running ? "Pause" : "Start"}
            </Button>
            <Button size="sm" variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
          {currentSet > totalSets && <p className="text-sm font-medium text-emerald-600">All sets complete — nice work!</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/50 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            {exercise.reps} repetitions × {exercise.sets} sets
          </p>
          <p className="text-xs text-muted-foreground">Move through repetitions at your own pace, with control.</p>
        </div>
      )}
    </div>
  );
}
