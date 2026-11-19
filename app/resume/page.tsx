import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { Download } from "lucide-react";
import { getResume, getSite } from "@/lib/content";
import { PrintButton } from "@/components/ui/PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: "Education, experience, entrepreneurship, certifications and skills.",
};

export default function ResumePage() {
  const resume = getResume();
  const site = getSite();
  const hasPdf = !!site.resumePdf && fs.existsSync(path.join(process.cwd(), "public", site.resumePdf));

  return (
    <div className="container-page pt-12 md:pt-20 print:pt-0">
      <header className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="kicker no-print">Curriculum vitae</p>
          <h1 className="mt-4 font-serif text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98] tracking-[-0.035em] print:mt-0 print:text-5xl">
            {site.author.name}
          </h1>
          <p className="mt-3 text-ink-2">
            {site.author.role} · {site.author.location} · {site.email}
          </p>
          {resume.summary && (
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink-2 print:text-base">{resume.summary}</p>
          )}
        </div>
        <div className="no-print flex flex-wrap items-end gap-3 lg:col-span-4 lg:justify-end">
          {hasPdf ? (
            <a
              href={site.resumePdf}
              download
              className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink"
            >
              <Download size={15} strokeWidth={1.5} /> Download PDF
            </a>
          ) : (
            <p className="max-w-52 text-xs text-muted">Add a PDF at public{site.resumePdf} to enable the download button.</p>
          )}
          <PrintButton />
        </div>
      </header>

      <div className="mt-12 border-t-2 border-ink print:mt-6">
        {resume.sections.map((section) => (
          <section key={section.heading} className="grid gap-x-12 gap-y-4 border-b border-rule py-8 lg:grid-cols-12 print:grid-cols-12 print:py-4">
            <h2 className="kicker !text-ink lg:col-span-3 print:col-span-3">{section.heading}</h2>
            <ul className="space-y-7 lg:col-span-9 print:col-span-9 print:space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6">
                    <h3 className="font-serif text-2xl leading-tight tracking-[-0.015em] print:text-lg">{item.title}</h3>
                    {item.period && <span className="num text-xs text-muted">{item.period}</span>}
                  </div>
                  {(item.org || item.location) && (
                    <p className="mt-0.5 text-sm text-ink-2">{[item.org, item.location].filter(Boolean).join(" · ")}</p>
                  )}
                  {item.points && (
                    <ul className="mt-3 space-y-1.5 text-[0.9375rem] leading-relaxed text-ink-2 print:mt-1 print:text-sm">
                      {item.points.map((p, j) => (
                        <li key={j} className="grid grid-cols-[1.25rem_1fr]"><span aria-hidden className="text-muted">—</span>{p}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {resume.skills.length > 0 && (
          <section className="grid gap-x-12 gap-y-4 py-8 lg:grid-cols-12 print:grid-cols-12 print:py-4">
            <h2 className="kicker !text-ink lg:col-span-3 print:col-span-3">Technical &amp; analytical skills</h2>
            <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:col-span-9 print:col-span-9 print:grid-cols-2">
              {resume.skills.map((s) => (
                <div key={s.group}>
                  <dt className="text-sm font-semibold">{s.group}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-2">{s.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>
    </div>
  );
}
