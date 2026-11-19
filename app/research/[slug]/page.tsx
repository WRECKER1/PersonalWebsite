import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileDown } from "lucide-react";
import { getIdeas, getResearch, getSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { researchLabel } from "@/lib/types";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ReadingProgress, TableOfContents } from "@/components/mdx/ReadingAids";
import { SampleTag } from "@/components/ui/bits";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getResearch().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = getResearch().find((x) => x.slug === slug);
  if (!r) return {};
  return {
    title: r.title,
    description: r.summary,
    openGraph: { type: "article", title: r.title, description: r.summary, publishedTime: r.date },
  };
}

export default async function ReportPage({ params }: Props) {
  const { slug } = await params;
  const all = getResearch();
  const report = all.find((r) => r.slug === slug);
  if (!report) notFound();
  const site = getSite();
  const idea = getIdeas().find((i) => i.research === report.slug);
  const more = all.filter((r) => r.slug !== report.slug).slice(0, 2);

  const facts = [
    ["Subject", report.ticker ? `${report.subject} (${report.ticker})` : report.subject],
    ["Industry", report.industry],
    ["Category", researchLabel(report.category)],
    ["Horizon", report.horizon],
    ["Published", formatDate(report.date)],
    ["Reading time", `${report.readingTime} minutes`],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: report.title,
    description: report.summary,
    datePublished: report.date,
    author: { "@type": "Person", name: site.author.name },
  };

  return (
    <article>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="container-page pt-10 md:pt-16">
        <Link href="/research" className="no-print group kicker inline-flex items-center gap-2 hover:text-ink">
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" /> Research Desk
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="kicker !text-accent">{researchLabel(report.category)}</span>
          <span className="kicker">{formatDate(report.date)}</span>
          {report.sample && <SampleTag />}
        </div>
        <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1] tracking-[-0.03em]">
          {report.title}
        </h1>
        <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed text-ink-2 md:text-2xl">{report.summary}</p>
      </header>

      <div className="container-page mt-12 grid gap-x-12 gap-y-10 rule-top pt-10 lg:grid-cols-12">
        <aside className="no-print hidden lg:col-span-3 lg:block">
          <div className="sticky top-8">
            <TableOfContents headings={report.headings} />
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-6">
          {report.sample && (
            <p className="mb-8 border border-dashed border-burgundy/60 px-4 py-3 text-sm leading-relaxed text-ink-2">
              <strong className="font-semibold text-burgundy">Illustrative sample.</strong> The company, figures and
              events in this report are fictional and exist to demonstrate the template. Nothing here is real
              financial data or investment advice.
            </p>
          )}
          <MDXContent source={report.body} charts={report.charts} />
        </div>

        <aside className="lg:col-span-3">
          <div className="sticky top-8 space-y-8">
            <div>
              <p className="kicker mb-3">Fact sheet</p>
              <dl className="divide-y divide-rule border-y border-ink text-sm">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {report.pdf && (
              <a
                href={report.pdf}
                download
                className="no-print group flex items-center justify-between border border-ink px-4 py-3 text-sm transition-colors hover:bg-ink hover:text-paper"
              >
                Download the PDF report
                <FileDown size={16} strokeWidth={1.5} />
              </a>
            )}
            {idea && (
              <Link href={`/ideas/${idea.slug}`} className="no-print group block border-t border-rule pt-4 text-sm">
                <span className="kicker block">In the notebook</span>
                <span className="link-draw mt-1 inline-block font-serif text-lg">
                  {idea.company} — {idea.status}
                </span>
              </Link>
            )}
          </div>
        </aside>
      </div>

      {more.length > 0 && (
        <div className="no-print container-page mt-24">
          <p className="kicker border-t border-ink pt-3">Also from the desk</p>
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            {more.map((r) => (
              <Link key={r.slug} href={`/research/${r.slug}`} className="group block">
                <p className="kicker !text-accent">{researchLabel(r.category)}</p>
                <p className="mt-2 font-serif text-2xl leading-tight tracking-[-0.015em]">
                  <span className="link-draw">{r.title}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
