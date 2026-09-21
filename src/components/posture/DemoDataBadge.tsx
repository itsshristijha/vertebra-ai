import { FlaskConical, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoDataBadge({ className }: { className?: string }) {
  return (
    <Badge variant="warning" className={cn("gap-1", className)}>
      <FlaskConical className="h-3 w-3" aria-hidden />
      Demo Data
    </Badge>
  );
}

export function LiveAIBadge({ className }: { className?: string }) {
  return (
    <Badge variant="success" className={cn("gap-1", className)}>
      <Radio className="h-3 w-3" aria-hidden />
      Live AI
    </Badge>
  );
}

export function ModeBadge({ mode, className }: { mode: "demo" | "live-ai"; className?: string }) {
  return mode === "demo" ? <DemoDataBadge className={className} /> : <LiveAIBadge className={className} />;
}
