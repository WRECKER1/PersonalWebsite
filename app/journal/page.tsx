import type { Metadata } from "next";
import Link from "next/link";
import { getJournal } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { PageHeader, SampleTag } from "@/components/ui/bits";
import { JournalIndex } from "@/components/journal/JournalIndex";

export const metadata: Metadata = {
  title: "The Journal",
  description: "Notes on businesses, markets, capital allocation and the process of learning to invest.",
};

export default function JournalPage() {
  const posts = getJournal();
  const featured = posts.filter((p) => p.featured).slice(0, 2);
  const cards = posts.map(({ body: _b, ...p }) => p);

  return (
    <>
      <PageHeader
        kicker="The Journal"
        title={<>Thinking out loud, <em className="text-accent">slowly.</em></>}
        lede="Lessons from analysing businesses, notes from CFA preparation and business school, and ideas I want to be able to find again."
      />
      <div className="container-page">
        {featured.length > 0 && (
          <div className="mb-14 grid gap-x-12 gap-y-10 border-t border-ink pt-8 md:grid-cols-2">
            {featured.map((p, i) => (
              <Link key={p.slug} href={`/journal/${p.slug}`} className={`group block ${i ? "md:border-l md:border-rule md:pl-12" : ""}`}>
                <p className="flex flex-wrap items-center gap-3">
                  <span className="kicker !text-accent">Featured · {p.category}</span>
                  {p.sample && <SampleTag label="Sample essay" />}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.025em] md:text-[2.75rem]">
                  <span className="link-draw">{p.title}</span>
                </h2>
                <p className="mt-4 font-serif text-lg leading-relaxed text-ink-2">{p.excerpt}</p>
                <p className="kicker mt-5">{formatDate(p.date)} · {p.readingTime} min read</p>
              </Link>
            ))}
          </div>
        )}
        <JournalIndex posts={cards} />
      </div>
    </>
  );
}
