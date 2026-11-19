import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { IdeaStatus } from "@/lib/types";

/** Numbered section heading with a rule: "№ 02 — Research Desk ————— All reports →" */
export function SectionHeading({
  no, title, href, cta,
}: { no?: string; title: string; href?: string; cta?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-ink pt-3">
      {no && <span className="kicker whitespace-nowrap">No. {no}</span>}
      <h2 className="font-serif text-[1.35rem] leading-none tracking-[-0.01em] italic">{title}</h2>
      {href && (
        <Link href={href} className="group kicker ml-auto inline-flex items-center gap-1.5 whitespace-nowrap hover:text-ink">
          <span className="link-draw pb-0.5">{cta ?? "View all"}</span>
          <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

/** Marks content that is placeholder / illustrative rather than real analysis. */
export function SampleTag({ label = "Illustrative sample" }: { label?: string }) {
  return (
    <span
      title="Placeholder content with fictional companies and invented figures. Not real financial data."
      className="kicker inline-block border border-dashed border-burgundy/60 px-1.5 py-0.5 !text-[0.5625rem] !text-burgundy"
    >
      {label}
    </span>
  );
}

const STATUS_MARK: Record<IdeaStatus, string> = {
  "Under Research": "border border-ink-2",
  "Active Thesis": "bg-accent",
  Monitoring: "border border-accent bg-[linear-gradient(90deg,var(--accent)_50%,transparent_50%)]",
  Closed: "bg-muted/50",
};

export function StatusMark({ status }: { status: IdeaStatus }) {
  return (
    <span className="kicker inline-flex items-center gap-2 whitespace-nowrap !text-ink-2">
      <span aria-hidden className={`inline-block h-2 w-2 rounded-full ${STATUS_MARK[status] ?? ""}`} />
      {status}
    </span>
  );
}

export function PageHeader({
  kicker, title, lede, children,
}: { kicker: string; title: ReactNode; lede?: string; children?: ReactNode }) {
  return (
    <div className="container-page pt-12 pb-10 md:pt-20 md:pb-14">
      <p className="kicker">{kicker}</p>
      <h1 className="mt-4 max-w-4xl font-serif text-[clamp(2.6rem,6.5vw,5.25rem)] leading-[0.98] tracking-[-0.03em]">
        {title}
      </h1>
      {lede && <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-ink-2 md:text-[1.4rem]">{lede}</p>}
      {children}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border-y border-dashed border-rule py-16 text-center">
      <p className="font-serif text-2xl italic">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function FilterBar<T extends string>({
  options, value, onChange, label,
}: { options: { key: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-x-6 gap-y-2">
      {options.map((o) => {
        const active = o.key === value;
        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.key)}
            className={`group border-b pb-1 text-[0.8125rem] transition-colors ${
              active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {o.label}
            {o.count !== undefined && <sup className="num ml-1 text-[0.625rem] text-muted">{o.count}</sup>}
          </button>
        );
      })}
    </div>
  );
}
