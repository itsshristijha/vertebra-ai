"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this would report to an error-tracking service rather
    // than the console.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
        <AlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">Something went wrong.</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        An unexpected error occurred while loading this page. This is a research and wellness prototype — no posture
        data was lost.
      </p>
      <Button className="mt-8" onClick={reset}>
        <RotateCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
