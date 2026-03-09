# Rich with Sophia

Personal finance and market news explained simply for high-earning women. A daily brief, net worth calculator, and financial tools — built with Next.js and powered by Claude AI.

---

## What This Is

Rich with Sophia is a fully automated personal finance publication. Every weekday at 9:30am ET, a pipeline fetches live market data and real financial headlines, generates a daily brief using Claude AI, and emails it to the editor for review. The editor reviews, edits if needed, and publishes with one click.

**Live site:** https://myfinancesite.vercel.app

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + custom `rws-` utility classes |
| Database | Upstash Redis (via `@upstash/redis`) |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Email (transactional) | Resend |
| Email (subscribers) | Beehiiv |
| Market data | Finnhub (prices) + Marketaux (headlines) |
| Hosting | Vercel (GitHub auto-deploy) |
| Cron | cron-job.org (fires POST /api/generate-brief weekdays at 9:30am ET) |
| Fonts | Playfair Display (headings), Inter (body) |

---

## Project Structure

```
app/
  admin/
    page.tsx                        ← Token-gated brief dashboard (draft/publish/unpublish/delete)
    brief/[id]/
      page.tsx                      ← Dark-theme brief editor
  api/
    admin/briefs/
      route.ts                      ← Returns all briefs for admin dashboard
    brief/[id]/
      route.ts                      ← GET (fetch/publish/unpublish), PATCH (save edits), DELETE
    generate-brief/
      route.ts                      ← Full pipeline: Finnhub → Marketaux → Claude x2 → Redis → Resend
    subscribe/
      route.ts                      ← Accepts POST { email }, adds subscriber to Beehiiv
  components/
    ui/                             ← Shared UI components (SectionLabel, Divider, SubscribeForm, etc.)
    Footer.tsx
    Nav.tsx
    PageWrapper.tsx
  daily-brief/
    DailyBriefClient.tsx            ← Full brief UI with prev/next navigation
    page.tsx                        ← SSR, loads latest published brief
    [date]/
      page.tsx                      ← SSR, loads specific brief by date slug
  lib/
    brand.ts                        ← Single source of truth for all design tokens
    briefPrompt.ts                  ← SYSTEM_PROMPT, buildUserMessage(), buildSubjectLinePrompt()
    briefs.ts                       ← Brief type, Redis CRUD (saveDraft, publishBrief, revertToDraft, deleteBrief, etc.)
  tools/
    net-worth/page.tsx
    page.tsx
  about/page.tsx
  globals.css
  layout.tsx
  page.tsx
scripts/
  seed-brief.ts
```

---

## Brief Data Model

```typescript
type Brief = {
  id: string;                        // date string e.g. "2026-03-09"
  date: string;
  status: "draft" | "published";
  mood: string;
  openingSection: {
    takeaways: string[];             // 2-3 bullet takeaways
    context: string;                 // 1-2 sentence context paragraph
  };
  quotableInsight: string;
  marketPerformance: MarketPerformanceItem[];
  keyDevelopments: KeyDevelopment[];
  tacticalInsight: TacticalInsight;
  whatToWatch: WhatToWatchItem[];
  seasonalTip?: SeasonalTip;
  subjectLines?: string[] | null;
  createdAt: string;
  publishedAt: string | null;
};
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- Git
- A Vercel account (for Redis via Upstash)

### 1. Clone the repo
```bash
git clone https://github.com/richwithsophia/myfinancesite.git
cd myfinancesite
npm install
```

### 2. Create `.env.local`
Create a `.env.local` file at the project root with the following variables (see [Environment Variables](#environment-variables) for where to get each):

```env
KV_REST_API_URL=
KV_REST_API_TOKEN=
CRON_SECRET=
EDITOR_SECRET=
ANTHROPIC_API_KEY=
FINNHUB_API_KEY=
MARKETAUX_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
MY_EMAIL=
BEEHIIV_API_KEY=
BEEHIIV_PUBLICATION_ID=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run locally
```bash
npm run dev
```

Site runs at `http://localhost:3000`.

---

## Environment Variables

| Variable | Where to get it |
|----------|----------------|
| `KV_REST_API_URL` | Vercel dashboard → Storage → your Upstash Redis database → `.env.local` tab |
| `KV_REST_API_TOKEN` | Same as above |
| `CRON_SECRET` | Generate any long random string (e.g. randomkeygen.com → 256-bit WEP key) |
| `EDITOR_SECRET` | Generate any long random string — used to access `/admin` |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `FINNHUB_API_KEY` | finnhub.io → Dashboard → API Key |
| `MARKETAUX_API_KEY` | marketaux.com → Dashboard → API Token |
| `RESEND_API_KEY` | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | A verified sender domain in Resend (e.g. `briefs@yourdomain.com`) |
| `MY_EMAIL` | Your email address — where draft review emails are sent |
| `BEEHIIV_API_KEY` | beehiiv.com → Settings → API → Generate API Key |
| `BEEHIIV_PUBLICATION_ID` | beehiiv.com → Settings → Publication → Publication ID |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL (e.g. `https://myfinancesite.vercel.app`) |

All variables must also be added to Vercel → your project → Settings → Environment Variables for production to work.

---

## Deployment

This project auto-deploys to Vercel on every push to `main`.

### First-time Vercel setup
1. Go to vercel.com → Add New Project → Import from GitHub
2. Select `richwithsophia/myfinancesite`
3. Add all environment variables under Settings → Environment Variables
4. Deploy

### Subsequent deploys
```bash
git add .
git commit -m "your message"
git push origin main
```

Vercel picks up the push and deploys automatically within ~30 seconds.

---

## Cron Job

The daily brief pipeline is triggered by **cron-job.org** (not Vercel's built-in cron, which has a 10s timeout on the free plan).

**Schedule:** 9:30am America/New_York, Monday–Friday (`30 9 * * 1-5`)

**Setup:**
1. Create a free account at cron-job.org
2. Create a new cronjob:
   - URL: `https://myfinancesite.vercel.app/api/generate-brief`
   - Method: `POST`
   - Schedule: Custom, `30 9 * * 1-5`, timezone: America/New_York
3. Under Advanced → Request Headers, add:
   - `Authorization: Bearer YOUR_CRON_SECRET`
   - `Content-Type: application/json`
4. Enable the job

**Seasonal timezone note:** cron-job.org handles EDT/EST automatically when timezone is set to America/New_York. No manual adjustment needed.

---

## Testing the Pipeline Manually

### From PowerShell (local)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/generate-brief" -Method POST -Headers @{ "Authorization" = "Bearer YOUR_CRON_SECRET"; "Content-Type" = "application/json" } | Select-Object -ExpandProperty Content
```

### From PowerShell (production)
```powershell
Invoke-WebRequest -Uri "https://myfinancesite.vercel.app/api/generate-brief" -Method POST -Headers @{ "Authorization" = "Bearer YOUR_CRON_SECRET"; "Content-Type" = "application/json" } | Select-Object -ExpandProperty Content
```

A successful response looks like:
```json
{"success":true,"draftId":"2026-03-09"}
```

---

## Admin Workflow

1. Navigate to `/admin` and enter your `EDITOR_SECRET`
2. **Drafts** — briefs waiting for review. Actions: Edit, Publish, Delete
3. **Published** — live briefs. Actions: Unpublish (reverts to draft), View Live
4. The editor at `/admin/brief/[date]` lets you edit all fields and select a subject line before publishing
5. **Generate New Brief** button triggers the pipeline manually (will warn if a brief already exists for today)

---

## Subscriber Capture

Email signups are captured via `/api/subscribe` and sent directly to Beehiiv.

- Subscribe form appears on every page (hero, daily brief, about, tools)
- Single opt-in — subscribers are added immediately with a welcome email
- UTM parameters tracked automatically (`utm_source=website`, `utm_medium=organic`)
- To view subscribers: beehiiv.com → Subscribers

**Sending the newsletter:**
Beehiiv's Send API requires Enterprise access and is not wired up programmatically. When a brief is published, send it manually from the Beehiiv dashboard. A template matching the brief layout is recommended for consistency.

---

## Known Issues & To-Do

- [ ] Market data uses ETF proxies (SPY, QQQ, IWM, TLT) with multipliers to approximate index values — not exact. Consider switching to a data provider that returns actual index values (e.g. Financial Modeling Prep or Alpha Vantage)
- [ ] No branded OG image yet — add `/public/og-image.jpg` (1200×630) and wire into `layout.tsx` metadata when ready
- [ ] Affiliate disclosure component — add before monetization launch
- [ ] Beehiiv newsletter template — build a reusable template in Beehiiv that mirrors the brief layout for consistent sending

---

## Brand

| Token | Value |
|-------|-------|
| Background | `#FAFAF7` |
| Forest green | `#2D6A4F` |
| Coral | `#E07A5F` |
| Card | `#F2F0EB` |
| Heading font | Playfair Display |
| Body font | Inter |

All design tokens live in `app/lib/brand.ts` — never hardcode colors elsewhere.

---

## Code Conventions

- All files are `.tsx` or `.ts` — never `.js`
- `"use client"` must be the **literal first line** of any client component — before imports or comments
- `brand.ts` is the single source of truth for design tokens
- All pages use `<Nav />` and `<Footer />` via `<PageWrapper />` — no inline duplication