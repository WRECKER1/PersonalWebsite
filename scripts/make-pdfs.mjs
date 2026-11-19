/**
 * Generates the downloadable PDFs from the live pages:
 *   - /resume                → public/resume.pdf (path from content/site.yaml)
 *   - every research report  → the path in its `pdf:` front matter
 *
 * Usage:  npm run build && npm run start   (in one terminal)
 *         npm run pdf                      (in another)
 *
 * Requires Playwright (`npm i -D playwright && npx playwright install chromium`).
 * Prefer your own designed PDF? Just drop it into /public at the same path.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import matter from "gray-matter";
import { load } from "js-yaml";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const root = process.cwd();
const site = load(fs.readFileSync(path.join(root, "content/site.yaml"), "utf8"));

const jobs = [{ url: "/resume", out: site.resumePdf }];
for (const file of fs.readdirSync(path.join(root, "content/research"))) {
  if (!/\.mdx?$/.test(file) || file.startsWith("_")) continue;
  const { data } = matter(fs.readFileSync(path.join(root, "content/research", file), "utf8"));
  if (data.pdf) jobs.push({ url: `/research/${file.replace(/\.mdx?$/, "")}`, out: data.pdf });
}

const browser = await chromium.launch();
const page = await browser.newPage();
for (const job of jobs) {
  const out = path.join(root, "public", job.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.emulateMedia({ media: "print", colorScheme: "light" });
  await page.goto(BASE + job.url, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.querySelectorAll("details").forEach((d) => d.removeAttribute("open"));
  });
  await page.waitForTimeout(1200);
  await page.pdf({ path: out, format: "A4", printBackground: true });
  console.log("✓", job.out);
}
await browser.close();
