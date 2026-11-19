import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getJournal, getSite } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { MDXContent } from "@/components/mdx/MDXContent";
import { ReadingProgress } from "@/components/mdx/ReadingAids";
import { SampleTag } from "@/components/ui/bits";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getJournal().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getJournal().find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const posts = getJournal();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];
  const site = getSite();

  return (
    <article>
      <ReadingProgress />
      <header className="container-page pt-10 text-center md:pt-16">
        <Link href="/journal" className="group kicker inline-flex items-center gap-2 hover:text-ink">
          <ArrowLeft size={12} className="transition-transform duration-300 group-hover:-translate-x-1" /> The Journal
        </Link>
        <p className="kicker mt-10 !text-accent">{post.category}</p>
        <h1 className="mx-auto mt-5 max-w-4xl font-serif text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
          {post.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-ink-2">{post.excerpt}</p>
        <p className="kicker mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>{site.author.name}</span><span aria-hidden>·</span>
          <span>{formatDate(post.date)}</span><span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
          {post.sample && <SampleTag label="Sample essay" />}
        </p>
      </header>

      <div className="container-page mt-12">
        <div className="mx-auto max-w-[41rem] border-t border-ink pt-10">
          <MDXContent source={post.body} className="dropcap" />
        </div>
      </div>

      <nav aria-label="More entries" className="container-page mt-20">
        <div className="mx-auto grid max-w-[41rem] gap-8 border-t border-ink pt-6 sm:grid-cols-2">
          {older ? (
            <Link href={`/journal/${older.slug}`} className="group block">
              <span className="kicker inline-flex items-center gap-2"><ArrowLeft size={12} /> Earlier</span>
              <span className="mt-2 block font-serif text-xl leading-snug"><span className="link-draw">{older.title}</span></span>
            </Link>
          ) : <span />}
          {newer && (
            <Link href={`/journal/${newer.slug}`} className="group block sm:text-right">
              <span className="kicker inline-flex items-center gap-2">Later <ArrowRight size={12} /></span>
              <span className="mt-2 block font-serif text-xl leading-snug"><span className="link-draw">{newer.title}</span></span>
            </Link>
          )}
        </div>
      </nav>
    </article>
  );
}
