# Project Context — Satya Portfolio

This document captures the full context, decisions, and history of the portfolio build so any
session (human or Claude) can pick up where things left off. See also the top-level
[CLAUDE.md](../CLAUDE.md) for the working rules.

---

## 1. Goal

Build a personal developer portfolio for **Satyanarayana Veera Venkata Motipalli**, modeled on a
reference site he likes and wants to match in **format, styling, and menu**:

> Reference: https://yaseenyk.github.io/portfolio/ (Yaseen Khatib)
> Footer of the reference: "© 2026 Yaseen Khatib — Architected with Next.js & Framer Motion,
> delivered at AI-speed."

The user provides his own content/logos; the site is a structural + stylistic match, not a copy.

## 2. Decisions made (with the user)

| Decision | Choice |
|---|---|
| Content source | Résumé (pasted) + LinkedIn (LinkedIn blocks bots — used résumé) |
| Tech stack | **Next.js + Framer Motion** (same as reference) |
| Visual style | **Dark terminal / developer aesthetic** |
| Deploy target | **GitHub Pages** |
| Accent color | **Cyan-blue** primary + **violet** secondary (matched from reference screenshots) |

## 3. Who Satya is (from résumé)

- **Title:** Software / Full-Stack & AI Engineer · **3+ years** experience
- **Employer:** Sparity Soft Technology Pvt. Ltd. (2022–present)
- **Email:** Satyanarayanamotipallivv@gmail.com · **Phone:** +91 8328430029
- **GitHub:** github.com/Satyavv2 · **LinkedIn:** linkedin.com/in/satyanarayanavvm
- **Education:** B.Com (Computers), Adikavi Nannaya University, Rajamahendravaram, 2017
- **Core stack:** Angular (8–19), React, Next.js, TypeScript; Node.js, NestJS, Python, .NET;
  PostgreSQL/MySQL/MongoDB; LangChain + OpenAI; Azure DevOps, Kafka.

### The 7 projects (real)
1. **Pathsaathi — School ERP** (Ampersand Group) — Next.js, NestJS, Strapi, Mongo, Postgres, Kafka. May 2026–present.
2. **Tax Litigation Management** (Deloitte) — Angular 12, PrimeNG, .NET, Postgres, Power BI, MSAL. Jun 2022–present.
3. **AP Police Hackathon Portal** — React, Node, MySQL. Solo. Jun–Jul 2025.
4. **Nutri AI** — React, Python, LangChain, OpenAI, Mongo. Jan 2025–present.
5. **Gen AI** — Angular 17, Python, MySQL, NLP. Mar 2024–present.
6. **Help Desk** (Sparity internal) — Angular, Node, SQL. Nov 2023–Apr 2024.
7. **EBMS** (BEDC, Nigeria) — Angular, TypeScript, REST. May–Oct 2022.

## 4. How the reference site is structured (what we matched)

- **Nav:** floating rounded pill, top-right: name + status dot, then menu
  (Products · Projects · Experience · Roadmap · Blog · Stack · Sandbox · Contact).
- **Hero:** small status badge pill → huge black headline ("Architecting Scalable Systems.
  Delivering at AI-Speed." with gradient on the last line) → paragraph → two buttons →
  a clean **hexagonal node-network graphic** with a glowing core on the right.
- Centered **"The Architecture is Everything"** section with a pipeline diagram.
- **Products** (3-up cards), **Projects** (large detailed cards with embedded mini-terminals),
  **Roadmap** (numbered list), Experience, Stack, Blog, Sandbox, **Contact** ("Have a product to
  build? Let's ship it." + form).

## 5. What we built

Section-by-section components in `components/`, all data-driven from `lib/content.ts`:

- `Nav` — floating **right-aligned** pill, name + pulsing dot, taller; mobile dropdown.
- `Hero` + `NetworkGraphic` — status badge, **violet→pink gradient** headline, copy,
  "View my work" + "Download CV" buttons, clean animated **hexagon** SVG (static centered rings +
  travelling particles), plus a terminal "boot sequence" block beneath.
- `About` — bio paragraphs, stat tiles, education card.
- `Architecture` — centered, animated Database → Backend → AI → Frontend pipeline.
- `Products` — 3 cards with metrics + expand. **Currently hidden** (component kept, not rendered;
  not in nav) because Satya has no shipped products.
- `Projects` — consistent text-left / mini-terminal-right cards, expandable contributions, tech tags.
- `Experience` — Sparity timeline card.
- `Roadmap` — progress bar + numbered two-column list with done/next flags.
- `Skills` (rendered as **Stack**) — categorized tool grid. **.NET removed** (Satya only consumed
  .NET APIs, didn't build in it).
- `Blog` — reads `lib/posts.generated.json` (from the scraper); falls back to 3 placeholder posts.
- `Sandbox` — experiments list with status chips (placeholder).
- `Contact` — heading + working mailto form + contact link cards.
- `Footer` — "Architected with Next.js & Framer Motion" line.
- Shared: `Reveal` (scroll-in), `SectionHeading` (terminal-style heading),
  `SpotlightTracker` (mounted in layout — cursor-following glow on every `.card-base`).

### Theme / palette (current)
- Accent **cyan `#38c6f4`** + secondary **violet `#8b5cf6`**; headline gradient ends pink `#ec4899`.
- Background near-black `#05070e` with a **full square grid** (rows + columns) + cyan/violet glow.
- Cursor spotlight: CSS `.card-base::before` radial glow at `--mx/--my`, fed by `SpotlightTracker`.

### Dynamic experience
- `lib/content.ts` computes `YEARS_EXPERIENCE` from `CAREER_START = April 2022` at build time
  (currently **4+**). Used in hero, about summary, and the stat tile. Never hardcode the number.

### LinkedIn scraper (`scraper/`)
- Separate local tool (own package.json; never installed by the deploy CI).
- Playwright (persistent login in `scraper/.auth/`) scrapes the user's `/recent-activity/all/`,
  then `@google/genai` (Gemini, key in `scraper/.env`) structures it into `lib/posts.generated.json`.
- Commands: `npm run login` (once), `npm run scrape`. Default model `gemini-2.0-flash`.
- Best-effort — LinkedIn blocks bots / changes markup; manual `posts` edit always works.

## 6. Build / deploy facts

- `next.config.ts`: `output: 'export'`, `basePath` from `PAGES_BASE_PATH`, `images.unoptimized`,
  `trailingSlash`. (Next 16 dropped the `eslint` config key — do not re-add it.)
- `public/.nojekyll` ensures GitHub Pages serves the `_next/` folder.
- CI: `.github/workflows/deploy.yml` builds on push to `main`, derives `PAGES_BASE_PATH=/<repo>`
  (so basePath = `/portfolio`), and deploys via GitHub Pages. `out/` is untracked (gitignored).

### GitHub account & deploy target (IMPORTANT)
- The user's GitHub account was **renamed `Satyavv2` → `satyamotipalli`**.
- Target repo: **`satyamotipalli/portfolio`** (created, empty). Local `origin` is set to
  `https://github.com/satyamotipalli/portfolio.git`.
- **Planned live URL: `https://satyamotipalli.github.io/portfolio/`.**
- **Auth snag:** the laptop's Git Credential Manager has a STALE credential for an unrelated
  account **`SatyanarayanaVVMotipalli`**, causing `403 denied`. Pushes from the sandbox hang
  (GCM can't pop a browser non-interactively). **The user must push from their own terminal**,
  signing in as `satyamotipalli`; if 403 persists, remove the `git:https://github.com` entry in
  Windows Credential Manager first.
- There is also a stray **empty clone** at `D:\sparity_projects\portfolio` — ignore/delete it;
  the real project (with commits) is `d:\sparity_projects\satya_portfolio`.

## 7. Next steps / to publish

1. **User runs** in their own terminal: `cd d:\sparity_projects\satya_portfolio && git push -u origin main`
   → sign in as `satyamotipalli` (clear stale credential if it 403s).
2. GitHub → repo Settings → Pages → Source: **GitHub Actions**.
3. Visit `https://satyamotipalli.github.io/portfolio/` (after the Actions run finishes).
4. Replace placeholder content: Blog (run the scraper or edit `posts`), Sandbox, Roadmap items;
   un-hide/repurpose Products if ever needed.
5. Optional: add `public/cv.pdf` so the Download CV button works; wire a real form backend.

## 8. Gotchas

- LinkedIn returns HTTP 999 to automated fetches — direct WebFetch can't read it; the scraper uses a
  logged-in Playwright browser instead.
- **Account/credential mismatch** (see §6) is the current blocker to going live — it's an auth issue,
  not a code issue. The code builds clean and is fully committed (3 commits).
- Tailwind v4 here is **CSS-first** (`@theme` in globals.css). No `tailwind.config.js`.
- This Next.js (16) differs from older training data — see `AGENTS.md`. Do not add an `eslint` key
  to `next.config.ts` (Next 16 removed it).
- `<body suppressHydrationWarning>` in `app/layout.tsx` silences a benign hydration warning caused by
  the ColorZilla browser extension (`cz-shortcut-listen`) — keep it.
