"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/lib/format";
import { EmptyState, FilterBar } from "@/components/ui/bits";

export type PostCard = {
  slug: string; title: string; date: string; category: string; excerpt: string; readingTime: number;
};

export function JournalIndex({ posts }: { posts: PostCard[] }) {
  const categories = [...new Set(posts.map((p) => p.category))].sort();
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? posts : posts.filter((p) => p.category === filter);
  const years = [...new Set(shown.map((p) => p.date.slice(0, 4)))];

  return (
    <div>
      <div className="border-y border-rule py-4">
        <FilterBar
          label="Filter journal entries by category"
          options={["All", ...categories].map((c) => ({ key: c, label: c }))}
          value={filter}
          onChange={setFilter}
        />
      </div>
      {shown.length === 0 ? (
        <div className="mt-10"><EmptyState title="No entries here yet." /></div>
      ) : (
        years.map((year) => (
          <section key={year} className="grid gap-x-10 border-b border-rule py-8 md:grid-cols-12">
            <h2 className="font-serif text-5xl font-light leading-none tracking-[-0.03em] text-rule md:col-span-2 md:text-6xl dark:text-ink-2/40">
              {year}
            </h2>
            <ol className="mt-6 divide-y divide-rule md:col-span-10 md:mt-0">
              {shown.filter((p) => p.date.startsWith(year)).map((p) => (
                <li key={p.slug}>
                  <Link href={`/journal/${p.slug}`} className="group grid gap-x-8 gap-y-1 py-6 first:pt-0 md:grid-cols-[7rem_1fr_9rem]">
                    <span className="kicker pt-2">{formatDate(p.date, "short").slice(0, 6)}</span>
                    <span>
                      <span className="block font-serif text-[1.7rem] leading-tight tracking-[-0.015em]">
                        <span className="link-draw">{p.title}</span>
                      </span>
                      <span className="mt-2 block max-w-2xl leading-relaxed text-ink-2">{p.excerpt}</span>
                    </span>
                    <span className="kicker pt-2 md:text-right">
                      {p.category}
                      <br className="hidden md:block" />
                      <span className="md:hidden"> · </span>
                      {p.readingTime} min read
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))
      )}
    </div>
  );
}
