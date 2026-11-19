"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import type { Heading } from "@/lib/types";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="no-print fixed inset-x-0 top-0 z-40 h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;
  return (
    <nav aria-label="Table of contents">
      <p className="kicker mb-4">Contents</p>
      <ol className="space-y-2.5 border-l border-rule">
        {headings.map((h, i) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={active === h.id ? "location" : undefined}
              className={`-ml-px flex gap-3 border-l pl-4 text-[0.8125rem] leading-snug transition-colors ${
                active === h.id ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
              }`}
            >
              <span className="num text-[0.625rem] leading-[1.6]">{String(i + 1).padStart(2, "0")}</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
