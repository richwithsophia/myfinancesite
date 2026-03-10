// ─────────────────────────────────────────────────────────────────────────────
// app/daily-brief/[date]/page.tsx
//
// Server component — loads a specific brief by date slug.
// e.g. /daily-brief/2026-03-09
//
// If the brief doesn't exist or isn't published, redirects to /daily-brief.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation";
import { getBrief, getAllBriefs, type Brief } from "@/app/lib/briefs";
import DailyBriefClient from "../DailyBriefClient";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;

  let title = "Daily Brief";
  let description = "Your weekday market brief — what moved, why it matters, and what to do about it.";

  try {
    const brief = await getBrief(date);
    if (brief && brief.status === "published") {
      const formatted = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      });
      title = `Daily Brief — ${formatted}`;
      if (brief.openingSection?.takeaways?.[0]) {
        description = brief.openingSection.takeaways[0];
      }
    }
  } catch {
    // fall through to defaults
  }

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Rich with Sophia`,
      description,
      url: `https://myfinancesite.vercel.app/daily-brief/${date}`,
    },
    twitter: {
      title: `${title} | Rich with Sophia`,
      description,
    },
  };
}

export default async function DailyBriefDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;

  // Load the specific brief
  let brief: Brief | null = null;
  let publishedBriefs: Brief[] = [];

  try {
    brief = await getBrief(date);
  } catch {
    redirect("/daily-brief");
  }

  // If not found or not published, redirect to latest
  if (!brief || brief.status !== "published") {
    redirect("/daily-brief");
  }

  // Load all published briefs for prev/next navigation
  try {
    const all = await getAllBriefs();
    publishedBriefs = all
      .filter((b) => b.status === "published")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    // If this fails, still show the brief — just without navigation
    publishedBriefs = [brief];
  }

  // Set the initial index to this brief's position in the sorted list
  // so prev/next nav works correctly from any entry point
  const briefIndex = publishedBriefs.findIndex((b) => b.date === date);
  const orderedBriefs = briefIndex > -1 ? publishedBriefs : [brief, ...publishedBriefs];

  return (
    <DailyBriefClient
      brief={brief}
      allBriefs={orderedBriefs}
      initialIndex={briefIndex > -1 ? briefIndex : 0}
      fetchError={false}
    />
  );
}