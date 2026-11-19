"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle light and dark edition"
      className="inline-flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-ink"
    >
      <Sun size={15} strokeWidth={1.5} className="hidden dark:block" />
      <Moon size={15} strokeWidth={1.5} className="dark:hidden" />
    </button>
  );
}
