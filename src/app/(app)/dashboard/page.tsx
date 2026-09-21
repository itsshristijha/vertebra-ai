import type { Metadata } from "next";
import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RiskDisclaimer } from "@/components/posture/RiskDisclaimer";
import { StateBanner } from "@/components/ui/state-banner";
import { Button } from "@/components/ui/button";
import { DatabaseZap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <DashboardGreeting />

      <StateBanner
        icon={DatabaseZap}
        title="No verified posture data yet"
        description="Dashboard scores, sitting time, weekly changes and insights will appear after real camera sessions are recorded. Demo values are intentionally hidden."
        action={<Button asChild><Link href="/live-monitor">Start Live Monitor</Link></Button>}
      />

      <QuickActions />

      <RiskDisclaimer />
    </div>
  );
}
