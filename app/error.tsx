"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-28 text-center md:py-40">
      <p className="kicker">Erratum</p>
      <h1 className="mx-auto mt-5 max-w-2xl font-serif text-5xl leading-[1.02] tracking-[-0.03em]">
        Something went wrong on this page.
      </h1>
      <p className="mx-auto mt-6 max-w-md text-ink-2">
        It is most likely a formatting slip in a content file. Try again, or check the most recently edited entry.
      </p>
      <button type="button" onClick={reset} className="mt-9 border-b border-ink pb-1 text-sm">
        Try again
      </button>
    </div>
  );
}
