# LinkedIn → Blog scraper

Local tool that scrapes **your own** LinkedIn activity and writes
`../lib/posts.generated.json`, which the portfolio's Blog section reads automatically.

It opens a real Chromium window, reuses a saved login session, scrolls your activity
page, then sends the raw text to **Gemini** to produce clean `{ title, excerpt, date, tag, href }`
entries.

> ⚠️ Scraping LinkedIn is against their Terms of Service even for your own data and can get
> an account flagged. Run on your own account at your own risk. This tool only **reads** your
> activity — it never posts or changes anything.

## Setup (once)

```bash
cd scraper
npm install
npx playwright install chromium
cp .env.example .env        # then edit .env and set GEMINI_API_KEY
```

## Log in (once, or whenever the session expires)

```bash
npm run login
```

A browser opens. Log into LinkedIn, wait until you see your feed, then press **Enter** in
the terminal. Your session is saved in `.auth/` (gitignored).

## Scrape

```bash
npm run scrape
```

This writes `../lib/posts.generated.json`. Then rebuild the site:

```bash
cd ..
npm run build
```

The Blog section will show the scraped posts. If `posts.generated.json` is empty, the site
falls back to the placeholder posts in `lib/content.ts`.

## Config (.env)

| Var | Default | Notes |
|-----|---------|-------|
| `GEMINI_API_KEY` | — | required |
| `LINKEDIN_PROFILE_URL` | your profile | scrapes `<url>/recent-activity/all/` |
| `GEMINI_MODEL` | `gemini-2.0-flash` | any Gemini model id |
| `MAX_POSTS` | `9` | how many posts to keep |

## When it breaks

LinkedIn changes its markup and bot defenses often. If you get "almost no content" or a login
wall: run `npm run login` again. If structuring looks off, the raw model output is printed to
help debug. This is best-effort — the **manual** fallback (edit `posts` in `lib/content.ts`)
always works.
