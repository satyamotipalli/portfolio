@AGENTS.md

# CLAUDE.md — Satya Portfolio

Project memory for Claude Code. Read this (and `docs/CONTEXT.md`) first in any session on this repo.

## What this is

A personal developer portfolio for **Satyanarayana Veera Venkata Motipalli** (handle: `satya`),
a Full-Stack & AI Engineer at Sparity Soft Technology. Single-page site, **dark terminal /
developer aesthetic**, deliberately modeled on a reference site the user admires:
`https://yaseenyk.github.io/portfolio/` (his friend Yaseen Khatib's site). The user wants the
**same format, styling, and menu** as the reference, then swaps in his own content/logos.

## Stack

- **Next.js 16** (App Router) with **static export** (`output: 'export'`)
- **React 19**, **TypeScript**, **Tailwind CSS v4** (CSS-based `@theme`, no JS config)
- **Framer Motion 12** for animation
- Fonts: **Inter** (sans) + **JetBrains Mono** (mono) via `next/font/google`
- Node 20 locally; CI builds on Node 22

## Golden rules

1. **All copy lives in [lib/content.ts](lib/content.ts).** Never hardcode text in components —
   edit the data file. Components are presentational and map over these arrays/objects.
2. **Theme tokens live in [app/globals.css](app/globals.css)** as CSS custom properties under
   `:root`, exposed to Tailwind via `@theme inline`. Change colors there, not in components.
3. Keep it **static-exportable** — no server actions, no API routes, no runtime secrets. The
   contact form builds a `mailto:` link client-side (works on GitHub Pages).
4. Match the reference site's **structure and feel**; the content is Satya's.

## Design tokens (globals.css)

- Background: near-black `#05070e` with faint vertical-line texture + cyan/violet radial glow
- **Accent: cyan-blue `#38c6f4`**; **secondary: violet `#8b5cf6`**; headline gradient ends pink `#ec4899`
- Mono font for terminal/code/UI-chrome text; sans (Inter, heavy weights) for headlines/body

## Structure

```
app/
  layout.tsx      # fonts, metadata (title/description from profile)
  page.tsx        # assembles all sections in order
  globals.css     # theme tokens + base styles
components/        # one file per section + shared primitives
  Nav, Hero, NetworkGraphic, About, Architecture, Products,
  Projects, Experience, Roadmap, Skills (=Stack), Blog, Sandbox, Contact, Footer
  Reveal.tsx          # scroll-in animation wrapper
  SectionHeading.tsx  # "NN. ~/$ command" + title heading
lib/content.ts     # ALL site content (single source of truth)
.github/workflows/deploy.yml  # GitHub Pages CI
public/.nojekyll   # required so GitHub Pages serves _next/
```

### Section order (page.tsx)
Hero → About → Architecture ("The Architecture is Everything") → Products → Projects →
Experience → Roadmap → Stack (Skills) → Blog → Sandbox → Contact → Footer

### Nav menu (matches reference)
Products · Projects · Experience · Roadmap · Blog · Stack · Sandbox · Contact
(rendered as a floating rounded pill, top-right, with name + pulsing status dot)

## Content status (real vs placeholder)

- **Real (from résumé):** profile, about, experience, the 7 projects, skills/stack, contact details.
- **Placeholder — edit before publishing:**
  - `products` — reframes Nutri AI / Gen AI / AP Police as "shipped products".
  - `posts` (Blog) — 3 sample posts with `href: "#"`.
  - `sandbox` — 3 sample experiments.
  - `roadmap` — a sensible learning track; tweak items/done flags.

## Commands

- `npm run dev` — local dev at http://localhost:3000
- `npm run build` — static export to `out/` (also typechecks)
- `npm run lint`

## Deploy (GitHub Pages)

- GitHub account: **`satyamotipalli`** (renamed from `Satyavv2`). Repo: **`satyamotipalli/portfolio`**.
- Local `origin` → `https://github.com/satyamotipalli/portfolio.git`. **Live URL:
  `https://satyamotipalli.github.io/portfolio/`.**
- CI ([deploy.yml](.github/workflows/deploy.yml)) runs on push to `main`: derives
  `PAGES_BASE_PATH=/<repo-name>` (→ `/portfolio`), builds, publishes `out/`.
- After first push: GitHub → **Settings → Pages → Source: "GitHub Actions"**.
- **Auth snag (current blocker):** the laptop's Git Credential Manager holds a stale credential for
  an unrelated account `SatyanarayanaVVMotipalli` → `403`. The user must push from their **own
  terminal** signing in as `satyamotipalli` (clear the `git:https://github.com` entry in Windows
  Credential Manager if it keeps 403-ing). Pushing from the agent sandbox hangs (no browser prompt).
- Stray empty clone at `D:\sparity_projects\portfolio` — ignore it; real project is `satya_portfolio`.

## How to make common changes

- **Edit text / add a project / post / skill** → [lib/content.ts](lib/content.ts).
- **Change colors / glow / background** → `:root` vars in [app/globals.css](app/globals.css).
- **Add a logo/image** → drop in [public/](public/), reference as `/file.png` (Next applies basePath).
- **Add a real CV download** → put `cv.pdf` in `public/`, add a button in `Hero.tsx`.
- **Reorder sections** → [app/page.tsx](app/page.tsx) (update `nav` hrefs if anchors change).

## Open follow-ups

- Swap placeholder Blog/Sandbox/Products for real content.
- Optional: real contact-form backend (Formspree/Web3Forms) instead of mailto.
- Optional: per-section active nav highlighting, scroll-progress bar.
- Optional: heavier particle hero graphic (reference uses one; ours is a lightweight SVG hexagon).
