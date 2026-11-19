import type { MetadataRoute } from "next";
import { getIdeas, getJournal, getResearch, getSite } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSite().url.replace(/\/$/, "");
  const pages = ["", "/about", "/resume", "/research", "/ideas", "/journal", "/reading-room", "/ledger", "/retrospectives", "/marginalia", "/contact"];
  return [
    ...pages.map((p) => ({ url: `${base}${p}` })),
    ...getResearch().map((r) => ({ url: `${base}/research/${r.slug}`, lastModified: r.date })),
    ...getJournal().map((p) => ({ url: `${base}/journal/${p.slug}`, lastModified: p.date })),
    ...getIdeas().map((i) => ({ url: `${base}/ideas/${i.slug}`, lastModified: i.dateAdded })),
  ];
}
