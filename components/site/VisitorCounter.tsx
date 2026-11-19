"use client";

import { useEffect, useState } from "react";

const FLAG = "journal:visited";

/**
 * "Readers to date" tally in the footer. A browser is counted once: the first
 * visit records it, later visits only read the total.
 */
export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let seen = false;
    try {
      seen = localStorage.getItem(FLAG) === "1";
    } catch {}

    fetch("/api/visits", { method: seen ? "GET" : "POST" })
      .then((r) => r.json())
      .then((data: { count: number | null }) => {
        if (cancelled || typeof data.count !== "number") return;
        setCount(data.count);
        try {
          localStorage.setItem(FLAG, "1");
        } catch {}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;
  const digits = String(count).padStart(6, "0").split("");

  return (
    <p className="kicker flex items-center gap-3" aria-label={`${count.toLocaleString("en-IN")} readers to date`}>
      <span aria-hidden>Readers to date</span>
      <span aria-hidden className="flex gap-px">
        {digits.map((d, i) => (
          <span key={i} className="num inline-block border border-rule px-1 py-0.5 text-[0.75rem] leading-none text-ink">
            {d}
          </span>
        ))}
      </span>
    </p>
  );
}
