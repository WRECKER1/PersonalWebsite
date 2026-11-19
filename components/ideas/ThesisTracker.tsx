"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDate } from "@/lib/format";
import type { TrackerEntry } from "@/lib/types";

const LEVELS = ["", "Doubtful", "Tentative", "Moderate", "Firm", "High"];

type TipProps = { active?: boolean; payload?: { payload: TrackerEntry }[] };
function Tip({ active, payload }: TipProps) {
  const e = payload?.[0]?.payload;
  if (!active || !e) return null;
  return (
    <div className="max-w-56 border border-ink bg-paper px-3 py-2 text-xs shadow-[3px_3px_0_0_var(--rule)]">
      <p className="kicker">{formatDate(e.date, "short")}</p>
      <p className="mt-1 font-serif text-sm leading-snug">{e.title}</p>
      <p className="num mt-1 text-ink-2">Conviction {e.conviction}/5 · {LEVELS[e.conviction]}</p>
    </div>
  );
}

/** How a thesis has moved over time: a conviction line plus dated entries. */
export function ThesisTracker({ entries }: { entries: TrackerEntry[] }) {
  if (!entries.length) {
    return <p className="border-y border-dashed border-rule py-8 text-center font-serif italic text-muted">No tracker entries yet. The first one is usually the hardest to write.</p>;
  }
  return (
    <div>
      {entries.length > 1 && (
        <figure className="mb-10">
          <figcaption className="kicker mb-3">Conviction over time · 1 (doubtful) to 5 (high)</figcaption>
          <div className="h-40 w-full" role="img" aria-label="Conviction level over time">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries} margin={{ top: 8, right: 12, bottom: 0, left: -28 }}>
                <CartesianGrid vertical={false} stroke="var(--rule)" strokeDasharray="2 4" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d: string) => formatDate(d, "short").slice(0, 6)}
                  tickLine={false}
                  axisLine={{ stroke: "var(--ink)" }}
                  tick={{ fontSize: 11 }}
                  dy={6}
                />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<Tip />} cursor={{ stroke: "var(--muted)", strokeWidth: 1 }} />
                <Line
                  type="stepAfter"
                  dataKey="conviction"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, stroke: "var(--paper)", fill: "var(--chart-1)" }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </figure>
      )}
      <ol className="border-l border-rule">
        {[...entries].reverse().map((e, i) => (
          <li key={i} className="relative pb-8 pl-6 last:pb-0 md:pl-8">
            <span aria-hidden className="absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full bg-accent ring-4 ring-paper" />
            <p className="kicker flex flex-wrap gap-x-3">
              <span>{formatDate(e.date)}</span>
              {e.type && <span className="!text-accent">{e.type}</span>}
              <span>Conviction {e.conviction}/5</span>
            </p>
            <h3 className="mt-2 font-serif text-xl leading-snug">{e.title}</h3>
            <p className="mt-1.5 max-w-2xl leading-relaxed text-ink-2">{e.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
