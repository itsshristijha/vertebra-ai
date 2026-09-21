import type { Metadata } from "next";
import { getWeeklyReport } from "@/lib/demo/data";
import { WeeklyReportView } from "@/components/reports/WeeklyReportView";

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  const report = getWeeklyReport();
  return <WeeklyReportView report={report} />;
}
