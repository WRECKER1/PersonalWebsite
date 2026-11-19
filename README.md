# The Investment Journal

A personal investment journal built as an editorial publication: research
reports, a trade-idea notebook with thesis tracking, a journal, a reading room
and a running ledger.

**To add or edit content, read [CONTENT.md](./CONTENT.md).** No code changes needed.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (all pages are static)
npm run start
npm run lint
npm run pdf      # regenerate resume + report PDFs (see CONTENT.md)
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide ·
Recharts · MDX via `next-mdx-remote`. Fonts are self-hosted through Fontsource
(Newsreader, Instrument Sans, IBM Plex Mono, Caveat).

## Structure

```
app/                 Routes (one folder per page)
components/
  site/              Masthead, footer, theme toggle
  ui/                Section headings, filters, status marks, reveal animation
  mdx/               Markdown renderer, charts, table of contents, progress bar
  research|ideas|journal|contact/   Page-specific interactive pieces
content/             All site content (see CONTENT.md)
lib/                 Content loader, types, formatting, navigation
public/              PDFs and static files
scripts/make-pdfs.mjs
```

## Design system

Tokens live at the top of `app/globals.css`: ivory paper, midnight-navy ink,
forest-green accent, burgundy for the contrary view, with a dark edition that
swaps the same tokens. Change the colours or fonts there and the whole site follows.

## Pages

`/` front page · `/research` + reports · `/ideas` notebook, watchlist, idea
archive · `/ideas/[slug]` thesis, tracker, retrospective · `/journal` + entries ·
`/reading-room` · `/ledger` · `/retrospectives` (Conviction vs. Reality) ·
`/marginalia` · `/about` · `/resume` · `/contact` · `/feed.xml` · `/sitemap.xml`

## Deploying

Any Next.js host works; Vercel needs no configuration. Set `url` in
`content/site.yaml` to your domain first.
