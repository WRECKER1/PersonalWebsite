"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FileDown } from "lucide-react";
import { formatDate } from "@/lib/format";
import { RESEARCH_CATEGORIES, researchLabel, type ResearchCategory } from "@/lib/types";
import { EmptyState, FilterBar, SampleTag } from "@/components/ui/bits";

export type ReportCard = {
  slug: string; title: string; subject: string; ticker?: string; industry: string;
  category: ResearchCategory; date: string; horizon: string; summary: string;
  sample?: boolean; pdf?: string; readingTime: number;
};

export function ResearchLibrary({ reports }: { reports: ReportCard[] }) {
  const [filter, setFilter] = useState<"all" | ResearchCategory>("all");
  const shown = filter === "all" ? reports : reports.filter((r) => r.category === filter);
  const options = [
    { key: "all" as const, label: "All research", count: reports.length },
    ...RESEARCH_CATEGORIES.map((c) => ({
      key: c.key, label: c.label, count: reports.filter((r) => r.category === c.key).length,
    })),
  ];

  return (
    <div>
      <div className="border-y border-rule py-4">
        <FilterBar label="Filter research by category" options={options} value={filter} onChange={setFilter} />
      </div>
      {shown.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="Nothing filed under this heading yet." hint="Reports appear here as soon as they are added to content/research." />
        </div>
      ) : (
        <ol>
          {shown.map((r) => (
            <li key={r.slug} className="border-b border-rule">
              <Link href={`/research/${r.slug}`} className="group grid gap-x-10 gap-y-3 py-8 md:grid-cols-12 md:py-10">
                <div className="md:col-span-3">
                  <p className="kicker !text-accent">{researchLabel(r.category)}</p>
                  <p className="kicker mt-2">{formatDate(r.date)}</p>
                  {r.sample && <p className="mt-3"><SampleTag /></p>}
                </div>
                <div className="md:col-span-6">
                  <h2 className="font-serif text-3xl leading-[1.1] tracking-[-0.02em] md:text-[2.25rem]">
                    <span className="link-draw">{r.title}</span>
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-2">{r.summary}</p>
                </div>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 self-start text-sm md:col-span-3 md:grid-cols-1 md:border-l md:border-rule md:pl-8">
                  <div><dt className="kicker">Subject</dt><dd>{r.subject}{r.ticker ? <span className="num ml-2 text-xs text-muted">{r.ticker}</span> : null}</dd></div>
                  <div><dt className="kicker">Industry</dt><dd>{r.industry}</dd></div>
                  <div><dt className="kicker">Horizon</dt><dd>{r.horizon}</dd></div>
                  <div className="flex items-center gap-4 text-muted">
                    <span className="kicker">{r.readingTime} min</span>
                    {r.pdf && <span className="kicker inline-flex items-center gap-1"><FileDown size={12} /> PDF</span>}
                    <ArrowRight size={14} className="ml-auto text-ink transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
