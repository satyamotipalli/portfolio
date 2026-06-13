// LinkedIn → posts.generated.json
// ---------------------------------
// Local tool. Opens a real Chromium window (your session is saved after the first
// login), visits YOUR LinkedIn activity page, scrapes recent posts, then uses
// Gemini to turn the raw text into clean { title, excerpt, date, tag, href } entries.
// It writes ../lib/posts.generated.json which the portfolio Blog section reads.
//
// Usage:
//   1) npm install            (in this folder)
//   2) npx playwright install chromium
//   3) cp .env.example .env   and fill in GEMINI_API_KEY (+ profile URL if different)
//   4) npm run login          (first time only — log into LinkedIn in the window, then press Enter)
//   5) npm run scrape
//
// NOTE: scraping LinkedIn is against their Terms of Service even for your own data,
// and can get an account flagged. You are running this on your own account at your
// own risk. It only reads your own activity; it changes nothing on LinkedIn.

import { chromium } from "playwright";
import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import "dotenv/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROFILE_URL =
  process.env.LINKEDIN_PROFILE_URL || "https://www.linkedin.com/in/satyanarayanavvm/";
const ACTIVITY_URL = PROFILE_URL.replace(/\/+$/, "") + "/recent-activity/all/";
const USER_DATA_DIR = resolve(__dirname, ".auth"); // persisted login session
const OUTPUT = resolve(__dirname, "..", "lib", "posts.generated.json");
const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const MAX_POSTS = Number(process.env.MAX_POSTS || 9);
const LOGIN_MODE = process.argv.includes("--login");

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (a) => (rl.close(), res(a))));
}

async function main() {
  if (!LOGIN_MODE && !process.env.GEMINI_API_KEY) {
    console.error("✖ GEMINI_API_KEY is missing. Copy .env.example → .env and set it.");
    process.exit(1);
  }

  console.log("→ Launching browser (persistent session at .auth/) …");
  const ctx = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
  });
  const page = ctx.pages()[0] || (await ctx.newPage());

  if (LOGIN_MODE) {
    await page.goto("https://www.linkedin.com/login", { waitUntil: "domcontentloaded" });
    console.log("\n→ Log into LinkedIn in the opened window.");
    await prompt("   When you can see your LinkedIn feed, press Enter here … ");
    await ctx.close();
    console.log("✓ Session saved. Now run: npm run scrape");
    return;
  }

  console.log(`→ Opening activity: ${ACTIVITY_URL}`);
  await page.goto(ACTIVITY_URL, { waitUntil: "domcontentloaded" });

  // Detect login wall.
  if (page.url().includes("/login") || page.url().includes("/authwall")) {
    console.error("✖ Not logged in. Run `npm run login` first, then re-run `npm run scrape`.");
    await ctx.close();
    process.exit(1);
  }

  // Scroll to load posts.
  console.log("→ Scrolling to load posts …");
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 2400);
    await page.waitForTimeout(1500);
  }

  // Pull the rendered post text + any permalinks. We stay selector-light and let
  // Gemini do the structuring, so this keeps working when LinkedIn changes its DOM.
  const { text, links } = await page.evaluate(() => {
    const main = document.querySelector("main") || document.body;
    const anchors = Array.from(document.querySelectorAll("a[href]"))
      .map((a) => a.getAttribute("href") || "")
      .filter((h) => /\/(feed\/update|posts)\//.test(h) || /activity-\d+/.test(h))
      .map((h) => (h.startsWith("http") ? h : "https://www.linkedin.com" + h));
    return { text: main.innerText.slice(0, 24000), links: Array.from(new Set(anchors)).slice(0, 40) };
  });

  await ctx.close();

  if (!text || text.length < 200) {
    console.error("✖ Got almost no content — LinkedIn may have blocked the page or there are no posts.");
    process.exit(1);
  }

  console.log("→ Structuring with Gemini …");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const instruction = `You are extracting a person's own LinkedIn posts from raw page text.
From the TEXT below, identify up to ${MAX_POSTS} distinct posts authored by the profile owner
(ignore "promoted", suggested, and other people's reshared content where possible).
For each post return:
- "title": a concise 6-10 word title you write summarising the post (Title Case, no quotes)
- "excerpt": one clean sentence (max 22 words) summarising the post
- "date": ISO date "YYYY-MM-DD" if you can infer it, else ""
- "tag": one of "AI", "Frontend", "Backend", "Career", "General"
- "href": the most likely matching URL from LINKS, else ""
Return ONLY a JSON array, no markdown fences.

LINKS:
${links.join("\n")}

TEXT:
${text}`;

  const res = await ai.models.generateContent({ model: MODEL, contents: instruction });
  let raw = (res.text || "").trim().replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

  let posts;
  try {
    posts = JSON.parse(raw);
    if (!Array.isArray(posts)) throw new Error("not an array");
  } catch (e) {
    console.error("✖ Could not parse Gemini output as JSON. Raw output:\n", raw.slice(0, 800));
    process.exit(1);
  }

  // Normalise + clamp.
  posts = posts
    .filter((p) => p && p.title)
    .slice(0, MAX_POSTS)
    .map((p) => ({
      title: String(p.title).trim(),
      date: typeof p.date === "string" ? p.date : "",
      tag: ["AI", "Frontend", "Backend", "Career", "General"].includes(p.tag) ? p.tag : "General",
      excerpt: String(p.excerpt || "").trim(),
      href: typeof p.href === "string" && p.href.startsWith("http") ? p.href : ACTIVITY_URL,
    }));

  if (!existsSync(dirname(OUTPUT))) mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(posts, null, 2) + "\n");
  console.log(`✓ Wrote ${posts.length} posts → ${OUTPUT}`);
  console.log("  Now rebuild the site (npm run build) to see them in the Blog section.");
}

main().catch((err) => {
  console.error("✖ Failed:", err.message);
  process.exit(1);
});
