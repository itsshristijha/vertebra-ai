import Link from "next/link";
import { ArrowRight, Crosshair, FileText, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ACTIONS = [
  { href: "/live-monitor", icon: Video, title: "Start Live Monitor", body: "See your live posture skeleton and current state." },
  { href: "/calibration", icon: Crosshair, title: "Re-run Calibration", body: "Refresh your personal posture baseline." },
  { href: "/reports", icon: FileText, title: "View Weekly Report", body: "Review this week's Spine Health trend." },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {ACTIONS.map((a) => (
        <Link key={a.href} href={a.href}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <a.icon className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
