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
  } catch {
    return reply(null); // storage unavailable: the counter simply hides itself
  }
}
