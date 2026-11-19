import type { Metadata } from "next";
import { getReadingRoom } from "@/lib/content";
import { PageHeader, SampleTag, SectionHeading } from "@/components/ui/bits";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Reading Room",
  description: "Books, investors, papers and ideas that shape how I think about markets.",
};

const SHELVES = ["Reading", "Read", "On the shelf"] as const;

export default function ReadingRoomPage() {
  const room = getReadingRoom();
  const lead = room.quotes[0];

  return (
    <>
      <PageHeader
        kicker="The Reading Room"
        title={<>A small library, <em className="text-accent">kept on purpose.</em></>}
        lede="What I am reading, the investors I keep returning to, and concepts worth revisiting until they become instinct."
      >
        <p className="mt-6"><SampleTag label="Sample shelf — replace with your own" /></p>
      </PageHeader>

      {lead && (
        <div className="container-page">
          <figure className="border-y border-ink py-12 text-center md:py-16">
            <blockquote className="mx-auto max-w-4xl font-serif text-3xl italic leading-[1.25] tracking-[-0.02em] md:text-5xl">
              “{lead.text}”
            </blockquote>
            <figcaption className="kicker mt-6">{lead.by}{lead.source ? ` · ${lead.source}` : ""}</figcaption>
          </figure>
        </div>
      )}

      {/* Books — rendered as spines on a shelf */}
      <section className="container-page mt-20">
        <SectionHeading no="01" title="The bookshelf" />
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-3">
          {SHELVES.map((shelf) => {
            const books = room.books.filter((b) => b.status === shelf);
            return (
              <div key={shelf}>
                <p className="kicker mb-4 flex justify-between">
                  <span className={shelf === "Reading" ? "!text-accent" : ""}>{shelf === "Reading" ? "Currently reading" : shelf}</span>
                  <span>{String(books.length).padStart(2, "0")}</span>
                </p>
                {books.length === 0 ? (
                  <p className="border-t border-rule pt-4 text-sm italic text-muted">Nothing here yet.</p>
                ) : (
                  <ul>
                    {books.map((b) => (
                      <li key={b.title} className="group border-t border-rule py-4 transition-[padding] duration-300 hover:pl-3">
                        <p className="font-serif text-xl leading-snug">{b.title}</p>
                        <p className="mt-0.5 text-sm text-muted">{b.author}{b.theme ? ` · ${b.theme}` : ""}</p>
                        {b.note && <p className="mt-2 text-sm leading-relaxed text-ink-2">{b.note}</p>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-page mt-20">
        <SectionHeading no="02" title="Investors worth studying" />
        <ul className="grid gap-x-12 md:grid-cols-2">
          {room.investors.map((p) => (
            <li key={p.name} className="grid gap-x-6 border-t border-rule py-6 sm:grid-cols-[11rem_1fr]">
              <div>
                <p className="font-serif text-2xl leading-tight tracking-[-0.015em]">{p.name}</p>
                <p className="kicker mt-1.5">{p.known_for}</p>
              </div>
              <p className="mt-3 leading-relaxed text-ink-2 sm:mt-0">{p.strategy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-20 grid gap-x-12 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionHeading no="03" title="Philosophies & frameworks" />
          <dl>
            {room.philosophies.map((p, i) => (
              <Reveal key={p.name}>
                <div className="grid grid-cols-[2.5rem_1fr] border-t border-rule py-5">
                  <span className="num pt-1.5 text-[0.6875rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <dt className="font-serif text-2xl leading-tight">{p.name}</dt>
                    <dd className="mt-2 leading-relaxed text-ink-2">{p.summary}</dd>
                  </div>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5 lg:border-l lg:border-rule lg:pl-12">
          <SectionHeading no="04" title="Concepts to revisit" />
          <dl className="space-y-5">
            {room.concepts.map((c) => (
              <div key={c.term}>
                <dt className="text-sm font-semibold">{c.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-2">{c.note}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-page mt-20">
        <SectionHeading no="05" title="Papers & publications" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink text-left">
                <th scope="col" className="kicker w-16 py-3 font-normal">Year</th>
                <th scope="col" className="kicker py-3 font-normal">Paper</th>
                <th scope="col" className="kicker py-3 font-normal">Why it is here</th>
              </tr>
            </thead>
            <tbody>
              {room.papers.map((p) => (
                <tr key={p.title} className="border-b border-rule align-top">
                  <td className="num py-4 text-[0.8125rem] text-muted">{p.year}</td>
                  <td className="py-4 pr-8">
                    <p className="font-serif text-lg leading-snug">{p.title}</p>
                    <p className="mt-0.5 text-muted">{p.authors} · <em>{p.source}</em></p>
                  </td>
                  <td className="max-w-md py-4 leading-relaxed text-ink-2">{p.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {room.quotes.length > 1 && (
        <section className="container-page mt-20">
          <SectionHeading no="06" title="Commonplace book" />
          <ul className="grid gap-x-12 gap-y-10 md:grid-cols-3">
            {room.quotes.slice(1).map((q) => (
              <li key={q.text}>
                <blockquote className="font-serif text-2xl italic leading-snug tracking-[-0.01em]">“{q.text}”</blockquote>
                <p className="kicker mt-3">{q.by}{q.source ? ` · ${q.source}` : ""}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
