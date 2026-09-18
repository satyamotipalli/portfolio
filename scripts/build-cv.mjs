// Builds public/cv.pdf from lib/content.ts so the résumé never drifts from the site.
// Usage: npm run cv   (prints with a local Edge/Chrome in headless mode; override with CHROME_PATH)
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import tsRequire from "./ts-require.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const { profile, about, skills, experience, projects } = tsRequire(path.join(root, "lib", "content.ts"));

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const range = (s) => esc(s.replace(/\s+—\s+/g, " – "));
const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
const link = (url) => `<a href="${esc(url)}">${esc(bare(url))}</a>`;
const bullets = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

// The résumé carries only the featured projects (set in lib/content.ts), with no dates and no
// client names — those stay on the website.
const projectBlocks = projects
  .filter((p) => p.featured)
  .map(
    (p, i) => `
    <div class="project">
      <p class="title">Project ${i + 1}: ${esc(p.name)}</p>
      ${p.role ? `<p>Role: ${esc(p.role)}</p>` : ""}
      <p>Tech Stack: ${esc(p.tech.join(", "))}</p>
      <p class="overview">${esc(p.summary)}</p>
      <p class="sub">Responsibilities &amp; Achievements</p>
      ${bullets(p.highlights)}
    </div>`,
  )
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(profile.name)} — Résumé</title>
<style>
  @page { size: A4; margin: 0.85in 0.95in; }
  body { font-family: Calibri, Carlito, "Segoe UI", Arial, sans-serif; font-size: 11pt; line-height: 1.32; color: #000; margin: 0; }
  p { margin: 0; }
  a { color: #0563c1; }
  header { text-align: right; margin-bottom: 16pt; }
  header .name { font-size: 12.5pt; }
  section { border-bottom: 1.5px solid #a6a6a6; padding-bottom: 9pt; margin-bottom: 12pt; }
  section.work { border-bottom: 0; margin-bottom: 0; }
  h2 { font-size: 11pt; font-weight: bold; margin: 0 0 3pt 0.3em; }
  .summary { text-indent: 2em; }
  .indent { padding-left: 1.6em; }
  .job { margin-bottom: 4pt; }
  .project { break-inside: avoid; padding: 9pt 0; border-bottom: 1.5px solid #a6a6a6; }
  .project:last-child { border-bottom: 0; }
  .project .title { font-weight: bold; }
  .overview { margin-top: 2pt; }
  .sub { padding-left: 3em; font-weight: bold; margin-top: 2pt; }
  ul { list-style: none; margin: 0; padding-left: 3em; }
  li { padding-left: 0.9em; text-indent: -0.9em; }
  li::before { content: "•\\00a0\\00a0"; }
</style>
</head>
<body>
  <header>
    <p class="name">${esc(profile.name)}</p>
    <p>${esc(profile.title)}</p>
    <p>Ph: ${esc(profile.phone)} | ${esc(profile.location)}</p>
    <p><a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></p>
    <p>${link(profile.linkedin)} | ${link(profile.github)}</p>
    ${profile.portfolio ? `<p>Portfolio: ${link(profile.portfolio)}</p>` : ""}
  </header>

  <section>
    <h2>PROFESSIONAL SUMMARY</h2>
    <p class="summary">${esc(about.resumeSummary)}</p>
  </section>

  <section>
    <h2>EDUCATION</h2>
    <div class="indent">
      <p>${esc(about.education.degree)}, ${esc(about.education.year)}</p>
      <p>${esc(about.education.school)}</p>
    </div>
  </section>

  <section>
    <h2>TECHNICAL SKILLS</h2>
    <div class="indent">
      ${skills.map((g) => `<p>${esc(g.label)}: ${esc(g.items.join(", "))}</p>`).join("")}
    </div>
  </section>

  <section class="work">
    <h2>WORK EXPERIENCE</h2>
    <div class="indent job">
      <p>${esc(experience.role)}</p>
      <p>${esc(experience.company)} | ${range(experience.period)}</p>
    </div>
    ${bullets(experience.highlights)}
    ${projectBlocks}
  </section>
</body>
</html>`;

const browser = [
  process.env.CHROME_PATH,
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!browser) throw new Error("No Edge/Chrome found — set CHROME_PATH.");

const work = mkdtempSync(path.join(tmpdir(), "cv-"));
const htmlFile = path.join(work, "cv.html");
const out = path.join(root, "public", "cv.pdf");
writeFileSync(htmlFile, html);
if (process.argv.includes("--html")) writeFileSync(path.join(root, "cv.preview.html"), html);

try {
  execFileSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-pdf-header-footer",
      `--user-data-dir=${path.join(work, "profile")}`,
      `--print-to-pdf=${out}`,
      pathToFileURL(htmlFile).href,
    ],
    { stdio: "ignore", timeout: 60_000 },
  );
} finally {
  try {
    rmSync(work, { recursive: true, force: true });
  } catch {
    // The browser can briefly hold its profile dir open on Windows; leftover temp files are harmless.
  }
}
console.log(`Wrote ${path.relative(root, out)}`);
