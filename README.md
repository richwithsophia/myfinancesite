# Rich with Sophia
> Markets explained for your real life.

A personal finance website for women 25–35 who find financial news overwhelming. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

---

## Quick Start

```bash
npm install
npm run dev   # → http://localhost:3000
```

---

## Stack
- **Next.js 16** — App Router, Turbopack
- **TypeScript**
- **Tailwind CSS v4** + custom `rws-` layout utilities
- **Fonts**: Playfair Display (headings) · Inter (body)

---

## Structure

```
app/
├── lib/brand.ts          # All colors & fonts — edit here to rebrand
├── components/
│   ├── Nav.tsx
│   ├── Footer.tsx
│   ├── PageWrapper.tsx   # Wraps every page
│   └── ui/               # Reusable components (SectionLabel, PageCard, CtaBand, SubscribeForm...)
├── page.tsx              # Home
├── daily-brief/          # Daily Brief reader
├── tools/                # Tools index + Net Worth Calculator
└── globals.css           # Global reset + responsive grid classes
```

---

## The 5 Rules

1. Colors/fonts → `lib/brand.ts` only, never hardcoded
2. Every page → wrapped in `<PageWrapper>` + `rws-container`
3. Grids → `globals.css` classes (`rws-grid-2`, `rws-grid-3`, `rws-editorial`) — never inline
4. Repeated UI → component in `components/ui/` — never copy-pasted
5. Font sizes → always `clamp(min, fluid, max)` — never fixed

---

## Roadmap

| | Feature |
|---|---|
| ✅ v1 | Content pages + tools |
| 🔜 v1 | Subscribe to Daily Brief (wire `SubscribeForm` to email provider) |
| 🔜 v1 | Push briefs to subscribers (move data to CMS) |
| 🔜 v2 | Affiliate links + recommendations page |

---

## Adding Things

- **New tool** → add to `tools` array in `app/tools/page.tsx`
- **New page** → create file, wrap in `<PageWrapper>`, use `rws-container`
- **New UI component** → add to `app/components/ui/`, export from `index.ts`
- **Rebrand** → change `app/lib/brand.ts` only

---

## V1 → V2 Upgrade Path

### V1: Subscribe to Daily Brief
- `SubscribeForm` component is already built
- Drop `<SubscribeForm />` on any page
- Wire `handleSubmit` to your email provider (Mailchimp / ConvertKit / Resend):
  ```ts
  await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
  ```
- Create `app/api/subscribe/route.ts` to handle the POST

### V1: Push Daily Briefs to Subscribers
- Current: brief data is hardcoded in `daily-brief/page.tsx`
- Migration: move `ALL_BRIEFS` to `app/lib/briefs.ts`
- Next step: replace with CMS fetch (Contentful, Sanity, or Notion API)
- The page component doesn't need to change — just swap the data source

### V2: Affiliate Links
- Create `app/components/ui/AffiliateCard.tsx`
- Same pattern as `PageCard` but with disclosure badge and tracking link
- Add an `/affiliate` or `/recommendations` page using `rws-grid-2` or `rws-grid-3`
- No infrastructure changes needed

### V2: More Tools
- Add to the `tools` array in `app/tools/page.tsx` — zero other changes
- New tool page: create `app/tools/[tool-name]/page.tsx`, wrap in `PageWrapper`

### Future: Auth / Subscriber-Only Content
- Add middleware at `app/middleware.ts`
- Gate pages by checking session
- `PageWrapper` can accept an `requiresAuth` prop to redirect

---

## What Belongs Where

| Type | Location |
|------|----------|
| Brand colors/fonts | `app/lib/brand.ts` |
| Global CSS / layout grids | `app/globals.css` |
| Structural layout | `PageWrapper` + `rws-container` |
| Reusable UI pattern (used 2+ times) | `app/components/ui/` |
| Page-specific layout | Inline in page file |
| Page data (copy, cards, briefs) | Top of page file → later `app/lib/` |
| Interactive state | Page file or dedicated component |