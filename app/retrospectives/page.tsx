import type { Metadata } from "next";
import Link from "next/link";
import { getIdeas } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { EmptyState, PageHeader, SampleTag } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Conviction vs. Reality",
  description: "Retrospectives on closed investment ideas: what I expected, what happened, and what I learned.",
};

export default function RetrospectivesPage() {
  const closed = getIdeas()
    .filter((i) => i.retrospective)
    .sort((a, b) => b.retrospective!.closedOn.localeCompare(a.retrospective!.closedOn));

  return (
    <>
      <PageHeader
        kicker="Conviction vs. Reality"
        title={<>What I believed, and <em className="text-accent">what actually happened.</em></>}
        lede="Old ideas, revisited honestly. The point is not to keep score but to find the errors in process — the mistakes are the most useful pages in this notebook."
      />
      <div className="container-page">
        {closed.length === 0 ? (
          <EmptyState title="No closed ideas yet." hint="Add a retrospective block to an idea file once it is closed." />
        ) : (
          <ol className="border-t border-ink">
            {closed.map((i) => (
              <li key={i.slug} className="border-b border-rule py-10 md:py-14">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="kicker">Added {formatDate(i.dateAdded, "short")} → Closed {formatDate(i.retrospective!.closedOn, "short")}</span>
                  {i.sample && <SampleTag />}
                </div>
                <h2 className="mt-3 font-serif text-4xl tracking-[-0.025em] md:text-5xl">
                  <Link href={`/ideas/${i.slug}`} className="group"><span className="link-draw">{i.company}</span></Link>
                </h2>
                <p className="mt-2 font-serif text-xl italic text-ink-2">{i.retrospective!.verdict}</p>
                <div className="mt-8 grid gap-y-8 md:grid-cols-[1fr_1fr_1fr] md:gap-x-0">
                  <div className="md:pr-10">
                    <h3 className="kicker border-t-2 border-accent pt-3 !text-accent">Conviction — what I expected</h3>
                    <p className="mt-4 leading-relaxed text-ink-2">{i.retrospective!.expected}</p>
                  </div>
                  <div className="md:border-l md:border-rule md:px-10">
                    <h3 className="kicker border-t-2 border-burgundy pt-3 !text-burgundy">Reality — what happened</h3>
                    <p className="mt-4 leading-relaxed text-ink-2">{i.retrospective!.actual}</p>
                  </div>
                  <div className="md:border-l md:border-rule md:pl-10">
                    <h3 className="kicker border-t-2 border-ink pt-3">The lesson I am keeping</h3>
                    <p className="mt-4 font-serif text-lg leading-relaxed">{i.retrospective!.lesson}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
