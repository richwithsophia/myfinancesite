require("dotenv").config({ path: ".env.local" });

async function seed() {
  const { saveDraft, publishBrief } = await import("../app/lib/briefs");

  const draft = await saveDraft({
    date: "Friday, March 6, 2025",
    executiveSummary: "Test brief. Markets are doing market things.",
    marketPerformance: [
      { index: "S&P 500", value: "5,600", change: "+0.5%", direction: "up" },
    ],
    keyDevelopments: [
      { icon: "📈", tag: "Test", headline: "This is a test headline", plain: "This is the plain text explanation." },
    ],
    whatToWatch: [
      { item: "Test item", detail: "This is what to watch for." },
    ],
    tacticalInsight: {
      title: "This is the insight title.",
      body: "This is the insight body copy.",
    },
  });

  console.log("Draft saved:", draft.id);

  const published = await publishBrief(draft.id, {});
  console.log("Published:", published.publishedAt);
}

seed().catch(console.error);