import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatusPill({
  icon: Icon,
  label,
  tone = "neutral",
  href,
  className,
}: {
  icon: LucideIcon;
  label: string;
  tone?: "good" | "warning" | "bad" | "neutral";
  href?: string;
  className?: string;
}) {
  const toneClasses: Record<string, string> = {
    good: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    bad: "bg-red-50 text-red-700 border-red-200",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  const classes = cn(
    "hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
    href && "transition-opacity hover:opacity-80",
    toneClasses[tone],
    className
  );

  const content = (
    <>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
}
