import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { ChartSpec } from "@/lib/types";
import { ChartFigure } from "./Chart";

function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="!my-9 border-y border-ink bg-paper-2 px-5 py-5 font-sans text-[0.9375rem] leading-relaxed md:px-7">
      {title && <p className="kicker mb-2 !text-accent">{title}</p>}
      <div className="[&>p+p]:mt-3">{children}</div>
    </aside>
  );
}

function Anchor({ href = "", ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...rest} />;
  if (href.startsWith("#")) return <a href={href} {...rest} />;
  return <a href={href} target="_blank" rel="noreferrer" {...rest} />;
}

/** Renders Markdown/MDX from the content folder with the journal's typography. */
export function MDXContent({
  source, charts, className = "",
}: { source: string; charts?: Record<string, ChartSpec>; className?: string }) {
  return (
    <div className={`prose-journal ${className}`}>
      <MDXRemote
        source={source}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
        components={{
          a: Anchor,
          table: (props: ComponentProps<"table">) => (
            <div className="table-wrap"><table {...props} /></div>
          ),
          Chart: ({ id }: { id: string }) => <ChartFigure spec={charts?.[id]} />,
          Callout,
        }}
      />
    </div>
  );
}
