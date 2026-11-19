import type { Metadata } from "next";
import Link from "next/link";
import { getArchive, getIdeas } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { PageHeader, SectionHeading } from "@/components/ui/bits";
import { IdeasNotebook } from "@/components/ideas/IdeasNotebook";

export const metadata: Metadata = {
  title: "Trade Ideas & Investment Notebook",
  description: "A working notebook of investment ideas: theses, bull and bear cases, and what would change my mind.",
};

export default function IdeasPage() {
  const ideas = getIdeas().map(({ body: _b, tracker: _t, retrospective: _r, ...i }) => i);
  const archive = getArchive();
  return (
    <>
      <PageHeader
        kicker="Trade Ideas & Investment Notebook"
        title={<>Ideas, held <em className="text-accent">loosely</em> and written down.</>}
        lede="Every entry states a thesis, argues against itself, and names what would prove it wrong. This is a notebook for my own thinking — not a list of recommendations."
      >
        <p className="mt-6 text-sm text-muted">
          Looking for how old ideas turned out?{" "}
          <Link href="/retrospectives" className="text-accent underline underline-offset-4">Conviction vs. Reality</Link>
        </p>
      </PageHeader>

      <div className="container-page">
        <IdeasNotebook ideas={ideas} />
      </div>

      <section id="archive" className="container-page mt-24 scroll-mt-10">
        <SectionHeading title="The Idea Archive" />
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12">
          <p className="font-serif text-xl leading-relaxed text-ink-2 lg:col-span-4">
            Companies, business models and industries I have not studied yet but do not want to forget. A waiting room
            for curiosity.
          </p>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
            {archive.map((a) => (
              <li key={a.name} className="border-t border-rule py-4">
                <p className="kicker">{a.kind} · noted {formatDate(a.added, "month")}</p>
                <p className="mt-1.5 font-serif text-xl leading-snug">{a.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{a.why}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
