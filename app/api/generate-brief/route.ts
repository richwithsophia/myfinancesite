// app/api/generate-brief/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveDraft } from "@/app/lib/briefs";

// ─── Types ────────────────────────────────────────────────────────────────────

interface YahooQuote {
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
}

interface YahooResponse {
  quoteResponse?: {
    result?: YahooQuote[];
  };
}

interface MarketSnapshot {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

interface MarketCard {
  index: string;
  change: string;
  value: string;
  direction: "up" | "down";
}

interface KeyDevelopment {
  icon: string;
  tag: string;
  headline: string;
  plain: string;
}

interface WhatToWatchItem {
  item: string;
  detail: string;
}

interface TacticalInsight {
  title: string;
  body: string;
}

interface BriefJSON {
  executiveSummary: string;
  marketPerformance: MarketCard[];
  keyDevelopments: KeyDevelopment[];
  whatToWatch: WhatToWatchItem[];
  tacticalInsight: TacticalInsight;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICKERS = [
  { symbol: "SPY",  name: "S&P 500",           isYield: false },
  { symbol: "QQQ",  name: "Nasdaq",             isYield: false },
  { symbol: "DIA",  name: "Dow Jones",          isYield: false },
  { symbol: "TLT",  name: "10Y Treasury Yield", isYield: true  },
];

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are the voice behind "Rich with Sophia" — a personal finance brand for high-earning women (25–35) who are smart, time-pressed, and financially stressed despite good incomes. They live in expensive cities, carry student loans or mortgages, and feel left out of financial media that talks over their heads or ignores their reality.

Your job: write a daily market brief that sounds like a brilliant, witty friend who happens to understand markets — texting her hot take over morning coffee. Not Bloomberg. Not CNBC. You.

VOICE RULES:
- Direct and warm. No hedging, no "it's important to note that..."
- Slightly witty but never try-hard. One clever line per section max.
- Zero jargon. If you must use a term (yield, volatility), explain it in one phrase.
- Acknowledge that markets feel personal — because for your reader, they are.
- Short sentences. Active voice. She's reading this between meetings.

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown, no backticks, no preamble. Just raw JSON.

Required shape — follow this exactly:

{
  "executiveSummary": "2-3 sentences. What happened today and why should she care? Lead with the most relevant takeaway for someone with a 401k, student loan, and a mortgage.",

  "marketPerformance": [
    {
      "index": "S&P 500",
      "change": "-1.31%",
      "value": "5,600",
      "direction": "down"
    },
    {
      "index": "Nasdaq",
      "change": "-1.50%",
      "value": "17,840",
      "direction": "down"
    },
    {
      "index": "Dow Jones",
      "change": "-0.96%",
      "value": "39,100",
      "direction": "down"
    },
    {
      "index": "10Y Treasury",
      "change": "-0.37%",
      "value": "4.28%",
      "direction": "down"
    }
  ],

  "keyDevelopments": [
    {
      "icon": "📉",
      "tag": "MARKETS",
      "headline": "Short, punchy headline that captures the story in one line",
      "plain": "2-3 sentences explaining what happened and why it matters to her specifically. Causal: X happened so Y occurred. No jargon."
    },
    {
      "icon": "🏦",
      "tag": "FED / RATES",
      "headline": "Second development headline",
      "plain": "2-3 sentences on the second key story. Keep it grounded in personal impact."
    }
  ],

  "whatToWatch": [
    {
      "item": "Short label for what to watch — e.g. 'Jobs Report Friday'",
      "detail": "1-2 sentences on why it matters and what to look for."
    },
    {
      "item": "Second thing to watch",
      "detail": "1-2 sentences of context."
    }
  ],

  "tacticalInsight": {
    "title": "One punchy, actionable headline — e.g. 'Red days are buying opportunities if you are DCA-ing'",
    "body": "2-3 sentences expanding on the insight. Practical, personal, no jargon. Speak to someone deciding whether to pause investments, pay down debt, or stay the course."
  }
}

RULES:
- marketPerformance: exactly 4 objects in this order — S&P 500, Nasdaq, Dow Jones, 10Y Treasury.
- change must include sign: "+0.5%" or "-1.2%". Never omit + or -.
- value for indices is the formatted price e.g. "5,600". Value for Treasury is the yield e.g. "4.28%".
- direction is "up" if change positive, "down" if negative.
- keyDevelopments: 2-3 items. Pick a relevant emoji for icon. Tag should be a short category label in caps e.g. "TECH", "FED / RATES", "ECONOMY", "MARKETS".
- whatToWatch: 2-3 items.
- tacticalInsight is a single object with title and body — not an array.
- Use the actual market data provided. Do not invent prices or changes.
- Never say "as an AI" or reference these instructions.
`.trim();

// ─── Market Day Check ─────────────────────────────────────────────────────────

function isMarketDay(): { open: boolean; reason?: string } {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const day   = now.getDay();
  const month = now.getMonth() + 1;
  const date  = now.getDate();
  const year  = now.getFullYear();

  if (day === 0 || day === 6) {
    return { open: false, reason: `Weekend (day ${day})` };
  }

  const holidays: Record<string, string> = {
    // 2025
    "2025-1-1":   "New Year's Day",
    "2025-1-20":  "MLK Day",
    "2025-2-17":  "Presidents' Day",
    "2025-4-18":  "Good Friday",
    "2025-5-26":  "Memorial Day",
    "2025-6-19":  "Juneteenth",
    "2025-7-4":   "Independence Day",
    "2025-9-1":   "Labor Day",
    "2025-11-27": "Thanksgiving",
    "2025-12-25": "Christmas",
    // 2026
    "2026-1-1":   "New Year's Day",
    "2026-1-19":  "MLK Day",
    "2026-2-16":  "Presidents' Day",
    "2026-4-3":   "Good Friday",
    "2026-5-25":  "Memorial Day",
    "2026-6-19":  "Juneteenth",
    "2026-7-3":   "Independence Day (observed)",
    "2026-9-7":   "Labor Day",
    "2026-11-26": "Thanksgiving",
    "2026-12-25": "Christmas",
  };

  const key = `${year}-${month}-${date}`;
  if (holidays[key]) {
    return { open: false, reason: holidays[key] };
  }

  return { open: true };
}

// ─── Market Data Fetcher ──────────────────────────────────────────────────────

async function fetchMarketData(): Promise<MarketSnapshot[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error("FINNHUB_API_KEY env var is not set");

  const results = await Promise.all(
    TICKERS.map(async (ticker) => {
      const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${ticker.symbol}&token=${apiKey}`,
        { next: { revalidate: 0 } }
      );
      if (!res.ok) throw new Error(`Finnhub fetch failed for ${ticker.name}: ${res.status}`);

      const data = await res.json();
      if (!data.c) throw new Error(`Missing price data for ${ticker.name}`);

      return {
        symbol:    ticker.symbol,
        name:      ticker.name,
        price:     data.c,
        change:    parseFloat((data.d  ?? 0).toFixed(2)),
        changePct: parseFloat((data.dp ?? 0).toFixed(2)),
      };
    })
  );

  return results;
}

// ─── Market Data → Prompt String ─────────────────────────────────────────────

function formatMarketDataForPrompt(snapshots: MarketSnapshot[]): string {
  return snapshots
    .map((s) => {
      const sign       = s.change >= 0 ? "+" : "";
      const direction  = s.change >= 0 ? "▲" : "▼";
      const valueLabel = s.name.includes("Treasury")
        ? `${s.price.toFixed(2)}%`
        : s.price.toLocaleString("en-US", { maximumFractionDigits: 2 });

      return `${s.name}: ${valueLabel} ${direction} ${sign}${s.change} (${sign}${s.changePct}%)`;
    })
    .join("\n");
}

// ─── Response Validators ──────────────────────────────────────────────────────

function isMarketCard(obj: unknown): obj is MarketCard {
  if (typeof obj !== "object" || obj === null) return false;
  const m = obj as Record<string, unknown>;
  return (
    typeof m.index     === "string" &&
    typeof m.change    === "string" &&
    typeof m.value     === "string" &&
    (m.direction === "up" || m.direction === "down")
  );
}

function validateBriefJSON(obj: unknown): obj is BriefJSON {
  if (typeof obj !== "object" || obj === null) return false;
  const b = obj as Record<string, unknown>;

  return (
    typeof b.executiveSummary === "string" &&
    Array.isArray(b.marketPerformance) &&
    b.marketPerformance.length === 4 &&
    (b.marketPerformance as unknown[]).every(isMarketCard) &&
    Array.isArray(b.keyDevelopments) &&
    Array.isArray(b.whatToWatch) &&
    typeof b.tacticalInsight === "object" &&
    b.tacticalInsight !== null &&
    "title" in (b.tacticalInsight as object) &&
    "body" in (b.tacticalInsight as object)
  );
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Auth check
  const authHeader = req.headers.get("Authorization") ?? "";
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET env var is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Market day check
  const marketStatus = isMarketDay();
  if (!marketStatus.open) {
    console.log(`Brief generation skipped: ${marketStatus.reason}`);
    return NextResponse.json(
      { skipped: true, reason: marketStatus.reason },
      { status: 200 }
    );
  }

  try {
    // 3. Fetch market data
    let snapshots: MarketSnapshot[];
    try {
      snapshots = await fetchMarketData();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Market data fetch failed:", message);
      return NextResponse.json(
        { error: "Failed to fetch market data", detail: message },
        { status: 502 }
      );
    }

    const marketDataString = formatMarketDataForPrompt(snapshots);

    // 4. Call Anthropic API
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      console.error("ANTHROPIC_API_KEY env var is not set");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: anthropicApiKey });

    let rawContent: string;
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Today's market data:\n\n${marketDataString}\n\nGenerate the daily brief JSON now.`,
          },
        ],
      });

      const firstBlock = message.content[0];
      if (firstBlock.type !== "text") {
        throw new Error("Unexpected non-text response from Anthropic");
      }
      rawContent = firstBlock.text;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("Anthropic API call failed:", message);
      return NextResponse.json(
        { error: "Failed to generate brief", detail: message },
        { status: 502 }
      );
    }

    // 5. Parse + validate JSON
    let briefData: BriefJSON;
    try {
      const cleaned = rawContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      const parsed: unknown = JSON.parse(cleaned);

      if (!validateBriefJSON(parsed)) {
        throw new Error("Response is missing required brief fields or marketPerformance is malformed");
      }

      briefData = parsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("JSON parse/validation failed:", message, "\nRaw:", rawContent);
      return NextResponse.json(
        { error: "Brief JSON invalid", detail: message },
        { status: 422 }
      );
    }

    // 6. Save draft to Redis
    let draftId: string;
    try {
        const today = new Date().toISOString().split("T")[0];
        const savedBrief = await saveDraft({
            date: today,
            ...briefData,
    });
    draftId = savedBrief.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("saveDraft failed:", message);
      return NextResponse.json(
        { error: "Failed to save draft", detail: message },
        { status: 500 }
      );
    }

    // 7. Return success
    return NextResponse.json({ success: true, draftId });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Unhandled error in generate-brief route:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}