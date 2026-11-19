import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FOOTER_NAV } from "@/lib/nav";
import type { Site } from "@/lib/types";
import { VisitorCounter } from "./VisitorCounter";

export function Footer({ site }: { site: Site }) {
  return (
    <footer className="no-print mt-28">
      <div className="container-page">
        <div className="rule-double grid gap-12 pt-10 pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-serif text-3xl leading-tight tracking-[-0.02em]">{site.title}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-2">{site.description}</p>
            <a href={`mailto:${site.email}`} className="group mt-6 inline-block text-sm">
              <span className="link-draw pb-0.5">{site.email}</span>
            </a>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 hover:text-ink">
                    <span className="link-draw pb-0.5">{s.label}</span>
                    <ArrowUpRight size={13} strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {FOOTER_NAV.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="md:col-span-2 md:first-of-type:col-start-7">
              <p className="kicker mb-4">{col.heading}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="group text-ink-2 hover:text-ink">
                      <span className="link-draw pb-0.5">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-rule py-6 text-xs leading-relaxed text-muted md:flex md:justify-between md:gap-10">
          <p className="max-w-3xl">{site.disclaimer}</p>
          <div className="mt-4 flex shrink-0 flex-col gap-3 md:mt-0 md:items-end">
            <VisitorCounter />
            <p>© {site.established}–present {site.author.name}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
