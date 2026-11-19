/**
 * Visitor count storage.
 *
 * - If Redis REST credentials are present (Upstash, or Vercel's Redis/KV
 *   integration), the count lives there. This is what you want on Vercel,
 *   where the filesystem does not persist.
 * - Otherwise it falls back to a small JSON file in .data/, which works for
 *   local development and for a single self-hosted Node server.
 */
import fs from "node:fs/promises";
import path from "node:path";

const KEY = "visitors";
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const FILE = path.join(process.cwd(), ".data", "visits.json");

async function redis(command: "get" | "incr"): Promise<number> {
  const res = await fetch(`${REDIS_URL!.replace(/\/$/, "")}/${command}/${KEY}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);
  const { result } = (await res.json()) as { result: number | string | null };
  return Number(result ?? 0);
}

async function readFile(): Promise<number> {
  try {
    return Number(JSON.parse(await fs.readFile(FILE, "utf8")).count) || 0;
  } catch {
    return 0;
  }
}

// Serialises file writes so two simultaneous first visits are both counted.
let queue: Promise<unknown> = Promise.resolve();

async function incrementFile(): Promise<number> {
  const next = queue.then(async () => {
    const count = (await readFile()) + 1;
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify({ count }));
    return count;
  });
  queue = next.catch(() => {});
  return next;
}

const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

export const getVisits = () => (useRedis ? redis("get") : readFile());
export const addVisit = () => (useRedis ? redis("incr") : incrementFile());
