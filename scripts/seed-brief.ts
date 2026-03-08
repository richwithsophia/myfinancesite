require("dotenv").config({ path: ".env.local" });

async function seed() {
  const { saveDraft, publishBrief } = await import("../app/lib/briefs");

  const draft = await saveDraft({
    date: "Friday, March 6, 2025",
    mood: "steady",
    executiveSummary: "Test brief. Markets are doing market things.",
    keyTakeaways: [
      "Your 401k held steady today — no dramatic moves to worry about.",
      "Rates are unchanged, so your mortgage math stays the same.",
      "Watch Friday's jobs report — it could move markets more than today did.",
    ],
    quotableInsight: "A boring market day is a good market day for long-term investors.",
    marketPerformance: [
      { index: "S&P 500",      value: "5,600",  change: "+0.5%",  direction: "up"   },
      { index: "Nasdaq",       value: "17,840", change: "+0.8%",  direction: "up"   },
      { index: "Dow Jones",    value: "41,200", change: "+0.3%",  direction: "up"   },
      { index: "10Y Treasury", value: "4.52%",  change: "-0.02%", direction: "down" },
    ],
    keyDevelopments: [
      {
        icon: "📈",
        tag: "MARKETS",
        headline: "This is a test headline",
        plain: "This is the plain text explanation of what happened and why it matters to her.",
      },
    ],
    whatToWatch: [
      { item: "Test item",        detail: "This is what to watch for."          },
      { item: "Second test item", detail: "This is the second thing to monitor." },
    ],
    tacticalInsight: {
      title: "This is the insight title.",
      body:  "This is the insight body copy. This is not financial advice.",
    },
  });

  console.log("Draft saved:", draft.id);

  const published = await publishBrief(draft.id, {});
  console.log("Published:", published.publishedAt);
}

seed().catch(console.error);