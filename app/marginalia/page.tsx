import type { Metadata } from "next";
import { getMarginalia } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { EmptyState, PageHeader } from "@/components/ui/bits";

export const metadata: Metadata = {
  title: "Market Marginalia",
  description: "Short, spontaneous notes on markets, companies and the economy.",
};

const TILT = ["-rotate-[0.8deg]", "rotate-[0.5deg]", "-rotate-[0.3deg]", "rotate-[0.9deg]"];

export default function MarginaliaPage() {
  const notes = getMarginalia();
  return (
    <>
      <PageHeader
        kicker="Market Marginalia"
        title={<>Notes scribbled <em className="text-accent">in the margin.</em></>}
        lede="Half-formed observations, written quickly. Some become journal entries. Most are simply a record of what caught my attention."
      />
      <div className="container-page">
        {notes.length === 0 ? (
          <EmptyState title="The margins are clean, for now." />
        ) : (
          <ul className="grid gap-x-12 border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((n, i) => (
              <li key={i} className="border-b border-rule py-9">
                <div className={TILT[i % TILT.length]}>
                  <p className="font-hand text-[1.75rem] leading-[1.2] text-accent">{n.note}</p>
                </div>
                <p className="kicker mt-4">{formatDate(n.date, "short")}{n.tag ? ` · ${n.tag}` : ""}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
