/**
 * Content layer. Everything on the site is read from /content at build time.
 * Markdown/MDX files carry YAML front matter; collections live in YAML files.
 * See CONTENT.md for the authoring guide.
 */
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { load as loadYaml } from "js-yaml";
import GithubSlugger from "github-slugger";
import type { Heading, Idea, JournalPost, LedgerEntry, ResearchReport, Site } from "./types";

const ROOT = path.join(process.cwd(), "content");

/** YAML parses bare dates into Date objects; turn them back into ISO strings. */
function normalise<T>(value: T): T {
  if (value instanceof Date) return value.toISOString().slice(0, 10) as unknown as T;
  if (Array.isArray(value)) return value.map(normalise) as unknown as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normalise(v)])) as T;
  }
  return value;
}

function readYaml<T>(file: string, fallback: T): T {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return fallback;
  return normalise(loadYaml(fs.readFileSync(full, "utf8")) as T) ?? fallback;
}

function readCollection(dir: string): { slug: string; data: Record<string, unknown>; body: string }[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      return { slug: f.replace(/\.mdx?$/, ""), data: normalise(data), body: content.trim() };
    })
    .filter((e) => e.data.draft !== true);
}

const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 220));

function extractHeadings(body: string): Heading[] {
  const slugger = new GithubSlugger();
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => {
    const text = m[1].replace(/[*_`]/g, "").trim();
    return { id: slugger.slug(text), text };
  });
}

const byDateDesc = <T,>(key: (x: T) => string) => (a: T, b: T) => key(b).localeCompare(key(a));

export const getSite = cache((): Site => readYaml<Site>("site.yaml", {} as Site));

export const getResearch = cache((): ResearchReport[] =>
  readCollection("research")
    .map(({ slug, data, body }) => ({
      ...(data as Omit<ResearchReport, "slug" | "body" | "readingTime" | "headings">),
      slug,
      body,
      readingTime: readingTime(body),
      headings: extractHeadings(body),
    }))
    .sort(byDateDesc((r) => r.date)),
);

export const getJournal = cache((): JournalPost[] =>
  readCollection("journal")
    .map(({ slug, data, body }) => ({
      ...(data as Omit<JournalPost, "slug" | "body" | "readingTime">),
      slug,
      body,
      readingTime: readingTime(body),
    }))
    .sort(byDateDesc((p) => p.date)),
);

export const getIdeas = cache((): Idea[] =>
  readCollection("ideas")
    .map(({ slug, data, body }) => {
      const d = data as Partial<Idea>;
      return {
        bull: [], bear: [], metrics: [], catalysts: [], risks: [], invalidation: [],
        ...d,
        tracker: [...(d.tracker ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
        slug,
        body,
      } as Idea;
    })
    .sort(byDateDesc((i) => i.dateAdded)),
);

export type Marginal = { date: string; note: string; tag?: string };
export const getMarginalia = cache((): Marginal[] =>
  readYaml<Marginal[]>("marginalia.yaml", []).sort(byDateDesc((m) => m.date)),
);

export type ArchiveItem = { name: string; kind: string; why: string; added: string };
export const getArchive = cache((): ArchiveItem[] => readYaml<ArchiveItem[]>("idea-archive.yaml", []));

export type ReadingRoom = {
  books: { title: string; author: string; status: "Reading" | "Read" | "On the shelf"; note?: string; theme?: string }[];
  investors: { name: string; known_for: string; strategy: string }[];
  philosophies: { name: string; summary: string }[];
  papers: { title: string; authors: string; year: number; source: string; why: string }[];
  concepts: { term: string; note: string }[];
  quotes: { text: string; by: string; source?: string }[];
};
export const getReadingRoom = cache((): ReadingRoom => ({
  books: [], investors: [], philosophies: [], papers: [], concepts: [], quotes: [],
  ...readYaml<Partial<ReadingRoom>>("reading-room.yaml", {}),
}));

export type ResumeItem = { title: string; org?: string; period?: string; location?: string; points?: string[] };
export type Resume = {
  summary: string;
  sections: { heading: string; items: ResumeItem[] }[];
  skills: { group: string; items: string[] }[];
};
export const getResume = cache((): Resume => ({
  summary: "", sections: [], skills: [],
  ...readYaml<Partial<Resume>>("resume.yaml", {}),
}));

export type About = {
  title: string;
  lede: string;
  timeline: { period: string; title: string; note: string }[];
  body: string;
};
export const getAbout = cache((): About => {
  const file = path.join(ROOT, "about.mdx");
  if (!fs.existsSync(file)) return { title: "About", lede: "", timeline: [], body: "" };
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const d = normalise(data) as Partial<About>;
  return { title: d.title ?? "About", lede: d.lede ?? "", timeline: d.timeline ?? [], body: content.trim() };
});

/** The Investment Ledger: hand-written entries merged with everything published. */
export const getLedger = cache((): LedgerEntry[] => {
  const manual = readYaml<LedgerEntry[]>("ledger.yaml", []);
  const auto: LedgerEntry[] = [
    ...getResearch().map((r) => ({
      date: r.date, type: "Research" as const, title: r.title, note: r.summary, href: `/research/${r.slug}`,
    })),
    ...getJournal().map((p) => ({
      date: p.date, type: "Journal" as const, title: p.title, note: p.excerpt, href: `/journal/${p.slug}`,
    })),
    ...getIdeas().flatMap((i) => [
      {
        date: i.dateAdded, type: "Idea" as const, title: `${i.company} added to the notebook`,
        note: i.thesis, href: `/ideas/${i.slug}`,
      },
      ...(i.tracker ?? [])
        .filter((t) => t.date !== i.dateAdded)
        .map((t) => ({
          date: t.date,
          type: (t.type === "Closed" ? "Closed" : "Thesis update") as LedgerEntry["type"],
          title: `${i.company}: ${t.title}`, note: t.note, href: `/ideas/${i.slug}#tracker`,
        })),
    ]),
  ];
  return [...manual, ...auto].sort(byDateDesc((e) => e.date));
});
