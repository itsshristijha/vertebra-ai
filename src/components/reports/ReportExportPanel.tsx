"use client";

import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeeklyReport } from "@/types/health";

function reportMarkup(report: WeeklyReport) {
  const trendText = report.weeklyChangePercent >= 0 ? `improved by ${report.weeklyChangePercent}%` : `changed by ${report.weeklyChangePercent}%`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>VERTEBRA-AI Weekly Report</title><style>body{font-family:Arial,sans-serif;color:#152033;max-width:860px;margin:40px auto;padding:0 32px;line-height:1.5}h1{font-size:28px;margin-bottom:4px}h2{font-size:17px;border-bottom:1px solid #dbe3ee;padding-bottom:8px;margin-top:30px}.meta{color:#64748b;font-size:13px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.metric{border:1px solid #dbe3ee;border-radius:10px;padding:14px}.label{font-size:11px;color:#64748b}.value{font-size:22px;font-weight:700;margin-top:6px}.note{background:#f1f5f9;border-radius:10px;padding:14px;font-size:13px}.warning{background:#fff7ed;border-left:4px solid #f59e0b;padding:14px;font-size:13px}li{margin:8px 0}@media print{body{margin:20px auto}}</style></head><body><h1>VERTEBRA-AI Weekly Spine Health Report</h1><p class="meta">Reporting period: ${report.weekStart} to ${report.weekEnd}</p><div class="note"><strong>Executive summary</strong><br>The measured Spine Health Score ${trendText} over the reporting period. The most frequent observed deviation was ${report.mostFrequentDeviation}. This report is a wellness summary and is not a diagnosis.</div><h2>Key metrics</h2><div class="grid"><div class="metric"><div class="label">Average Spine Health Score</div><div class="value">${report.averageSpineHealthScore}/100</div></div><div class="metric"><div class="label">Overall trend</div><div class="value">${report.overallTrend}</div></div><div class="metric"><div class="label">Total sitting time</div><div class="value">${report.totalSittingTimeHours}h</div></div></div><h2>Analysis</h2><ul><li><strong>Trend:</strong> ${report.overallTrend} with a weekly change of ${report.weeklyChangePercent}%.</li><li><strong>Most frequent deviation:</strong> ${report.mostFrequentDeviation}.</li><li><strong>Daily observations:</strong> ${report.dailyScores.length} recorded score points were included in this summary.</li><li><strong>Behavioural context:</strong> Total sitting time was ${report.totalSittingTimeHours} hours for the period.</li></ul><h2>Recommendations</h2><p>${report.recommendation}</p><h2>Data provenance</h2><p class="meta">Generated from timestamped posture sessions and calibrated personal baseline data. Raw video is not required for this summary. Values should be interpreted as research-prototype wellness indicators.</p><div class="warning"><strong>Safety note:</strong> VERTEBRA-AI does not diagnose spinal disorders or replace professional medical assessment. Seek qualified care for persistent pain, weakness, numbness, or other concerning symptoms.</div></body></html>`;
}

export function ReportExportPanel({ report, disabled = false }: { report: WeeklyReport; disabled?: boolean }) {
  const [format, setFormat] = useState<"pdf" | "doc">("pdf");

  function exportReport() {
    if (disabled) return;
    const markup = reportMarkup(report);
    if (format === "pdf") {
      const printWindow = window.open("", "_blank", "noopener,noreferrer");
      if (!printWindow) return;
      printWindow.document.write(markup.replace("</body>", "<script>window.onload=function(){window.print()}</script></body>"));
      printWindow.document.close();
      return;
    }
    const blob = new Blob([markup], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vertebra-ai-weekly-report-${report.weekEnd}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return <div className="rounded-xl border border-border bg-card p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-foreground">Professional report export</p><p className="mt-1 text-xs text-muted-foreground">Executive summary, metric analysis, recommendations, provenance and safety notes.</p></div><div className="flex items-center gap-2"><select aria-label="Report format" disabled={disabled} value={format} onChange={(event) => setFormat(event.target.value as "pdf" | "doc")} className="h-9 rounded-lg border border-input bg-white px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"><option value="pdf">PDF</option><option value="doc">DOC</option></select><Button size="sm" disabled={disabled} onClick={exportReport}>{format === "pdf" ? <Printer className="h-4 w-4" /> : <FileText className="h-4 w-4" />}{format === "pdf" ? "Print / save PDF" : "Download DOC"}</Button></div></div>{disabled && <p className="mt-3 flex items-center gap-2 text-xs text-amber-700"><Download className="h-3.5 w-3.5" /> Export unlocks after verified posture history is available.</p>}</div>;
}