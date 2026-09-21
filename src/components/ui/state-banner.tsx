import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Generic, reusable "state" panel used for every non-happy-path screen in
 * the app: camera permission denied, camera unavailable, no person
 * detected, partial occlusion, IMU disconnected, model unavailable,
 * network error, insufficient data, no historical data, etc. Keeping this
 * shared avoids each page inventing its own bespoke error UI.
 */
export function StateBanner({
  icon: Icon,
  title,
  description,
  tone = "neutral",
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "neutral" | "warning" | "bad";
  action?: React.ReactNode;
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    neutral: "border-border bg-muted/40 text-foreground",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    bad: "border-red-200 bg-red-50 text-red-900",
  };
  const iconClasses: Record<string, string> = {
    neutral: "bg-white text-muted-foreground",
    warning: "bg-white text-amber-600",
    bad: "bg-white text-red-600",
  };

  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-2xl border p-8 text-center", toneClasses[tone], className)}>
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-full shadow-sm", iconClasses[tone])}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 max-w-sm text-sm opacity-90">{description}</p>
      </div>
      {action}
    </div>
  );
}
