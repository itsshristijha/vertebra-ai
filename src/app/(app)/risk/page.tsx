import type { Metadata } from "next";
import { getRiskPredictions } from "@/lib/demo/data";
import { RiskOutlookView } from "@/components/risk/RiskOutlookView";

export const metadata: Metadata = { title: "Risk Outlook" };

export default function RiskPage() {
  const predictions = getRiskPredictions();
  return <RiskOutlookView predictions={predictions} />;
}
