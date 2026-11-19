import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getSite } from "@/lib/content";
import { PageHeader } from "@/components/ui/bits";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about research, ideas, disagreements or opportunities.",
};

export default function ContactPage() {
  const site = getSite();
  return (
    <>
      <PageHeader
        kicker="Correspondence"
        title={<>Letters to <em className="text-accent">the editor.</em></>}
        lede="I am always glad to hear from people who think about businesses and markets — especially if you disagree with something written here."
      />
      <div className="container-page grid gap-x-12 gap-y-14 rule-top pt-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="kicker">Write directly</p>
          <a href={`mailto:${site.email}`} className="group mt-3 block break-all font-serif text-2xl tracking-[-0.01em]">
            <span className="link-draw">{site.email}</span>
          </a>
          <p className="kicker mt-10">Elsewhere</p>
          <ul className="mt-3 divide-y divide-rule border-y border-rule">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between py-3.5 font-serif text-xl">
                  <span className="link-draw">{s.label}</span>
                  <ArrowUpRight size={16} strokeWidth={1.5} className="text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm email={site.email} endpoint={site.contactFormEndpoint} />
        </div>
      </div>
    </>
  );
}
