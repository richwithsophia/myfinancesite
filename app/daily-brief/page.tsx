"use client";

import Nav from "../components/Nav";

const brief = {
  date: "Tuesday, March 4, 2025",
  label: "MARKET INTEL",
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
      plain: "The U.S. imposed 25% tariffs on most imports from Canada and Mexico. In plain English: goods from our two biggest trading partners just got more expensive. That means higher prices on everything from avocados to car parts — and companies that rely on cross-border supply chains took a hit today.",
    },
    {
      headline: "Tech led the selloff — again",
      icon: "💻",
      plain: "Nvidia dropped 8.7%, Apple fell 3.4%, and Meta slid 4.2%. When big tech sneezes, the Nasdaq catches a cold. If your 401(k) is heavy on a total market or growth fund, you felt this today. It doesn't mean sell — but it's a good reminder to check your allocation.",
    },
    {
      headline: "The bond market is sending a signal",
      icon: "📉",
      plain: "When stocks fall and bond yields also fall (like today), it usually means investors are nervous and parking cash in safer assets. The 10-year Treasury yield dropping to 4.21% suggests the market is starting to price in slower growth — not a crisis, but worth watching.",
    },
  ],
  whatToWatch: [
    {
      item: "Fed Chair Powell speaks Wednesday",
      detail: "Any hint that the Fed is slowing rate cuts because of tariff-driven inflation could move markets sharply. Watch for the words 'patient' and 'data-dependent' — that's Fed-speak for 'we're not cutting anytime soon.'",
    },
    {
      item: "Friday jobs report (NFP)",
      detail: "A strong jobs number could push yields back up and weigh on stocks. A weak number might actually rally the market — because it gives the Fed cover to cut rates. Yes, bad news can be good news in markets. Welcome.",
    },
    {
      item: "Retaliatory tariff announcements",
      detail: "Canada has already signaled counter-tariffs. If Mexico follows, expect another volatile session. Keep an eye on consumer staples stocks — they're the canary in the coal mine for price pressure.",
    },
  ],
  tacticalInsight: {
    title: "Don't touch your long-term investments",
    body: "If your money is in a diversified index fund for a goal that's 5+ years away, today's drop is noise. The S&P 500 has recovered from every single correction in its history. What you should do: check your cash position. If you don't have 3–6 months of expenses in a high-yield savings account (currently paying ~4.5–5%), a volatile market is a great reminder to build that buffer before adding more to investments.",
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/35 mb-3">
      {children}
    </p>
  );
}

export default function DailyBrief() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans">

      <Nav />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">

        {/* ── HEADER ── */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {brief.label}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1a1a1a]">
            Daily Brief
          </h1>
          <p className="text-[#1a1a1a]/40 text-sm mt-2 font-medium">{brief.date}</p>
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