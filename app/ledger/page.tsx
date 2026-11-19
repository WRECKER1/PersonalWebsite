import type { Metadata } from "next";
import Link from "next/link";
import { getLedger } from "@/lib/content";
import { formatDate, monthKey } from "@/lib/format";
import { EmptyState, PageHeader } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "The Investment Ledger",
  description: "A chronological record of ideas, research milestones and observations.",
};

export default function LedgerPage() {
  const entries = getLedger();
  const months = [...new Set(entries.map((e) => monthKey(e.date)))];

  return (
    <>
      <PageHeader
        kicker="The Investment Ledger"
        title={<>A running record, <em className="text-accent">entered in ink.</em></>}
        lede="Every report published, idea opened, thesis revised and milestone reached, in the order it happened. Entries are added, never rewritten."
      />
      <div className="container-page">
        {entries.length === 0 ? (
          <EmptyState title="The ledger is empty." />
        ) : (
          <div className="border-t border-ink">
            {months.map((m) => (
              <section key={m} className="grid gap-x-10 border-b border-rule py-8 md:grid-cols-12 md:py-10">
                <h2 className="md:col-span-3">
                  <span className="font-serif text-3xl tracking-[-0.02em] md:sticky md:top-8 md:block">
                    {formatDate(m + "-01", "month")}
                  </span>
                </h2>
                <ol className="mt-6 md:col-span-9 md:mt-0">
                  {entries.filter((e) => monthKey(e.date) === m).map((e, i) => (
                    <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-rule py-4 first:border-t-0 first:pt-0 sm:grid-cols-[2.5rem_8.5rem_1fr]">
                      <span className="num pt-0.5 text-lg text-ink-2">{e.date.slice(8)}</span>
                      <span className={`kicker col-start-2 pt-1.5 ${e.type === "Closed" ? "!text-burgundy" : e.type === "Milestone" ? "!text-accent" : ""}`}>
                        {e.type}
                      </span>
                      <div className="col-start-2 mt-1 sm:col-start-3 sm:mt-0">
                        {e.href ? (
                          <Link href={e.href} className="group font-serif text-xl leading-snug">
                            <span className="link-draw">{e.title}</span>
                          </Link>
                        ) : (
                          <p className="font-serif text-xl leading-snug">{e.title}</p>
                        )}
                        {e.note && <p className="mt-1 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink-2">{e.note}</p>}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
