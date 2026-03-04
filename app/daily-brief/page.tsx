"use client";

import { useState } from "react";
import Nav from "../components/Nav";

/* ── Types ── */
type MarketItem  = { index: string; value: string; change: string; direction: "up" | "down" };
type Development = { headline: string; icon: string; plain: string };
type WatchItem   = { item: string; detail: string };
type Brief = {
  id:               string;
  date:             string;
  executiveSummary: string;
  marketPerformance: MarketItem[];
  keyDevelopments:  Development[];
  whatToWatch:      WatchItem[];
  tacticalInsight:  { title: string; body: string };
};

/* ── Sample briefs — newest last so index 0 = oldest ── */
const ALL_BRIEFS: Brief[] = [
  {
    id:   "2025-03-02",
    date: "Monday, March 3, 2025",
    executiveSummary:
      "Markets kicked off the week on a cautious note as investors digested weekend trade policy signals out of Washington. The S&P 500 dipped modestly while the dollar strengthened — a sign that markets are pricing in tariff risk but not yet panicking.",
    marketPerformance: [
      { index: "S&P 500",              value: "5,618",  change: "-0.50%", direction: "down" },
      { index: "Nasdaq",               value: "17,936", change: "-0.35%", direction: "down" },
      { index: "Dow Jones",            value: "43,840", change: "-0.28%", direction: "down" },
      { index: "10-Yr Treasury Yield", value: "4.29%",  change: "+0.03%", direction: "up"   },
      { index: "VIX (Fear Index)",     value: "19.8",   change: "+1.2",   direction: "up"   },
    ],
    keyDevelopments: [
      {
        headline: "Trade policy uncertainty returns",
        icon: "🌐",
        plain:
          "Over the weekend, the White House signaled it could move forward with broad tariffs on Canadian and Mexican imports as early as Tuesday. Markets dislike uncertainty more than they dislike bad news — which is why even the rumor was enough to move indexes.",
      },
      {
        headline: "Dollar strengthens against major currencies",
        icon: "💵",
        plain:
          "The U.S. dollar index (DXY) rose 0.4% to start the week. A stronger dollar sounds good but can actually hurt U.S. companies that sell abroad — their products get more expensive for foreign buyers. Watch multinational earnings calls for this language.",
      },
      {
        headline: "Oil slides on demand concerns",
        icon: "🛢️",
        plain:
          "Crude oil fell below $70/barrel as traders worried slower global growth could dent energy demand. Lower oil is good for your gas bill — but signals that big investors are getting cautious about the economy.",
      },
    ],
    whatToWatch: [
      { item: "Tariff announcement timing", detail: "All eyes on whether the White House confirms Tuesday's tariff rollout. A confirmation likely sends markets lower; a delay or softening could trigger a relief rally." },
      { item: "ISM Manufacturing data (Tuesday)", detail: "This monthly survey tells us how factory activity is doing. A number below 50 means contraction — and would add fuel to the slowdown narrative." },
      { item: "Fed speakers this week", detail: "Several Fed officials are scheduled to speak. Any comments linking tariffs to inflation could push rate cut expectations further out." },
    ],
    tacticalInsight: {
      title: "Uncertainty is not the same as danger",
      body:  "A -0.5% day on the S&P 500 is noise. What matters is whether the underlying trend changes. Right now, the economy is still growing, unemployment is low, and corporate earnings are solid. Stay invested. If you have cash on the sidelines, mild dips like today are historically decent entry points for long-term investors.",
    },
  },
  {
    id:   "2025-03-04",
    date: "Tuesday, March 4, 2025",
    executiveSummary:
      "Equities slid for a third straight session as fresh tariff headlines rattled investor confidence, pushing the S&P 500 to its lowest close since November. Bond yields fell as money moved into safe havens — a classic 'risk-off' rotation you need to understand.",
    marketPerformance: [
      { index: "S&P 500",              value: "5,521",  change: "-1.76%", direction: "down" },
      { index: "Nasdaq",               value: "17,468", change: "-2.64%", direction: "down" },
      { index: "Dow Jones",            value: "43,191", change: "-1.48%", direction: "down" },
      { index: "10-Yr Treasury Yield", value: "4.21%",  change: "-0.08%", direction: "down" },
      { index: "VIX (Fear Index)",     value: "22.3",   change: "+3.1",   direction: "up"   },
    ],
    keyDevelopments: [
      {
        headline: "New tariffs on Canada & Mexico took effect",
        icon: "🌎",
        plain:
          "The U.S. imposed 25% tariffs on most imports from Canada and Mexico. In plain English: goods from our two biggest trading partners just got more expensive. That means higher prices on everything from avocados to car parts — and companies that rely on cross-border supply chains took a hit today.",
      },
      {
        headline: "Tech led the selloff — again",
        icon: "💻",
        plain:
          "Nvidia dropped 8.7%, Apple fell 3.4%, and Meta slid 4.2%. When big tech sneezes, the Nasdaq catches a cold. If your 401(k) is heavy on a total market or growth fund, you felt this today. It doesn't mean sell — but it's a good reminder to check your allocation.",
      },
      {
        headline: "The bond market is sending a signal",
        icon: "📉",
        plain:
          "When stocks fall and bond yields also fall (like today), it usually means investors are nervous and parking cash in safer assets. The 10-year Treasury yield dropping to 4.21% suggests the market is starting to price in slower growth — not a crisis, but worth watching.",
      },
    ],
    whatToWatch: [
      { item: "Fed Chair Powell speaks Wednesday", detail: "Any hint that the Fed is slowing rate cuts because of tariff-driven inflation could move markets sharply. Watch for the words 'patient' and 'data-dependent' — that's Fed-speak for 'we're not cutting anytime soon.'" },
      { item: "Friday jobs report (NFP)",          detail: "A strong jobs number could push yields back up and weigh on stocks. A weak number might actually rally the market — because it gives the Fed cover to cut rates. Yes, bad news can be good news in markets. Welcome." },
      { item: "Retaliatory tariff announcements",  detail: "Canada has already signaled counter-tariffs. If Mexico follows, expect another volatile session. Keep an eye on consumer staples stocks — they're the canary in the coal mine for price pressure." },
    ],
    tacticalInsight: {
      title: "Don't touch your long-term investments",
      body:  "If your money is in a diversified index fund for a goal that's 5+ years away, today's drop is noise. The S&P 500 has recovered from every single correction in its history. What you should do: check your cash position. If you don't have 3–6 months of expenses in a high-yield savings account (currently paying ~4.5–5%), a volatile market is a great reminder to build that buffer before adding more to investments.",
    },
  },
  {
    id:   "2025-03-05",
    date: "Wednesday, March 5, 2025",
    executiveSummary:
      "Markets stabilized after two days of tariff-driven selling as Powell struck a measured tone, reiterating the Fed's data-dependent stance. Stocks closed mixed — tech bounced modestly while financials lagged. No panic, but no all-clear either.",
    marketPerformance: [
      { index: "S&P 500",              value: "5,542",  change: "+0.39%", direction: "up"   },
      { index: "Nasdaq",               value: "17,583", change: "+0.66%", direction: "up"   },
      { index: "Dow Jones",            value: "43,108", change: "-0.19%", direction: "down" },
      { index: "10-Yr Treasury Yield", value: "4.28%",  change: "+0.07%", direction: "up"   },
      { index: "VIX (Fear Index)",     value: "21.1",   change: "-1.2",   direction: "down" },
    ],
    keyDevelopments: [
      {
        headline: "Powell says Fed is 'in no hurry' to cut rates",
        icon: "🏦",
        plain:
          "Fed Chair Powell testified before Congress today and kept things calm — no surprises, no new signals. He repeated that the Fed wants more data before cutting rates. Translation: don't expect a rate cut in March or May. This is actually fine for long-term investors; it means the Fed isn't panicking either.",
      },
      {
        headline: "Tech bounces on dip-buying",
        icon: "💻",
        plain:
          "After Tuesday's brutal selloff, some investors stepped in to buy beaten-down tech stocks at a discount. Nvidia recovered 3.1%, Amazon gained 1.8%. This is called a 'relief rally' — it doesn't mean the bottom is in, but it does signal that buyers still exist at these prices.",
      },
      {
        headline: "Canada announces retaliatory tariffs",
        icon: "🍁",
        plain:
          "Canada confirmed 25% counter-tariffs on ~$20B of U.S. goods, targeting products like orange juice, peanut butter, and clothing. This trade war is now officially bilateral — expect prices on some everyday goods to creep up over the next few months.",
      },
    ],
    whatToWatch: [
      { item: "Powell's second day of testimony (Thursday)", detail: "He speaks again tomorrow in front of the Senate. If his tone shifts at all — more hawkish or more dovish — markets will react quickly." },
      { item: "Friday jobs report (NFP)", detail: "Still the big event of the week. Consensus estimate is around 160,000 new jobs. A beat likely pushes yields higher; a miss could spark another flight to bonds." },
      { item: "Retail sales data", detail: "Coming Thursday. Consumer spending is 70% of the U.S. economy — if this number comes in weak, it adds to the slowdown narrative that's been building all week." },
    ],
    tacticalInsight: {
      title: "Green days after selloffs are normal — don't read too much into them",
      body:  "Today's small bounce doesn't erase this week's losses or resolve the tariff uncertainty. The VIX is still elevated above 20, which means the market is still on edge. If you're a long-term investor, nothing has changed. If you've been meaning to rebalance your portfolio — checking that your stock/bond split still matches your risk tolerance — this kind of volatile period is a good prompt to do that.",
    },
  },
];

/* ── Section label ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/35 mb-3">
      {children}
    </p>
  );
}

/* ── Main page ── */
export default function DailyBrief() {
  const [idx, setIdx] = useState(ALL_BRIEFS.length - 1); // start on newest
  const brief    = ALL_BRIEFS[idx];
  const hasPrev  = idx > 0;
  const hasNext  = idx < ALL_BRIEFS.length - 1;
  const isLatest = idx === ALL_BRIEFS.length - 1;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans">
      <Nav />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* ── HEADER ── */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            MARKET INTEL
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1a1a1a]">
            Daily Brief
          </h1>
        </div>

        {/* ── DATE NAV BAR ── */}
        <div className="bg-white border border-[#1a1a1a]/5 rounded-2xl px-5 py-3 flex items-center justify-between mb-8">
          {/* Prev */}
          <button
            onClick={() => hasPrev && setIdx(i => i - 1)}
            disabled={!hasPrev}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              hasPrev ? "text-[#1a1a1a] hover:text-emerald-600" : "text-[#1a1a1a]/20 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {hasPrev ? ALL_BRIEFS[idx - 1].date.split(",")[0] : "No earlier brief"}
          </button>

          {/* Current date + latest badge */}
          <div className="text-center">
            <p className="text-sm font-bold text-[#1a1a1a]">{brief.date}</p>
            {isLatest && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                Latest
              </span>
            )}
          </div>

          {/* Next */}
          <button
            onClick={() => hasNext && setIdx(i => i + 1)}
            disabled={!hasNext}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              hasNext ? "text-[#1a1a1a] hover:text-emerald-600" : "text-[#1a1a1a]/20 cursor-not-allowed"
            }`}
          >
            {hasNext ? ALL_BRIEFS[idx + 1].date.split(",")[0] : "No later brief"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="border-t border-[#1a1a1a]/5 mb-10" />

        {/* ── EXECUTIVE SUMMARY ── */}
        <section className="mb-10">
          <SectionLabel>🎯 Executive Summary</SectionLabel>
          <div className="bg-white border border-[#1a1a1a]/5 rounded-2xl p-6">
            <p className="text-[#1a1a1a] text-base md:text-lg font-semibold leading-relaxed">
              {brief.executiveSummary}
            </p>
          </div>
        </section>

        {/* ── MARKET PERFORMANCE ── */}
        <section className="mb-10">
          <SectionLabel>📊 Market Performance</SectionLabel>
          <div className="bg-white border border-[#1a1a1a]/5 rounded-2xl overflow-hidden">
            {brief.marketPerformance.map((item, i) => (
              <div
                key={item.index}
                className={`flex items-center justify-between px-6 py-4 ${i !== brief.marketPerformance.length - 1 ? "border-b border-[#1a1a1a]/5" : ""}`}
              >
                <span className="text-sm font-semibold text-[#1a1a1a]">{item.index}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#1a1a1a]/50">{item.value}</span>
                  <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${item.direction === "up" ? "text-red-600 bg-red-50" : "text-emerald-600 bg-emerald-50"}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#1a1a1a]/30 text-xs mt-2 pl-1">
            * Green = down for yields/VIX (good). Red = up for VIX (caution).
          </p>
        </section>

        {/* ── KEY DEVELOPMENTS ── */}
        <section className="mb-10">
          <SectionLabel>🗞️ Key Developments</SectionLabel>
          <div className="flex flex-col gap-4">
            {brief.keyDevelopments.map((item) => (
              <div key={item.headline} className="bg-white border border-[#1a1a1a]/5 rounded-2xl p-6 hover:border-emerald-200 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-xl">{item.icon}</span>
                  <h3 className="text-sm font-bold text-[#1a1a1a] leading-snug">{item.headline}</h3>
                </div>
                <p className="text-[#1a1a1a]/55 text-sm leading-relaxed pl-8">{item.plain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT TO WATCH ── */}
        <section className="mb-10">
          <SectionLabel>🔮 What to Watch (Next 24–48 Hours)</SectionLabel>
          <div className="bg-white border border-[#1a1a1a]/5 rounded-2xl overflow-hidden">
            {brief.whatToWatch.map((item, i) => (
              <div key={item.item} className={`px-6 py-5 ${i !== brief.whatToWatch.length - 1 ? "border-b border-[#1a1a1a]/5" : ""}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1a1a1a] mb-1">{item.item}</p>
                    <p className="text-[#1a1a1a]/50 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TACTICAL INSIGHT ── */}
        <section className="mb-12">
          <SectionLabel>💡 Tactical Insight</SectionLabel>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h3 className="text-base font-bold text-emerald-800 mb-2">{brief.tacticalInsight.title}</h3>
            <p className="text-emerald-900/70 text-sm leading-relaxed">{brief.tacticalInsight.body}</p>
          </div>
        </section>

        {/* ── BOTTOM NAV (repeat for easy access after reading) ── */}
        <div className="bg-white border border-[#1a1a1a]/5 rounded-2xl px-5 py-3 flex items-center justify-between mb-10">
          <button
            onClick={() => hasPrev && setIdx(i => i - 1)}
            disabled={!hasPrev}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              hasPrev ? "text-[#1a1a1a] hover:text-emerald-600" : "text-[#1a1a1a]/20 cursor-not-allowed"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {hasPrev ? "← " + ALL_BRIEFS[idx - 1].date.split(",")[0] : "No earlier brief"}
          </button>
          <span className="text-xs text-[#1a1a1a]/30 font-medium">{idx + 1} of {ALL_BRIEFS.length}</span>
          <button
            onClick={() => hasNext && setIdx(i => i + 1)}
            disabled={!hasNext}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              hasNext ? "text-[#1a1a1a] hover:text-emerald-600" : "text-[#1a1a1a]/20 cursor-not-allowed"
            }`}
          >
            {hasNext ? ALL_BRIEFS[idx + 1].date.split(",")[0] + " →" : "No later brief"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── SUBSCRIBE CTA ── */}
        <div className="bg-white border border-[#1a1a1a]/5 rounded-2xl p-8 text-center">
          <p className="text-base font-bold text-[#1a1a1a] mb-1">Get this in your inbox</p>
          <p className="text-[#1a1a1a]/40 text-sm mb-5">Every weekday morning. Under 5 minutes. Free.</p>
          <a href="#" className="inline-block bg-[#1a1a1a] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-emerald-700 transition-colors">
            Subscribe to the Daily Brief →
          </a>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#1a1a1a]/30 text-sm border-t border-[#1a1a1a]/5">
        <span className="font-bold text-[#1a1a1a]/60">
          Rich <span className="text-emerald-600">with Sophia</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="/"            className="hover:text-[#1a1a1a] transition-colors">Home</a>
          <a href="/daily-brief" className="hover:text-[#1a1a1a] transition-colors">Daily Brief</a>
          <a href="/tools"       className="hover:text-[#1a1a1a] transition-colors">Tools</a>
          <a href="/about"       className="hover:text-[#1a1a1a] transition-colors">About</a>
        </div>
        <a href="#" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">
          Unsubscribe anytime
        </a>
      </footer>
    </div>
  );
}