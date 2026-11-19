import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { getAbout, getSite } from "@/lib/content";
import { MDXContent } from "@/components/mdx/MDXContent";
import { PageHeader } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "The person behind the journal: background, route into finance, and what I am working towards.",
};

export default function AboutPage() {
  const about = getAbout();
  const site = getSite();
  const linkedin = site.socials.find((s) => /linkedin/i.test(s.label));

  return (
    <>
      <PageHeader kicker="About the author" title={about.title} lede={about.lede} />

      <div className="container-page grid gap-x-12 gap-y-14 rule-top pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MDXContent source={about.body} className="dropcap" />
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/resume" className="group inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink">
              <FileText size={15} strokeWidth={1.5} /> View the resume
            </Link>
            {linkedin && (
              <a href={linkedin.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-sm transition-colors hover:bg-ink hover:text-paper">
                LinkedIn <ArrowUpRight size={15} strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>

        <aside className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-12" aria-label="Timeline">
          <p className="kicker mb-8">Milestones, so far</p>
          <ol className="border-l border-ink">
            {about.timeline.map((t, i) => (
              <li key={i} className="relative pb-9 pl-7 last:pb-0">
                <span aria-hidden className="absolute -left-[4.5px] top-1.5 h-2 w-2 rotate-45 bg-accent ring-4 ring-paper" />
                <Reveal>
                  <p className="kicker">{t.period}</p>
                  <h3 className="mt-1.5 font-serif text-2xl leading-tight tracking-[-0.015em]">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{t.note}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  );
}
