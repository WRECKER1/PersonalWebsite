import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getIdeas, getJournal, getLedger, getMarginalia, getResearch, getSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { researchLabel } from "@/lib/types";
import { Reveal } from "@/components/ui/Reveal";
import { SampleTag, SectionHeading, StatusMark } from "@/components/ui/bits";

export default function Home() {
  const site = getSite();
  const research = getResearch();
  const lead = research.find((r) => r.featured) ?? research[0];
  const otherResearch = research.filter((r) => r.slug !== lead?.slug).slice(0, 3);
  const journal = getJournal().slice(0, 4);
  const ideas = getIdeas().filter((i) => i.status !== "Closed").slice(0, 4);
  const marginalia = getMarginalia().slice(0, 4);
  const ledger = getLedger().slice(0, 4);
  const [mottoHead, mottoTail] = site.motto.split("&").map((s) => s.trim());

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="container-page grid gap-x-12 gap-y-12 pt-12 pb-16 md:pt-20 md:pb-24 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="kicker">The front page · Research, ideas &amp; observations</p>
          <h1 className="mt-6 font-serif text-[clamp(3.25rem,10.5vw,9rem)] leading-[0.9] tracking-[-0.04em]">
            {mottoHead}{" "}
            {mottoTail && (
              <>
                <em className="font-light text-accent">&amp;</em> {mottoTail}
                <span className="text-accent">.</span>
              </>
            )}
          </h1>
          <p className="mt-9 max-w-xl font-serif text-xl leading-relaxed text-ink-2 md:text-2xl">
            {site.description}
          </p>
        </div>

        <aside className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10" aria-label="About the author">
          <p className="kicker">Kept by</p>
          <p className="mt-3 font-serif text-3xl leading-tight tracking-[-0.02em]">{site.author.name}</p>
          <p className="mt-1 text-sm text-muted">{site.author.role}</p>
          <dl className="mt-7 divide-y divide-rule border-y border-rule text-sm">
            {site.intro.map((row) => (
              <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-3 py-3">
                <dt className="kicker pt-0.5">{row.label}</dt>
                <dd className="leading-snug text-ink-2">{row.value}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about" className="group mt-6 inline-flex items-center gap-2 text-sm">
            <span className="link-draw pb-0.5">Read the longer version</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </aside>
      </section>

      {/* ───────────── Featured research ───────────── */}
      <section className="container-page pb-20">
        <SectionHeading no="01" title="From the Research Desk" href="/research" cta="The full library" />
        {lead && (
          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <Link href={`/research/${lead.slug}`} className="group block">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="kicker !text-accent">{researchLabel(lead.category)}</span>
                  <span className="kicker">{formatDate(lead.date)}</span>
                  {lead.sample && <SampleTag />}
                </div>
                <h3 className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.025em] md:text-[3.25rem]">
                  <span className="link-draw">{lead.title}</span>
                </h3>
                <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-ink-2">{lead.summary}</p>
                <dl className="mt-7 grid max-w-xl grid-cols-3 gap-6 border-t border-rule pt-4 text-sm">
                  <div><dt className="kicker">Subject</dt><dd className="mt-1">{lead.subject}</dd></div>
                  <div><dt className="kicker">Industry</dt><dd className="mt-1">{lead.industry}</dd></div>
                  <div><dt className="kicker">Horizon</dt><dd className="mt-1">{lead.horizon}</dd></div>
                </dl>
              </Link>
            </Reveal>
            <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-12">
              <ul className="divide-y divide-rule">
                {otherResearch.map((r, i) => (
                  <li key={r.slug} className="py-5 first:pt-0 last:pb-0">
                    <Reveal delay={i * 0.06}>
                      <Link href={`/research/${r.slug}`} className="group block">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="kicker !text-accent">{researchLabel(r.category)}</span>
                          <span className="kicker">{formatDate(r.date, "short")}</span>
                        </div>
                        <h3 className="mt-2 font-serif text-2xl leading-tight tracking-[-0.015em]">
                          <span className="link-draw">{r.title}</span>
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-2">
                          {r.subject} · {r.industry}
                        </p>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* ───────────── Journal · Notebook · Marginalia ───────────── */}
      <section className="container-page grid gap-x-10 gap-y-16 pb-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading no="02" title="Latest in the Journal" href="/journal" cta="All entries" />
          <ol className="divide-y divide-rule">
            {journal.map((p) => (
              <li key={p.slug} className="py-5 first:pt-0">
                <Reveal>
                  <Link href={`/journal/${p.slug}`} className="group grid grid-cols-[4.5rem_1fr] gap-4">
                    <span className="num pt-1 text-[0.6875rem] uppercase leading-relaxed tracking-wider text-muted">
                      {formatDate(p.date, "short").slice(0, 6)}
                      <br />
                      {p.date.slice(0, 4)}
                    </span>
                    <span>
                      <span className="block font-serif text-[1.45rem] leading-snug tracking-[-0.01em]">
                        <span className="link-draw">{p.title}</span>
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-ink-2">{p.excerpt}</span>
                      <span className="kicker mt-2.5 block">
                        {p.category} · {p.readingTime} min read
                      </span>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
          <SectionHeading no="03" title="Recent Trade Ideas" href="/ideas" cta="Notebook" />
          <ul className="divide-y divide-rule">
            {ideas.map((i) => (
              <li key={i.slug} className="py-5 first:pt-0">
                <Reveal>
                  <Link href={`/ideas/${i.slug}`} className="group block">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-serif text-xl leading-tight">
                        <span className="link-draw">{i.company}</span>
                      </h3>
                      <span className="num text-[0.6875rem] tracking-wider text-muted">{i.ticker}</span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-2">{i.thesis}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <StatusMark status={i.status} />
                      <span className="kicker">{i.sector}</span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            Sample entries on fictional companies. A notebook of ideas under study — not recommendations.
          </p>
        </div>

        <div className="lg:col-span-3 lg:border-l lg:border-rule lg:pl-10">
          <SectionHeading no="04" title="Market Marginalia" href="/marginalia" cta="More" />
          <ul className="space-y-7">
            {marginalia.map((m, idx) => (
              <li key={m.date + idx} className={idx % 2 ? "rotate-[0.6deg]" : "-rotate-[0.8deg]"}>
                <p className="font-hand text-[1.45rem] leading-[1.25] text-accent">{m.note}</p>
                <p className="kicker mt-2">
                  {formatDate(m.date, "short")}
                  {m.tag ? ` · ${m.tag}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Ledger strip ───────────── */}
      <section className="container-page">
        <SectionHeading no="05" title="Recently entered in the Ledger" href="/ledger" cta="Open the ledger" />
        <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {ledger.map((e, i) => (
            <li key={i} className="relative border-t border-rule pt-4">
              <span aria-hidden className="absolute -top-[3px] left-0 h-[5px] w-[5px] rounded-full bg-accent" />
              <p className="kicker">{formatDate(e.date, "short")} · {e.type}</p>
              {e.href ? (
                <Link href={e.href} className="group mt-2 inline-flex items-start gap-1 font-serif text-lg leading-snug">
                  <span className="link-draw">{e.title}</span>
                  <ArrowUpRight size={14} className="mt-1.5 shrink-0 text-muted" />
                </Link>
              ) : (
                <p className="mt-2 font-serif text-lg leading-snug">{e.title}</p>
              )}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
