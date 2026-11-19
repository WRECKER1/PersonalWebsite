# Content guide

Everything you see on the site is read from the `content/` folder. You never
need to touch the code in `app/` or `components/` to publish.

```
content/
  site.yaml            Name, tagline, email, social links, front-page intro
  about.mdx            About page text + the milestones timeline
  resume.yaml          Resume sections and skills
  research/*.mdx       One file per research report
  journal/*.mdx        One file per journal entry
  ideas/*.mdx          One file per trade idea (thesis, tracker, retrospective)
  reading-room.yaml    Books, investors, philosophies, concepts, papers, quotes
  marginalia.yaml      Short margin notes
  idea-archive.yaml    Things to research one day
  ledger.yaml          Extra ledger milestones (most entries are automatic)
```

Each folder has a `_template.mdx` to copy. Files starting with `_` are ignored.
The file name becomes the web address: `research/acme-corp.mdx` → `/research/acme-corp`.

After any change: `npm run dev` to preview, or commit and push if the site is
deployed (Vercel and similar hosts rebuild automatically).

## First things to replace

1. `content/site.yaml` — your name, email, social links and live `url`.
2. `content/about.mdx` and `content/resume.yaml` — bracketed `[placeholders]`.
3. Every entry marked `sample: true`. These use **fictional companies and
   invented numbers** and show an "Illustrative sample" label. Delete them or
   replace them; remove the `sample: true` line once the content is real.

## Common tasks

### Add a research report
Copy `content/research/_template.mdx`, rename it, fill in the front matter (the
block between the `---` lines) and write under the eight standard headings.
Each `## Heading` automatically appears in the table of contents.

- `category`: `company`, `sector`, `macro`, `fsa` or `special-situations` (drives the filters).
- `featured: true` makes it the lead story on the front page.
- **Tables**: normal Markdown tables. Right-align number columns with `--:`.
- **Footnotes**: write `[^1]` in the text and `[^1]: The note.` at the bottom.
- **Charts**: describe the chart under `charts:` in the front matter, then place
  `<Chart id="name" />` in the text. Types: `bar`, `line`, `area`; up to three series.
- **Callout box**: `<Callout title="Label">Text</Callout>`.
- **PDF download**: put the file in `public/reports/` and add `pdf: /reports/file.pdf`.
  `npm run pdf` can generate it from the page itself (see below).

### Publish a journal entry
Copy `content/journal/_template.mdx`. `category` can be any label and becomes a
filter. Reading time is calculated for you. `featured: true` shows it at the top.

### Add a trade idea
Copy `content/ideas/_template.mdx`. The first three `metrics` appear in the
watchlist table. Enter figures by hand from sources you trust — the site does
not fetch prices, and nothing is displayed as live data.

### Update an idea's status
Open the idea file and change `status` to one of
`Under Research`, `Active Thesis`, `Monitoring`, `Closed`.
Add a `tracker` entry explaining why — it appears in the Thesis Tracker and in the Ledger.

### Close an idea (Conviction vs. Reality)
Set `status: Closed` and add a `retrospective:` block (`closedOn`, `verdict`,
`expected`, `actual`, `lesson`). It then appears on `/retrospectives`.

### Add a book or resource
Add an item to the relevant list in `content/reading-room.yaml`.
Book `status`: `Reading`, `Read` or `On the shelf`. The first quote is displayed large.

### Add a margin note
Add `- date / note / tag` to `content/marginalia.yaml`. The newest four show on the front page.

### Update the resume
Edit `content/resume.yaml`, then refresh the PDF (below) or drop your own
PDF at `public/resume.pdf`.

### Hide something without deleting it
Add `draft: true` to the front matter of any research, journal or idea file.

## Regenerating PDFs
`npm run pdf` prints `/resume` and every report with a `pdf:` path to PDF.
It needs the site running (`npm run build && npm run start`) and Playwright
installed (`npm i -D playwright && npx playwright install chromium`).

## Contact form
With `contactFormEndpoint` blank in `site.yaml`, the form opens the visitor's
email app with the message filled in. To receive messages directly, create a
form on a service such as Formspree and paste its URL there.

## Visitor counter
The footer shows "Readers to date". Each browser is counted once, on its first
visit; clearing site data or using another device counts again, and visitors
with JavaScript off are not counted.

- **Local or a single Node server:** works out of the box; the total is kept in `.data/visits.json`.
- **Vercel (or any serverless host):** files do not persist there, so add a Redis
  store: in the Vercel dashboard open Storage → create an Upstash Redis database →
  connect it to the project. It sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`
  (or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`), which the site picks up
  automatically. Without it the counter hides itself.

## YAML tips
- Indentation matters; use spaces, not tabs.
- Put text containing `:` or starting with `[` in quotes.
- Dates are `YYYY-MM-DD`.
