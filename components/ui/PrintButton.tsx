"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-sm transition-colors hover:bg-ink hover:text-paper"
    >
      <Printer size={15} strokeWidth={1.5} /> Print
    </button>
  );
}
