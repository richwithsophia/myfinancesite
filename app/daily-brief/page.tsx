// ─────────────────────────────────────────────────────────────────────────────
// app/daily-brief/page.tsx
//
// Server component — entry point for the /daily-brief route.
//
// Responsibilities:
//   1. Fetches all published briefs from Redis via getAllBriefs()
//   2. Filters to published-only and sorts newest first
//   3. Passes the current (latest) brief + full sorted list to DailyBriefClient
//   4. Handles fetch errors gracefully — passes fetchError flag to client
//
// Prev/Next navigation is powered by the full publishedBriefs array passed
// as a prop. The client component handles navigation state with no additional
// API calls needed.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { getAllBriefs, type Brief } from "@/app/lib/briefs";
import DailyBriefClient from "./DailyBriefClient";


export const metadata: Metadata = {
  title: "Daily Brief",
  description: "Your weekday market brief — what moved, why it matters, and what to do about it. Under 5 minutes.",
  openGraph: {
    title: "Daily Brief | Rich with Sophia",
    description: "Your weekday market brief — what moved, why it matters, and what to do about it. Under 5 minutes.",
    url: "https://myfinancesite.vercel.app/daily-brief",
  },
  twitter: {
    title: "Daily Brief | Rich with Sophia",
    description: "Your weekday market brief — what moved, why it matters, and what to do about it.",
  },
};

export default async function DailyBriefPage() {
  let publishedBriefs: Brief[] = [];
  let fetchError = false;

  try {
    const all = await getAllBriefs();
    publishedBriefs = all
      .filter((b) => b.status === "published")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    fetchError = true;
  }

  const latest = publishedBriefs[0] ?? null;

  return (
    <DailyBriefClient
      brief={latest}
      allBriefs={publishedBriefs}
      fetchError={fetchError}
    />
  );
}