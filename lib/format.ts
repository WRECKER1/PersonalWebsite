const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/** Formats an ISO date (YYYY-MM-DD) without timezone surprises. */
export function formatDate(iso: string, style: "long" | "short" | "month" = "long"): string {
  const [y, m, d] = (iso ?? "").split("-").map(Number);
  if (!y || !m) return iso ?? "";
  const month = MONTHS[m - 1];
  if (style === "month") return `${month} ${y}`;
  if (style === "short") return `${String(d).padStart(2, "0")} ${month.slice(0, 3)} ${y}`;
  return `${d} ${month} ${y}`;
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}
