export type ResearchCategory = "company" | "sector" | "macro" | "fsa" | "special-situations";

export const RESEARCH_CATEGORIES: { key: ResearchCategory; label: string }[] = [
  { key: "company", label: "Company Research" },
  { key: "sector", label: "Sector Research" },
  { key: "macro", label: "Macroeconomic Research" },
  { key: "fsa", label: "Financial Statement Analysis" },
  { key: "special-situations", label: "Special Situations" },
];

export const researchLabel = (c: string) =>
  RESEARCH_CATEGORIES.find((x) => x.key === c)?.label ?? c;

export type ChartSpec = {
  type: "bar" | "line" | "area";
  title: string;
  unit?: string;
  note?: string;
  x: string;
  series: { key: string; label: string }[];
  data: Record<string, string | number>[];
};

export type Heading = { id: string; text: string };

export type ResearchReport = {
  slug: string;
  title: string;
  subject: string;
  ticker?: string;
  industry: string;
  category: ResearchCategory;
  date: string;
  horizon: string;
  summary: string;
  featured?: boolean;
  sample?: boolean;
  pdf?: string;
  charts?: Record<string, ChartSpec>;
  body: string;
  readingTime: number;
  headings: Heading[];
};

export type JournalPost = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  featured?: boolean;
  sample?: boolean;
  body: string;
  readingTime: number;
};

export const IDEA_STATUSES = ["Under Research", "Active Thesis", "Monitoring", "Closed"] as const;
export type IdeaStatus = (typeof IDEA_STATUSES)[number];

export type TrackerEntry = {
  date: string;
  title: string;
  note: string;
  /** 1 (low) – 5 (high) */
  conviction: number;
  type?: "Thesis" | "Development" | "Assumption change" | "Lesson" | "Closed";
};

export type Idea = {
  slug: string;
  company: string;
  ticker: string;
  sector: string;
  category: string;
  dateAdded: string;
  status: IdeaStatus;
  horizon: string;
  thesis: string;
  bull: string[];
  bear: string[];
  metrics: { label: string; value: string }[];
  valuation: string;
  catalysts: string[];
  risks: string[];
  invalidation: string[];
  tracker?: TrackerEntry[];
  retrospective?: {
    closedOn: string;
    expected: string;
    actual: string;
    lesson: string;
    verdict: string;
  };
  research?: string;
  sample?: boolean;
  body: string;
};

export type LedgerEntry = {
  date: string;
  type: "Research" | "Idea" | "Journal" | "Thesis update" | "Milestone" | "Observation" | "Closed";
  title: string;
  note?: string;
  href?: string;
};

export type Site = {
  title: string;
  motto: string;
  description: string;
  url: string;
  established: string;
  author: { name: string; role: string; location: string };
  intro: { label: string; value: string }[];
  email: string;
  socials: { label: string; href: string }[];
  resumePdf: string;
  contactFormEndpoint?: string;
  disclaimer: string;
};
