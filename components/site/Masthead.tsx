"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/nav";
import { ThemeToggle } from "./ThemeToggle";

const noop = () => () => {};
const todayString = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** Today's date, rendered on the client only so static pages never go stale. */
function Dateline() {
  const today = useSyncExternalStore(noop, todayString, () => "");
  return <span>{today || "\u00a0"}</span>;
}

export function Masthead({ title, established }: { title: string; established: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="no-print">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <div className="container-page">
        <div className="kicker flex h-10 items-center justify-between border-b border-rule">
          <span className="hidden sm:inline"><Dateline /></span>
          <span className="sm:hidden">Est. {established}</span>
          <span className="hidden md:inline">Vol. I · An independent investment notebook</span>
          <span className="flex items-center gap-3">
            <span className="hidden sm:inline">Est. {established}</span>
            <ThemeToggle />
          </span>
        </div>

        <div className="flex items-center justify-between py-5 md:justify-center md:py-7">
          <Link
            href="/"
            className="font-serif text-[1.65rem] leading-none tracking-[-0.02em] md:text-[2.6rem]"
            aria-label={`${title} — home`}
          >
            {title}
          </Link>
          <button
            type="button"
            className="md:hidden -mr-2 inline-flex h-10 w-10 items-center justify-center"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>

        <nav aria-label="Primary" className="rule-double hidden border-b border-rule md:block">
          <ul className="flex items-center justify-center gap-x-9 py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`group text-[0.8125rem] tracking-wide transition-colors ${
                    isActive(item.href) ? "text-accent" : "text-ink-2 hover:text-ink"
                  }`}
                >
                  <span className="link-draw pb-0.5">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          id="mobile-nav"
          aria-label="Primary mobile"
          className={`rule-double md:hidden ${open ? "block" : "hidden"}`}
        >
          <ul className="divide-y divide-rule border-b border-rule">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-3.5 font-serif text-xl"
                >
                  <span className="num text-[0.6875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {!open && <div className="rule-double md:hidden" />}
      </div>
    </header>
  );
}
