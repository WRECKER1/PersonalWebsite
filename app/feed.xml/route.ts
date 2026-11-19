import { getJournal, getResearch, getSite } from "@/lib/content";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const site = getSite();
  const base = site.url.replace(/\/$/, "");
  const items = [
    ...getJournal().map((p) => ({ title: p.title, url: `${base}/journal/${p.slug}`, date: p.date, text: p.excerpt })),
    ...getResearch().map((r) => ({ title: r.title, url: `${base}/research/${r.slug}`, date: r.date, text: r.summary })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.title)}</title><link>${base}</link><description>${esc(site.description)}</description>
${items
  .map(
    (i) =>
      `<item><title>${esc(i.title)}</title><link>${i.url}</link><guid>${i.url}</guid><pubDate>${new Date(i.date + "T00:00:00Z").toUTCString()}</pubDate><description>${esc(i.text)}</description></item>`,
  )
  .join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
