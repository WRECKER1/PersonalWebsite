import type { Metadata } from "next";
import { getResearch } from "@/lib/content";
import { PageHeader } from "@/components/ui/bits";
import { ResearchLibrary } from "@/components/research/ResearchLibrary";

export const metadata: Metadata = {
  title: "Research Desk",
  description: "Company analyses, sector studies, financial statement work and special situations.",
};

export default function ResearchPage() {
  const reports = getResearch().map(({ body: _b, headings: _h, charts: _c, ...card }) => card);
  return (
    <>
      <PageHeader
        kicker="The Research Desk"
        title={<>Long-form work on businesses, <em className="text-accent">written to be wrong in public.</em></>}
        lede="Company analyses, sector studies, financial statement work and the occasional special situation. Each report follows the same template so the reasoning is easy to audit later."
      />
      <div className="container-page">
        <ResearchLibrary reports={reports} />
      </div>
    </>
  );
}
