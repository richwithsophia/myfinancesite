// app/api/generate-brief/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { saveDraft, publishBrief } from "@/app/lib/briefs";
import { SYSTEM_PROMPT, buildUserMessage, buildSubjectLinePrompt } from "@/app/lib/briefPrompt";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NewsHeadline {
  headline: string;
  source: string;
  summary: string;
  published: string;
}

interface MarketSnapshot {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

interface Ticker {
  symbol: string;
  name: string;
  isYield: boolean;
  multiplier: number;
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

interface SeasonalTip {
  tag: string;
  headline: string;
  plain: string;
}

interface BriefJSON {
  mood: string;
  openingSection: {
    takeaways: string[];
    context: string;
  };
  quotableInsight: string;
  marketPerformance: MarketCard[];
  keyDevelopments: KeyDevelopment[];
  whatToWatch: WhatToWatchItem[];
  tacticalInsight: TacticalInsight;
  seasonalTip?: SeasonalTip;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICKERS = [
  { symbol: "SPY", name: "S&P 500",           isYield: false, multiplier: 10   },
  { symbol: "QQQ", name: "Nasdaq",             isYield: false, multiplier: 38   },
  { symbol: "IWM", name: "Russell 2000",       isYield: false, multiplier: 11   },
  { symbol: "TLT", name: "10Y Treasury Yield", isYield: true,  multiplier: 0.054 },
];

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

      // Apply multiplier to convert ETF price to approximate index value
      const price     = parseFloat((data.c  * ticker.multiplier).toFixed(2));
      const change    = parseFloat(((data.d ?? 0) * ticker.multiplier).toFixed(2));
      const changePct = parseFloat((data.dp ?? 0).toFixed(2));

      return {
        symbol:    ticker.symbol,
        name:      ticker.name,
        price,
        change,
        changePct,
      };
    })
  );

  return results;
}

// ─── News Headline Fetcher ──────────────────────────────────────────────────────
async function fetchNewsHeadlines(): Promise<NewsHeadline[]> {
  const apiKey = process.env.MARKETAUX_API_KEY;
  if (!apiKey) {
    console.warn("MARKETAUX_API_KEY not set — skipping headline fetch");
    return [];
  }

  const queries = [
    { q: "federal reserve interest rates inflation unemployment", countries: "us" },
    { q: "global markets economy trade",                         countries: ""   },
    { q: "S&P 500 earnings economy GDP",                         countries: "us" },
  ];

  const seenUrls = new Set<string>();
  const headlines: NewsHeadline[] = [];

  await Promise.allSettled(
    queries.map(async ({ q, countries }) => {
      try {
        const params = new URLSearchParams({
          q,
          filter_entities: "true",
          language:        "en",
          sort:            "published_at",
          api_token:       apiKey,
          ...(countries ? { countries } : {}),
        });

        const res = await fetch(
          `https://api.marketaux.com/v1/news/all?${params.toString()}`,
          { next: { revalidate: 0 } }
        );

        if (!res.ok) {
          console.warn(`Marketaux request failed: ${res.status}`);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data.data)) return;

        for (const article of data.data) {
          if (seenUrls.has(article.url)) continue;
          seenUrls.add(article.url);

          headlines.push({
            headline:  article.title        ?? "",
            source:    article.source        ?? "Unknown",
            summary:   article.description  ?? "",
            published: article.published_at ?? "",
          });
        }
      } catch (err) {
        console.warn("Marketaux query failed:", err);
      }
    })
  );

  // Sort by published date, newest first, return top 8
  return headlines
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime())
    .slice(0, 8);
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

// ─── Build Draft Email ──────────────────────────────────────────────────────

function buildDraftEmailHtml({
  draftId,
  brief,
  subjectLines,
}: {
  draftId: string;
  brief: BriefJSON;
  subjectLines: string[] | null;
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const editorSecret = process.env.EDITOR_SECRET ?? "";

  const editorUrl  = `${siteUrl}/admin/brief/${draftId}?token=${editorSecret}`;
  const publishUrl = `${siteUrl}/api/brief/${draftId}?token=${editorSecret}&action=publish`;

  const subjectLineBlock = subjectLines
    ? `
      <div style="background:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Subject Line Options</p>
        <p style="color:#ffffff;margin:0 0 8px;">1. ${subjectLines[0]}</p>
        <p style="color:#ffffff;margin:0;">2. ${subjectLines[1]}</p>
      </div>`
    : "";

  const marketRows = brief.marketPerformance
    .map((m) => {
      const color = m.direction === "up" ? "#4ade80" : "#f87171";
      return `<tr>
        <td style="padding:8px 12px;color:#ffffff;">${m.index}</td>
        <td style="padding:8px 12px;color:#ffffff;">${m.value}</td>
        <td style="padding:8px 12px;color:${color};">${m.change}</td>
      </tr>`;
    })
    .join("");

  const developmentsBlock = brief.keyDevelopments
    .map((d) => `
      <div style="margin-bottom:16px;">
        <p style="color:#e07a5f;font-size:12px;text-transform:uppercase;margin:0 0 4px;">${d.icon} ${d.tag}</p>
        <p style="color:#ffffff;font-weight:600;margin:0 0 4px;">${d.headline}</p>
        <p style="color:#9ca3af;margin:0;">${d.plain}</p>
      </div>`)
    .join("");

  const watchBlock = brief.whatToWatch
    .map((w) => `
      <div style="margin-bottom:12px;">
        <p style="color:#ffffff;font-weight:600;margin:0 0 2px;">${w.item}</p>
        <p style="color:#9ca3af;margin:0;">${w.detail}</p>
      </div>`)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#000000;color:#ffffff;font-family:'Inter',Arial,sans-serif;margin:0;padding:24px;">
  <div style="max-width:640px;margin:0 auto;">

    <!-- Header -->
    <div style="margin-bottom:32px;">
      <p style="color:#2d6a4f;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Rich with Sophia</p>
      <h1 style="color:#ffffff;font-size:24px;margin:0 0 4px;">Daily Brief Draft</h1>
      <p style="color:#9ca3af;font-size:14px;margin:0;">${draftId} · Mood: ${brief.mood}</p>
    </div>

    <!-- Subject Lines -->
    ${subjectLineBlock}

    <!-- Action Buttons -->
    <div style="margin-bottom:32px;display:flex;gap:12px;flex-wrap:wrap;">
      <a href="${editorUrl}" style="display:inline-block;background:#2d6a4f;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
        Review &amp; Edit Brief →
      </a>
      <a href="${publishUrl}" style="display:inline-block;background:#1a1a1a;color:#e07a5f;border:2px solid #e07a5f;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px;">
        Publish As-Is →
      </a>
    </div>

    <hr style="border:none;border-top:1px solid #1a1a1a;margin-bottom:32px;">

    <!-- Today in 60 Seconds -->
    <div style="margin-bottom:32px;">
      <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Today in 60 Seconds</p>
      ${brief.openingSection.takeaways.map((t) => `<p style="color:#ffffff;margin:0 0 8px;">· ${t}</p>`).join("")}
      <p style="color:#9ca3af;line-height:1.6;margin:12px 0 0;padding-top:12px;border-top:1px solid #2a2a2a;">${brief.openingSection.context}</p>
    </div>

    <!-- Quotable Insight -->
    <div style="background:#1a1a1a;border-left:3px solid #e07a5f;padding:16px;border-radius:4px;margin-bottom:32px;">
      <p style="color:#e07a5f;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Quotable Insight</p>
      <p style="color:#ffffff;font-style:italic;margin:0;">"${brief.quotableInsight}"</p>
    </div>

    <!-- Market Performance -->
    <div style="margin-bottom:32px;">
      <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Market Performance</p>
      <table style="width:100%;border-collapse:collapse;background:#1a1a1a;border-radius:8px;">
        ${marketRows}
      </table>
    </div>

    <!-- Key Developments -->
    <div style="margin-bottom:32px;">
      <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Key Developments</p>
      ${developmentsBlock}
    </div>

    <!-- Tactical Insight -->
    <div style="background:#1a1a1a;border-radius:8px;padding:16px;margin-bottom:32px;">
      <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Tactical Insight</p>
      <p style="color:#ffffff;font-weight:600;margin:0 0 8px;">${brief.tacticalInsight.title}</p>
      <p style="color:#9ca3af;margin:0;">${brief.tacticalInsight.body}</p>
    </div>

    <!-- What to Watch -->
    <div style="margin-bottom:32px;">
      <p style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">What to Watch</p>
      ${watchBlock}
    </div>

    <hr style="border:none;border-top:1px solid #1a1a1a;margin-bottom:24px;">
    <p style="color:#6b7280;font-size:12px;text-align:center;margin:0;">Rich with Sophia · Internal Draft Review</p>

  </div>
</body>
</html>
  `.trim();
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

function isSeasonalTip(obj: unknown): obj is SeasonalTip {
  if (typeof obj !== "object" || obj === null) return false;
  const s = obj as Record<string, unknown>;
  return (
    typeof s.tag      === "string" &&
    typeof s.headline === "string" &&
    typeof s.plain    === "string"
  );
}

function validateBriefJSON(obj: unknown): obj is BriefJSON {
  if (typeof obj !== "object" || obj === null) return false;
  const b = obj as Record<string, unknown>;

  // Required string fields
  if (typeof b.mood            !== "string") return false;
  if (typeof b.quotableInsight !== "string") return false;

  // openingSection: object with takeaways array and context string
  if (typeof b.openingSection !== "object" || b.openingSection === null) return false;
  const os = b.openingSection as Record<string, unknown>;
  if (
    !Array.isArray(os.takeaways) ||
    os.takeaways.length < 2 ||
    os.takeaways.length > 3 ||
    !(os.takeaways as unknown[]).every((t) => typeof t === "string")
  ) return false;
  if (typeof os.context !== "string") return false;

  // marketPerformance: exactly 4 valid MarketCards
  if (
    !Array.isArray(b.marketPerformance) ||
    b.marketPerformance.length !== 4 ||
    !(b.marketPerformance as unknown[]).every(isMarketCard)
  ) return false;

  // keyDevelopments: array, 1-3 items
  if (
    !Array.isArray(b.keyDevelopments) ||
    b.keyDevelopments.length < 1 ||
    b.keyDevelopments.length > 3
  ) return false;

  // whatToWatch: array, 2-3 items
  if (
    !Array.isArray(b.whatToWatch) ||
    b.whatToWatch.length < 2 ||
    b.whatToWatch.length > 3
  ) return false;

  // tacticalInsight: object with title and body strings
  if (
    typeof b.tacticalInsight !== "object" ||
    b.tacticalInsight === null ||
    !("title" in (b.tacticalInsight as object)) ||
    !("body"  in (b.tacticalInsight as object))
  ) return false;

  // seasonalTip: optional — if present must be valid shape
  if (b.seasonalTip !== undefined && !isSeasonalTip(b.seasonalTip)) return false;

  return true;
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

// 4. Fetch news headlines (non-blocking — falls back gracefully)
let headlines: NewsHeadline[] = [];
try {
  headlines = await fetchNewsHeadlines();
  console.log(`Fetched ${headlines.length} unique headlines from Marketaux`);
} catch (err) {
  console.warn("Headline fetch failed entirely — proceeding without headlines:", err);
}

const isSlowNewsDay = headlines.length < 3;

    // 5. Call Anthropic API
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicApiKey) {
      console.error("ANTHROPIC_API_KEY env var is not set");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const client = new Anthropic({ apiKey: anthropicApiKey });

    let rawContent: string;
    try {
      const message = await client.messages.create({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 2500,
        system:     SYSTEM_PROMPT,
        messages: [
          {
            role:    "user",
            content: buildUserMessage({
              marketDataString,
              isSlowNewsDay,
              seasonalTopic: null,   // wire up when seasonal calendar is added
              headlines,
            }),
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

    // 6. Parse + validate JSON
    let briefData: BriefJSON;
    try {
      const cleaned = rawContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i,    "")
        .replace(/```\s*$/i,    "")
        .trim();

      const parsed: unknown = JSON.parse(cleaned);

      if (!validateBriefJSON(parsed)) {
        throw new Error("Response is missing required brief fields or shape is malformed");
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

    // 7. Save draft to Redis
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

    let subjectLines: string[] | null = null;
    
    // 8. Generate subject lines (non-blocking — draft already saved)
    try {
      const subjectLineMessage = await client.messages.create({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 250,
        messages: [
          {
            role:    "user",
            content: buildSubjectLinePrompt(JSON.stringify(briefData)),
          },
        ],
      });

      const firstBlock = subjectLineMessage.content[0];
      if (firstBlock.type === "text") {
        const cleaned = firstBlock.text
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i,    "")
          .replace(/```\s*$/i,    "")
          .trim();

        const parsed = JSON.parse(cleaned) as { subjectLines: string[] };

        if (Array.isArray(parsed.subjectLines) && parsed.subjectLines.length === 2) {
          subjectLines = parsed.subjectLines;
          await publishBrief(draftId, { subjectLines });
          console.log("Subject lines saved:", subjectLines);
        }
      }
    } catch (err) {
      // Subject line failure never blocks the brief
      console.warn("Subject line generation failed — brief saved without it:", err);
    }

     
    // 9. Send draft review email (non-blocking)
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      const myEmail      = process.env.MY_EMAIL;
      const fromEmail    = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

      if (!resendApiKey || !myEmail) {
        console.warn("RESEND_API_KEY or MY_EMAIL not set — skipping email");
      } else {
        const resend = new Resend(resendApiKey);

        // Use first subject line if available, fallback to date string
        const emailSubject = subjectLines?.[0] ?? `Rich with Sophia Draft — ${draftId}`;

        const html = buildDraftEmailHtml({
          draftId,
          brief: briefData,
          subjectLines: subjectLines ?? null,
        });

        await resend.emails.send({
          from:    fromEmail,
          to:      myEmail,
          subject: emailSubject,
          html,
        });

        console.log(`Draft review email sent to ${myEmail}`);
      }
    } catch (err) {
      console.warn("Email send failed — brief saved successfully:", err);
    }

    // 10. Return success
      return NextResponse.json({ success: true, draftId });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Unhandled error in generate-brief route:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}