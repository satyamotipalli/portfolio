// Retrieval for the chat widget: splits lib/content.ts into résumé chunks, scores them against a
// question (IDF-weighted keywords + synonym expansion) and returns the best matches. Runs fully in
// the browser, so it works on the static site; the Gemini backend embeds the same chunks (`knowledge`).
import { about, chat, experience, posts, profile, projects, roadmap, skills } from "./content";

export type Hit = { id: string; title: string; body: string; href: string };
/** A chunk as the RAG backend sees it: `context` is the full text handed to the model. */
export type Knowledge = Hit & { context: string };
type Chunk = Hit & { detail: string; terms: Set<string>; titleTerms: Set<string> };

const STOPWORDS = new Set(
  "a about also an and any are as at be by can could did do does for from has have he him his how i in is it its me my of on or satya satyanarayana motipalli tell than that the their them there this to was what when where which who why with you your".split(
    " ",
  ),
);

// Query terms expand to related résumé vocabulary (weighted lower than the literal term).
const SYNONYMS: Record<string, string[]> = {
  ai: ["llm", "langchain", "openai", "agent", "nlp", "prompt"],
  llm: ["ai", "langchain", "openai", "agent"],
  genai: ["ai", "llm", "langchain", "openai"],
  contact: ["email", "phone", "linkedin", "github", "hire"],
  reach: ["contact", "email", "phone"],
  hire: ["contact", "email", "phone"],
  email: ["contact"],
  phone: ["contact"],
  frontend: ["angular", "react", "nextjs", "ui"],
  ui: ["frontend", "angular", "react"],
  backend: ["nodejs", "nestjs", "api", "python"],
  node: ["nodejs"],
  next: ["nextjs"],
  nest: ["nestjs"],
  database: ["sql", "postgresql", "mongodb", "mysql"],
  db: ["database", "sql", "postgresql", "mongodb", "mysql"],
  education: ["degree", "university"],
  study: ["education", "degree", "university"],
  qualification: ["education", "degree"],
  experience: ["year", "company", "role"],
  job: ["experience", "company", "role"],
  company: ["experience", "sparity"],
  work: ["experience", "project"],
  skill: ["stack", "frontend", "backend"],
  tech: ["stack", "skill"],
  technology: ["stack", "skill"],
  learn: ["roadmap"],
  learning: ["roadmap"],
};

function stem(t: string) {
  if (t.length > 4 && t.endsWith("ies")) return `${t.slice(0, -3)}y`;
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss") && !t.endsWith("js")) return t.slice(0, -1);
  return t;
}

function tokens(text: string) {
  return text
    .toLowerCase()
    .replace(/\.js\b/g, "js")
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t && !STOPWORDS.has(t))
    .map(stem);
}

// `body` is what the widget displays; `detail` is extra text used for search and model context only.
function chunk(id: string, title: string, href: string, body: string, keywords = "", detail = ""): Chunk {
  return {
    id,
    title,
    href,
    body,
    detail,
    terms: new Set(tokens(`${title} ${body} ${detail} ${keywords}`)),
    titleTerms: new Set(tokens(title)),
  };
}

const chunks: Chunk[] = [
  chunk("about", `About · ${profile.title}`, "#about", about.resumeSummary, `${profile.location} summary overview profile background year experience`),
  chunk(
    "experience",
    `${experience.role} · ${experience.company}`,
    "#experience",
    `${experience.period}\n${experience.blurb}\n${experience.highlights.map((h) => `• ${h}`).join("\n")}`,
    "experience job work company employer role current year",
  ),
  chunk(
    "education",
    `Education · ${about.education.degree}`,
    "#about",
    `${about.education.school}, ${about.education.year}`,
    "education degree university college study qualification commerce",
  ),
  chunk(
    "contact",
    "Contact",
    "#contact",
    `Email: ${profile.email}\nPhone: ${profile.phone}\nLinkedIn: ${profile.linkedin}\nGitHub: ${profile.github}\nLocation: ${profile.location}`,
    "contact email phone reach hire linkedin github location",
  ),
  ...projects.map((p, i) =>
    chunk(
      `project-${i}`,
      p.name,
      "#projects",
      `${[p.client, p.role, p.period].filter(Boolean).join(" · ")}\n${p.summary}\nStack: ${p.tech.join(", ")}`,
      "project",
      p.highlights.map((h) => `• ${h}`).join("\n"),
    ),
  ),
  ...skills.map((g) =>
    chunk(
      `skills-${g.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      `Stack · ${g.label}`,
      "#stack",
      g.items.join(", "),
      "skill stack tech technology tool",
    ),
  ),
  chunk(
    "roadmap",
    "Roadmap",
    "#roadmap",
    `Done: ${roadmap.filter((r) => r.done).map((r) => r.title).join(", ")}\nNext: ${roadmap.filter((r) => !r.done).map((r) => r.title).join(", ")}`,
    "roadmap learn learning next plan goal",
  ),
  ...posts
    .filter((p) => p.href !== "#")
    .map((p, i) => chunk(`post-${i}`, p.title, p.href, p.excerpt, `blog post article ${p.tag}`)),
];

export const knowledge: Knowledge[] = chunks.map(({ id, title, href, body, detail }) => ({
  id,
  title,
  href,
  body,
  context: [title, body, detail].filter(Boolean).join("\n"),
}));

const df = new Map<string, number>();
for (const c of chunks) for (const t of c.terms) df.set(t, (df.get(t) ?? 0) + 1);
const idf = (t: string) => Math.log(1 + chunks.length / (df.get(t) ?? chunks.length));
const vocabulary = [...df.keys()];

function sharedPrefix(a: string, b: string) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

function withinOneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

// Misspelled terms ("expercice", "anguar") map to résumé words sharing a 5-letter prefix or one edit away.
function fuzzyMatches(term: string) {
  if (term.length < 4 || df.has(term)) return [];
  return vocabulary.filter((v) => sharedPrefix(term, v) >= 5 || (v.length >= 4 && withinOneEdit(term, v)));
}

export function answerLocally(question: string): { text: string; hits: Hit[] } {
  const weights = new Map<string, number>();
  for (const t of tokens(question)) weights.set(t, 1);
  for (const t of [...weights.keys()]) {
    for (const f of fuzzyMatches(t)) if (!weights.has(f)) weights.set(f, 0.8);
  }
  for (const t of [...weights.keys()]) {
    for (const s of SYNONYMS[t] ?? []) if (!weights.has(s)) weights.set(s, 0.6);
  }

  const ranked = chunks
    .map((c) => {
      let score = 0;
      for (const [t, w] of weights) {
        if (c.terms.has(t)) score += w * idf(t);
        if (c.titleTerms.has(t)) score += w * idf(t);
      }
      return { c, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) return { text: chat.noMatch, hits: [] };

  const best = ranked[0].score;
  const hits = ranked
    .filter((r) => r.score >= best * 0.5)
    .slice(0, 3)
    .map(({ c: { id, title, body, href } }) => ({ id, title, body, href }));
  return { text: chat.found, hits };
}
