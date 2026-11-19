import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-28 text-center md:py-40">
      <p className="kicker">Error 404 · Page not in the archive</p>
      <h1 className="mx-auto mt-5 max-w-2xl font-serif text-5xl leading-[1.02] tracking-[-0.03em] md:text-7xl">
        This page was <em className="text-accent">never printed.</em>
      </h1>
      <p className="mx-auto mt-6 max-w-md text-ink-2">
        The entry you are looking for may have been moved, renamed, or is still a note in the margin.
      </p>
      <Link href="/" className="group mt-9 inline-block border-b border-ink pb-1 text-sm">
        Return to the front page
      </Link>
    </div>
  );
}
