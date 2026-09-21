import type { Metadata } from "next";
import { LiveMonitorView } from "@/components/posture/LiveMonitorView";

export const metadata: Metadata = { title: "Live Monitor" };

export default function LiveMonitorPage() {
  return <LiveMonitorView />;
}
