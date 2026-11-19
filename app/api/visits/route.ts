import { addVisit, getVisits } from "@/lib/visits";

export const dynamic = "force-dynamic";

const reply = (count: number | null) =>
  Response.json({ count }, { headers: { "Cache-Control": "no-store" } });

/** Current total. */
export async function GET() {
  try {
    return reply(await getVisits());
  } catch {
    return reply(null);
  }
}

/** Records one new visitor and returns the new total. */
export async function POST() {
  try {
    return reply(await addVisit());
  } catch (error) {
    // Usually means a serverless host (e.g. Vercel) with no Redis store connected.
    // See "Visitor counter" in CONTENT.md. The counter hides itself until then.
    console.warn("[visitor counter] could not save the count:", error instanceof Error ? error.message : error);
    return reply(null);
  }
}
