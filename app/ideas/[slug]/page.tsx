import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getIdeas, getResearch } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ThesisTracker } from "@/components/ideas/ThesisTracker";
import { SampleTag, StatusMark } from "@/components/ui/bits";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getIdeas().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const i = getIdeas().find((x) => x.slug === slug);
  if (!i) return {};
  return { title: `${i.company} (${i.ticker})`, description: i.thesis };
}

function Points({ title, items, tone = "ink" }: { title: string; items: string[]; tone?: "ink" | "accent" | "burgundy" }) {
  const border = tone === "accent" ? "border-accent" : tone === "burgundy" ? "border-burgundy" : "border-ink";
  const text = tone === "accent" ? "!text-accent" : tone === "burgundy" ? "!text-burgundy" : "";
  return (
    <section className={`border-t-2 ${border} pt-4`}>
      <h2 className={`kicker ${text}`}>{title}</h2>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((t, i) => (
            <li key={i} className="grid grid-cols-[1.75rem_1fr] leading-relaxed text-ink-2">
              <span className="num pt-1 text-[0.6875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
              {t}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm italic text-muted">Not written yet.</p>
      )}
    </section>
  );
}

export default async function IdeaPage({ params }: Props) {
  const { slug } = await params;
  const idea = getIdeas().find((i) => i.slug === slug);
  if (!idea) notFound();
  const report = idea.research ? getResearch().find((r) => r.slug === idea.research) : undefined;

  return (
    <article>
      <header className="container-page pt-10 md:pt-16">
        <Link href="/ideas" className="group kicker inline-flex items-center gap-2 hover:text-ink">
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" /> The Notebook
        </Link>
        <div className="mt-8 grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="num text-xs tracking-widest text-muted">{idea.ticker}</span>
              <StatusMark status={idea.status} />
              {idea.sample && <SampleTag label="Fictional company · sample data" />}
            </div>
            <h1 className="mt-4 font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.035em]">
              {idea.company}
            </h1>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 self-end border-t border-rule pt-4 text-sm lg:col-span-4">
            <div><dt className="kicker">Sector</dt><dd className="mt-1">{idea.sector}</dd></div>
            <div><dt className="kicker">Type</dt><dd className="mt-1">{idea.category}</dd></div>
            <div><dt className="kicker">Added</dt><dd className="mt-1">{formatDate(idea.dateAdded)}</dd></div>
            <div><dt className="kicker">Horizon</dt><dd className="mt-1">{idea.horizon}</dd></div>
          </dl>
        </div>
      </header>

      <div className="container-page mt-12 grid gap-x-12 gap-y-12 rule-top pt-10 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <h2 className="kicker">Core thesis</h2>
          <p className="mt-4 font-serif text-[1.6rem] leading-[1.4] tracking-[-0.01em] md:text-[2rem]">{idea.thesis}</p>
        </section>
        <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
          <h2 className="kicker">Key metrics</h2>
          <dl className="mt-4 divide-y divide-rule border-y border-rule">
            {idea.metrics.map((m) => (
              <div key={m.label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-sm text-ink-2">{m.label}</dt>
                <dd className="num text-sm">{m.value}</dd>
              </div>
            ))}
          </dl>
          {idea.sample && <p className="mt-2 text-xs italic text-muted">Invented figures for layout purposes only.</p>}
        </aside>
      </div>

      <div className="container-page mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2">
        <Points title="The bull case" items={idea.bull} tone="accent" />
        <Points title="The bear case" items={idea.bear} tone="burgundy" />
      </div>

      <div className="container-page mt-16 grid gap-x-12 gap-y-12 lg:grid-cols-12">
        <section className="border-t-2 border-ink pt-4 lg:col-span-4">
          <h2 className="kicker">Valuation observations</h2>
          <p className="mt-4 leading-relaxed text-ink-2">{idea.valuation}</p>
        </section>
        <div className="lg:col-span-4"><Points title="Potential catalysts" items={idea.catalysts} /></div>
        <div className="lg:col-span-4"><Points title="Key risks" items={idea.risks} /></div>
      </div>

      <section className="container-page mt-16">
        <div className="border border-ink p-6 md:p-10">
          <h2 className="font-serif text-3xl italic tracking-[-0.02em]">What would change my mind</h2>
          <p className="mt-2 text-sm text-muted">Written in advance, so that I cannot quietly move the goalposts later.</p>
          <ul className="mt-6 grid gap-x-10 gap-y-4 md:grid-cols-2">
            {idea.invalidation.map((t, i) => (
              <li key={i} className="grid grid-cols-[1.5rem_1fr] border-t border-rule pt-3 leading-relaxed">
                <span aria-hidden className="text-burgundy">×</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="tracker" className="container-page mt-20 grid scroll-mt-10 gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-serif text-4xl leading-tight tracking-[-0.025em]">Thesis Tracker</h2>
          <p className="mt-3 max-w-sm leading-relaxed text-ink-2">
            A dated record of how my view has changed: new developments, revised assumptions, and lessons — including the
            uncomfortable ones.
          </p>
        </div>
        <div className="lg:col-span-8"><ThesisTracker entries={idea.tracker ?? []} /></div>
      </section>

      {idea.retrospective && (
        <section className="container-page mt-20">
          <div className="bg-paper-2 p-6 md:p-10">
            <p className="kicker">Conviction vs. Reality · Closed {formatDate(idea.retrospective.closedOn)}</p>
            <p className="mt-3 font-serif text-3xl italic tracking-[-0.02em]">{idea.retrospective.verdict}</p>
            <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-3">
              <div><h3 className="kicker !text-accent">What I expected</h3><p className="mt-3 leading-relaxed text-ink-2">{idea.retrospective.expected}</p></div>
              <div><h3 className="kicker !text-burgundy">What happened</h3><p className="mt-3 leading-relaxed text-ink-2">{idea.retrospective.actual}</p></div>
              <div><h3 className="kicker">The lesson</h3><p className="mt-3 leading-relaxed text-ink-2">{idea.retrospective.lesson}</p></div>
            </div>
          </div>
        </section>
      )}

      {idea.body && (
        <section className="container-page mt-20">
          <div className="mx-auto max-w-[41rem]">
            <p className="kicker mb-6 border-t border-ink pt-3">Working notes</p>
            <MDXContent source={idea.body} />
          </div>
        </section>
      )}

      {report && (
        <div className="container-page mt-16">
          <Link href={`/research/${report.slug}`} className="group flex flex-wrap items-baseline justify-between gap-4 border-y border-ink py-5">
            <span>
              <span className="kicker block">Full report on the Research Desk</span>
              <span className="mt-1 block font-serif text-2xl"><span className="link-draw">{report.title}</span></span>
            </span>
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </article>
  );
}
