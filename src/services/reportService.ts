const BASE = "";

export async function fetchWeeklyReport() {
  const res = await fetch(`${BASE}/api/reports/weekly`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load weekly report");
  return res.json();
}
