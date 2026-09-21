import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The mandatory medical-safety disclaimer. Rendered on every risk-related,
 * assessment-related, and score-related surface of the app so it can never
 * be mistaken for a diagnostic system.
 */
export function RiskDisclaimer({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-900",
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
        className
      )}
    >
      <ShieldAlert className={cn("mt-0.5 shrink-0", compact ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden />
      <p>
        <strong className="font-semibold">VERTEBRA-AI is a research and wellness prototype.</strong>{" "}
        It does not diagnose spinal disorders or replace professional medical assessment.
      </p>
    </div>
  );
}
