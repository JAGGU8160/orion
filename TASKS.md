# Orion — Pending Tasks

## 🔴 HIGH PRIORITY

### 1. Vercel Cron — Replace n8n Data Pipeline
**Why:** n8n Cloud free trial expires in 5 days, publishing blocked (Unauthorized).  
**What to build:**
- `app/api/refresh/route.ts` — fetches all data sources, writes to Google Sheets
- `vercel.json` — cron schedule `0 */6 * * *` (every 6 hours)

**APIs to call (same as current n8n workflow):**
- Spaceflight News: `https://api.spaceflightnewsapi.net/v4/articles`
- NASA APOD: `https://api.nasa.gov/planetary/apod?api_key=NASA_API_KEY`
- NASA Asteroids: `https://api.nasa.gov/neo/rest/v1/feed`
- Gujarat Sky Tonight: custom sun/moon calculation (already in `lib/sun.ts`)
- ISS Crew: `http://api.open-notify.org/astros.json`
- Groq AI scoring + rewriting: `https://api.groq.com/openai/v1/chat/completions`
- Save to Google Sheets (append rows)
- Send digest to Telegram

**Env vars needed from user:**
- `NASA_API_KEY`
- `GROQ_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON` (or existing sheet credentials)

**Cost: $0 — Vercel hobby plan includes free cron**

---

## 🟡 IN PROGRESS

### 2. Archive Page — Match Design Spec
See plan below in this file.

---

## ✅ DONE

- Navbar: PROJECT ORION in Orbitron font + cyan→violet gradient
- Hero: APOD image card in right column, compact Sky Tonight below
- Archive page: AstroArchive component with 500 entries (1801–2026)
- Archive: All 16 design differences implemented (ticker, progress bar, chip colours, etc.)
- Light/dark theme auto-switch by Gujarat sunrise/sunset

---

## 📋 ARCHIVE PAGE PLAN

### Current state (`localhost:3002/archive`)
The page loads with: existing Navbar (fixed, 68px) → ticker → hero → sidebar+feed grid.
All 16 design differences have been applied. The component is functional.

### Remaining gaps vs design spec

#### GAP 1 — Page-level nav for Archive
The design spec gives the archive its own integrated mini-nav bar at top
(logo + Archive/Eras/Categories/About links + theme toggle + Subscribe CTA).
Currently uses the shared homepage Navbar which has Home/Top Stories/Latest News.

**Plan:** Create `components/ArchiveNav.tsx` — a slim 64px fixed bar specific to the
archive page. Links scroll to: #archive-hero, #archive-grid, #dec-1800, about section.
Keep the OrionMark logo, keep ThemeToggle, remove homepage nav items.
Use in `app/archive/page.tsx` instead of `<Navbar />`.

#### GAP 2 — Starfield / DaytimeSky on archive page
Currently `app/archive/page.tsx` includes `<Starfield />` and `<DaytimeSky />`.
Design shows a clean dark gradient background, not the animated starfield.
Archive is content-heavy — starfield competes visually with the cards.

**Plan:** Remove Starfield + DaytimeSky from archive page. Use a simple
`background: linear-gradient(180deg, #05060f 0%, #0a0e27 60%, #05060f 100%)`
on the `<main>` element instead.

#### GAP 3 — Mobile layout
On screens < 1080px the sidebar stacks above the feed (CSS already handles this).
But the mega search box needs testing — the 3-column grid should collapse to rows.
The decade scrubber ticks become too dense on mobile.

**Plan:** On mobile (< 480px), show only every other decade tick in the scrubber.
Add `overflow-x: auto` to the scrubber track on mobile.

#### GAP 4 — Entry card image thumbnails
Currently cards show a coloured gradient placeholder when `entry.img = true`.
Design shows actual real images for milestone entries.
Since data is static (astro-data.ts), we can't fetch real images.

**Plan:** Keep gradient thumbnails but add a Wikipedia-commons URL for the
top 20 milestone entries in `astro-data.ts` (Hubble, Apollo 11, Voyager, etc.).
Use `<img>` with `onError` fallback to the gradient.

#### GAP 5 — "About this archive" footer section
Design has a small footer inside the archive (separate from main site footer)
explaining the data source, methodology, and a link to the full Orion site.

**Plan:** Add a `<footer>` at the bottom of AstroArchive.tsx after the sentinel div.
Content: "500 moments spanning 1801–2026, curated from astronomical records."
+ link back to homepage.

### Implementation order
1. ArchiveNav (GAP 1) — visual identity
2. Remove Starfield/DaytimeSky (GAP 2) — performance
3. Mobile scrubber (GAP 3) — usability  
4. Milestone images (GAP 4) — polish
5. Archive footer (GAP 5) — completeness
