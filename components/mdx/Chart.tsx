"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { ChartSpec } from "@/lib/types";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

type TipProps = {
  active?: boolean;
  label?: string | number;
  payload?: { name?: string; value?: number | string; color?: string }[];
  unit?: string;
};

function Tip({ active, payload, label, unit }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-ink bg-paper px-3 py-2 text-xs shadow-[3px_3px_0_0_var(--rule)]">
      <p className="kicker mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-2 text-ink">
          <span aria-hidden className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink-2">{p.name}</span>
          <span className="num ml-auto pl-4">{p.value}{unit ? ` ${unit}` : ""}</span>
        </p>
      ))}
    </div>
  );
}

/** A figure driven entirely by the `charts:` block in a report's front matter. */
export function ChartFigure({ spec }: { spec?: ChartSpec }) {
  if (!spec) {
    return (
      <p className="border border-dashed border-rule p-4 font-sans text-sm text-muted">
        Chart not found — check that the id matches an entry under <code>charts:</code> in the front matter.
      </p>
    );
  }
  const axis = {
    tickLine: false,
    axisLine: false,
    tick: { fontSize: 11 },
  };
  const common = { data: spec.data, margin: { top: 8, right: 8, bottom: 0, left: -12 } };
  const multi = spec.series.length > 1;
  const shared = (
    <>
      <CartesianGrid vertical={false} stroke="var(--rule)" strokeDasharray="2 4" />
      <XAxis dataKey={spec.x} {...axis} axisLine={{ stroke: "var(--ink)" }} dy={6} />
      <YAxis {...axis} width={52} />
      <Tooltip content={<Tip unit={spec.unit} />} cursor={{ stroke: "var(--muted)", strokeWidth: 1, fill: "var(--paper-2)" }} />
      {multi && (
        <Legend
          verticalAlign="top"
          align="left"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingBottom: 12, left: 12 }}
          formatter={(v) => <span style={{ color: "var(--ink-2)" }}>{v}</span>}
        />
      )}
    </>
  );

  return (
    <figure className="!my-10 font-sans">
      <figcaption className="mb-4 border-t-2 border-ink pt-3">
        <p className="text-[0.9375rem] font-semibold leading-snug">{spec.title}</p>
        {spec.unit && <p className="kicker mt-1">{spec.unit}</p>}
      </figcaption>
      <div className="h-64 w-full" role="img" aria-label={spec.title}>
        <ResponsiveContainer width="100%" height="100%">
          {spec.type === "bar" ? (
            <BarChart {...common} barGap={2}>
              {shared}
              {spec.series.map((s, i) => (
                <Bar key={s.key} dataKey={s.key} name={s.label} fill={COLORS[i % 3]} radius={[4, 4, 0, 0]} maxBarSize={28} />
              ))}
            </BarChart>
          ) : spec.type === "area" ? (
            <AreaChart {...common}>
              {shared}
              {spec.series.map((s, i) => (
                <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={COLORS[i % 3]} strokeWidth={2} fill={COLORS[i % 3]} fillOpacity={0.12} />
              ))}
            </AreaChart>
          ) : (
            <LineChart {...common}>
              {shared}
              {spec.series.map((s, i) => (
                <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={COLORS[i % 3]} strokeWidth={2} dot={{ r: 3, strokeWidth: 2, stroke: "var(--paper)", fill: COLORS[i % 3] }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <details className="no-print mt-3 text-xs text-muted">
        <summary className="kicker cursor-pointer hover:text-ink">View data table</summary>
        <div className="table-wrap !my-3">
          <table>
            <thead>
              <tr>
                <th>{spec.x}</th>
                {spec.series.map((s) => <th key={s.key} align="right">{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {spec.data.map((row, i) => (
                <tr key={i}>
                  <td>{row[spec.x]}</td>
                  {spec.series.map((s) => <td key={s.key} align="right">{row[s.key]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      {spec.note && <p className="mt-2 text-xs italic text-muted">{spec.note}</p>}
    </figure>
  );
}
