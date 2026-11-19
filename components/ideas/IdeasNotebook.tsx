"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, List, Table2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { IDEA_STATUSES, type IdeaStatus } from "@/lib/types";
import { EmptyState, FilterBar, StatusMark } from "@/components/ui/bits";

export type IdeaCard = {
  slug: string; company: string; ticker: string; sector: string; category: string;
  dateAdded: string; status: IdeaStatus; horizon: string; thesis: string;
  metrics: { label: string; value: string }[];
};

export function IdeasNotebook({ ideas }: { ideas: IdeaCard[] }) {
  const [status, setStatus] = useState<"All" | IdeaStatus>("All");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState<"notebook" | "watchlist">("notebook");
  const categories = [...new Set(ideas.map((i) => i.category))].sort();

  const shown = ideas.filter(
    (i) => (status === "All" || i.status === status) && (category === "All" || i.category === category),
  );

  return (
    <div>
      <div className="grid gap-y-4 border-y border-rule py-4 md:grid-cols-[1fr_auto] md:gap-x-10">
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="kicker w-16">Status</span>
            <FilterBar
              label="Filter ideas by status"
              options={["All", ...IDEA_STATUSES].map((s) => ({
                key: s as "All" | IdeaStatus, label: s,
                count: s === "All" ? ideas.length : ideas.filter((i) => i.status === s).length,
              }))}
              value={status}
              onChange={setStatus}
            />
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="kicker w-16">Type</span>
            <FilterBar
              label="Filter ideas by type"
              options={["All", ...categories].map((c) => ({ key: c, label: c }))}
              value={category}
              onChange={setCategory}
            />
          </div>
        </div>
        <div role="group" aria-label="Choose view" className="flex items-start gap-1 self-start">
          {([["notebook", "Notebook", List], ["watchlist", "Watchlist", Table2]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              type="button"
              aria-pressed={view === key}
              onClick={() => setView(key)}
              className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[0.8125rem] transition-colors ${
                view === key ? "border-ink bg-ink text-paper" : "border-rule text-muted hover:border-ink hover:text-ink"
              }`}
            >
              <Icon size={13} strokeWidth={1.5} /> {label}
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="No ideas match these filters." hint="Try a different status or type." />
        </div>
      ) : view === "notebook" ? (
        <ol>
          {shown.map((i, n) => (
            <li key={i.slug} className="border-b border-rule">
              <Link href={`/ideas/${i.slug}`} className="group grid gap-x-10 gap-y-4 py-8 md:grid-cols-12 md:py-10">
                <div className="md:col-span-4">
                  <p className="num text-[0.6875rem] tracking-wider text-muted">
                    {String(n + 1).padStart(2, "0")} — {i.ticker}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl leading-[1.08] tracking-[-0.02em]">
                    <span className="link-draw">{i.company}</span>
                  </h2>
                  <p className="mt-2 text-sm text-ink-2">{i.sector} · {i.category}</p>
                  <p className="mt-4"><StatusMark status={i.status} /></p>
                </div>
                <div className="md:col-span-5">
                  <p className="kicker mb-2">Core thesis</p>
                  <p className="font-serif text-lg leading-relaxed text-ink-2">{i.thesis}</p>
                </div>
                <dl className="grid grid-cols-3 gap-4 self-start md:col-span-3 md:grid-cols-1 md:gap-3 md:border-l md:border-rule md:pl-8">
                  {i.metrics.slice(0, 3).map((m) => (
                    <div key={m.label} className="flex flex-col md:flex-row md:items-baseline md:justify-between md:gap-3">
                      <dt className="text-xs text-muted">{m.label}</dt>
                      <dd className="num text-sm">{m.value}</dd>
                    </div>
                  ))}
                  <div className="col-span-3 flex items-center justify-between pt-1 md:col-span-1">
                    <span className="kicker">Added {formatDate(i.dateAdded, "short")}</span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[46rem] border-collapse text-sm">
            <caption className="sr-only">Watchlist of ideas with sample metrics</caption>
            <thead>
              <tr className="border-b border-ink text-left">
                {["Company", "Sector", "Status", "Horizon"].map((h) => (
                  <th key={h} scope="col" className="kicker py-3 pr-4 font-normal">{h}</th>
                ))}
                {(shown[0]?.metrics ?? []).slice(0, 3).map((m) => (
                  <th key={m.label} scope="col" className="kicker py-3 pl-4 text-right font-normal">{m.label}</th>
                ))}
                <th scope="col" className="kicker py-3 pl-4 text-right font-normal">Added</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((i) => (
                <tr key={i.slug} className="group border-b border-rule transition-colors hover:bg-paper-2">
                  <th scope="row" className="py-4 pr-4 text-left font-normal">
                    <Link href={`/ideas/${i.slug}`} className="block">
                      <span className="font-serif text-lg leading-tight"><span className="link-draw">{i.company}</span></span>
                      <span className="num ml-2 text-[0.6875rem] tracking-wider text-muted">{i.ticker}</span>
                    </Link>
                  </th>
                  <td className="py-4 pr-4 text-ink-2">{i.sector}</td>
                  <td className="py-4 pr-4"><StatusMark status={i.status} /></td>
                  <td className="py-4 pr-4 text-ink-2">{i.horizon}</td>
                  {[0, 1, 2].map((k) => (
                    <td key={k} className="num py-4 pl-4 text-right text-[0.8125rem]">{i.metrics[k]?.value ?? "—"}</td>
                  ))}
                  <td className="num py-4 pl-4 text-right text-[0.8125rem] text-muted">{formatDate(i.dateAdded, "short")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-xs italic text-muted">
            Sample data on fictional companies. No live prices are shown; metrics are entered by hand in each idea file.
          </p>
        </div>
      )}
    </div>
  );
}
