"use client";

import { useState } from "react";
import Nav from "../components/Nav";

const C = {
  bg: "#FAFAF7", card: "#F2F0EB", text: "#1A1A1A",
  muted: "#6B6760", green: "#2D6A4F", coral: "#E07A5F",
  red: "#C1440E", border: "#E5E2DC",
  serif: "'Playfair Display', serif", sans: "'Inter', sans-serif",
};
const lbl = { fontFamily: C.sans, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.muted };

type Brief = {
  id: string; date: string;
  executiveSummary: string;
  marketPerformance: { index: string; value: string; change: string; direction: "up"|"down" }[];
  keyDevelopments: { headline: string; icon: string; plain: string }[];
  whatToWatch: { item: string; detail: string }[];
  tacticalInsight: { title: string; body: string };
};

const ALL_BRIEFS: Brief[] = [
  {
    id: "2025-03-03", date: "Monday, March 3, 2025",
    executiveSummary: "Markets kicked off the week on a cautious note as investors digested weekend trade policy signals out of Washington. The S&P 500 dipped modestly while the dollar strengthened — a sign that markets are pricing in tariff risk but not yet panicking.",
    marketPerformance: [
      { index: "S&P 500",              value: "5,618",  change: "−0.50%", direction: "down" },
      { index: "Nasdaq",               value: "17,936", change: "−0.35%", direction: "down" },
      { index: "Dow Jones",            value: "43,840", change: "−0.28%", direction: "down" },
      { index: "10-Yr Treasury Yield", value: "4.29%",  change: "+0.03%", direction: "up"   },
      { index: "VIX (Fear Index)",     value: "19.8",   change: "+1.2",   direction: "up"   },
    ],
    keyDevelopments: [
      { icon: "🌐", headline: "Trade policy uncertainty returns", plain: "Over the weekend, the White House signaled it could move forward with broad tariffs on Canadian and Mexican imports as early as Tuesday. Markets dislike uncertainty more than bad news — which is why even the rumor was enough to move indexes." },
      { icon: "💵", headline: "Dollar strengthens against major currencies", plain: "The U.S. dollar index rose 0.4% to start the week. A stronger dollar sounds good but can hurt U.S. companies that sell abroad — their products get more expensive for foreign buyers. Watch multinational earnings calls for this language." },
      { icon: "🛢️", headline: "Oil slides on demand concerns", plain: "Crude oil fell below $70/barrel as traders worried slower global growth could dent energy demand. Lower oil is good for your gas bill — but signals that big investors are getting cautious about the economy." },
    ],
    whatToWatch: [
      { item: "Tariff announcement timing", detail: "All eyes on whether the White House confirms Tuesday's tariff rollout. A confirmation likely sends markets lower; a delay or softening could trigger a relief rally." },
      { item: "ISM Manufacturing data (Tuesday)", detail: "This monthly survey tells us how factory activity is doing. A number below 50 means contraction — and would add fuel to the slowdown narrative." },
      { item: "Fed speakers this week", detail: "Several Fed officials are scheduled to speak. Any comments linking tariffs to inflation could push rate cut expectations further out." },
    ],
    tacticalInsight: { title: "Uncertainty is not the same as danger", body: "A −0.5% day on the S&P 500 is noise. What matters is whether the underlying trend changes. Right now, the economy is still growing, unemployment is low, and corporate earnings are solid. Stay invested. If you have cash on the sidelines, mild dips like today are historically decent entry points for long-term investors." },
  },
  {
    id: "2025-03-04", date: "Tuesday, March 4, 2025",
    executiveSummary: "Equities slid for a third straight session as fresh tariff headlines rattled investor confidence, pushing the S&P 500 to its lowest close since November. Bond yields fell as money moved into safe havens — a classic 'risk-off' rotation you need to understand.",
    marketPerformance: [
      { index: "S&P 500",              value: "5,521",  change: "−1.76%", direction: "down" },
      { index: "Nasdaq",               value: "17,468", change: "−2.64%", direction: "down" },
      { index: "Dow Jones",            value: "43,191", change: "−1.48%", direction: "down" },
      { index: "10-Yr Treasury Yield", value: "4.21%",  change: "−0.08%", direction: "down" },
      { index: "VIX (Fear Index)",     value: "22.3",   change: "+3.1",   direction: "up"   },
    ],
    keyDevelopments: [
      { icon: "🌎", headline: "New tariffs on Canada & Mexico took effect", plain: "The U.S. imposed 25% tariffs on most imports from Canada and Mexico. In plain English: goods from our two biggest trading partners just got more expensive. Think avocados, car parts, lumber — and companies that rely on cross-border supply chains took a hit." },
      { icon: "💻", headline: "Tech led the selloff — again", plain: "Nvidia dropped 8.7%, Apple fell 3.4%, and Meta slid 4.2%. When big tech sneezes, the Nasdaq catches a cold. If your 401(k) is heavy on a total market or growth fund, you felt this today. It doesn't mean sell — but check your allocation." },
      { icon: "📉", headline: "The bond market is sending a signal", plain: "When stocks fall and bond yields also fall (like today), investors are nervous and parking cash in safer assets. The 10-year Treasury yield dropping to 4.21% suggests the market is starting to price in slower growth." },
    ],
    whatToWatch: [
      { item: "Fed Chair Powell speaks Wednesday", detail: "Watch for 'patient' and 'data-dependent' — Fed-speak for 'we're not cutting anytime soon.' Any inflation mention tied to tariffs could push rate cut expectations further out." },
      { item: "Friday jobs report (NFP)", detail: "A strong number pushes yields up and weighs on stocks. A weak number might actually rally the market — it gives the Fed cover to cut rates. Yes, bad news can be good news in markets. Welcome." },
      { item: "Retaliatory tariff announcements", detail: "Canada has already signaled counter-tariffs. If Mexico follows, expect another volatile session. Keep an eye on consumer staples stocks — they're the canary in the coal mine for price pressure." },
    ],
    tacticalInsight: { title: "Don't touch your long-term investments", body: "If your money is in a diversified index fund for a goal that's 5+ years away, today's drop is noise. The S&P 500 has recovered from every single correction in its history. What you should do: check your cash position. If you don't have 3–6 months of expenses in a high-yield savings account (currently paying ~4.5–5%), a volatile market is a great reminder to build that buffer first." },
  },
  {
    id: "2025-03-05", date: "Wednesday, March 5, 2025",
    executiveSummary: "Markets stabilized after two days of tariff-driven selling as Powell struck a measured tone, reiterating the Fed's data-dependent stance. Stocks closed mixed — tech bounced modestly while financials lagged. No panic, but no all-clear either.",
    marketPerformance: [
      { index: "S&P 500",              value: "5,542",  change: "+0.39%", direction: "up"   },
      { index: "Nasdaq",               value: "17,583", change: "+0.66%", direction: "up"   },
      { index: "Dow Jones",            value: "43,108", change: "−0.19%", direction: "down" },
      { index: "10-Yr Treasury Yield", value: "4.28%",  change: "+0.07%", direction: "up"   },
      { index: "VIX (Fear Index)",     value: "21.1",   change: "−1.2",   direction: "down" },
    ],
    keyDevelopments: [
      { icon: "🏦", headline: "Powell says Fed is 'in no hurry' to cut rates", plain: "Fed Chair Powell testified before Congress and kept things calm — no surprises, no new signals. He repeated that the Fed wants more data before cutting rates. Translation: don't expect a rate cut in March or May. This is actually fine for long-term investors; it means the Fed isn't panicking either." },
      { icon: "💻", headline: "Tech bounces on dip-buying", plain: "After Tuesday's brutal selloff, some investors stepped in to buy beaten-down tech stocks at a discount. Nvidia recovered 3.1%, Amazon gained 1.8%. This is called a 'relief rally' — it doesn't mean the bottom is in, but it signals that buyers still exist at these prices." },
      { icon: "🍁", headline: "Canada announces retaliatory tariffs", plain: "Canada confirmed 25% counter-tariffs on ~$20B of U.S. goods, targeting products like orange juice, peanut butter, and clothing. This trade war is now officially bilateral — expect prices on some everyday goods to creep up over the next few months." },
    ],
    whatToWatch: [
      { item: "Powell's second day of testimony (Thursday)", detail: "He speaks again tomorrow in front of the Senate. If his tone shifts at all — more hawkish or more dovish — markets will react quickly." },
      { item: "Friday jobs report (NFP)", detail: "Still the big event of the week. Consensus estimate is around 160,000 new jobs. A beat likely pushes yields higher; a miss could spark another flight to bonds." },
      { item: "Retail sales data", detail: "Coming Thursday. Consumer spending is 70% of the U.S. economy — if this number comes in weak, it adds to the slowdown narrative that's been building all week." },
    ],
    tacticalInsight: { title: "Green days after selloffs are normal — don't read too much into them", body: "Today's small bounce doesn't erase this week's losses or resolve the tariff uncertainty. The VIX is still elevated above 20, which means the market is still on edge. If you've been meaning to rebalance — checking that your stock/bond split matches your risk tolerance — this kind of volatile period is a good prompt to do that." },
  },
];

export default function DailyBrief() {
  const [idx, setIdx] = useState(ALL_BRIEFS.length - 1);
  const brief   = ALL_BRIEFS[idx];
  const hasPrev = idx > 0;
  const hasNext = idx < ALL_BRIEFS.length - 1;
  const isLatest = idx === ALL_BRIEFS.length - 1;

  const Divider = () => <div style={{ borderTop: `1px solid ${C.border}`, margin: "2.5rem 0" }} />;

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: C.sans, minHeight: "100vh" }}>
      <Nav />

      <main style={{ maxWidth: 768, margin: "0 auto", padding: "8rem 1.5rem 5rem" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: `${C.green}18`, border: `1px solid ${C.green}30`, color: C.green, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.5rem 1rem", borderRadius: 9999, marginBottom: "1.25rem" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.green, display: "inline-block" }} className="animate-pulse" />
            Market Intel
          </div>
          <h1 style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 700, color: C.text, lineHeight: 1.1, marginBottom: "0.25rem" }}>
            Daily Brief
          </h1>
        </div>

        {/* ── DATE NAV ── */}
        <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <button onClick={() => hasPrev && setIdx(i => i - 1)} disabled={!hasPrev}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", fontWeight: 600, color: hasPrev ? C.text : C.border, background: "none", border: "none", cursor: hasPrev ? "pointer" : "not-allowed", fontFamily: C.sans }}>
            ← {hasPrev ? ALL_BRIEFS[idx-1].date.split(",")[0] : "No earlier brief"}
          </button>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: C.text }}>{brief.date}</p>
            {isLatest && <p style={{ fontSize: "0.65rem", fontWeight: 700, color: C.green, letterSpacing: "0.06em", textTransform: "uppercase" }}>Latest</p>}
          </div>
          <button onClick={() => hasNext && setIdx(i => i + 1)} disabled={!hasNext}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.875rem", fontWeight: 600, color: hasNext ? C.text : C.border, background: "none", border: "none", cursor: hasNext ? "pointer" : "not-allowed", fontFamily: C.sans }}>
            {hasNext ? ALL_BRIEFS[idx+1].date.split(",")[0] : "No later brief"} →
          </button>
        </div>

        <Divider />

        {/* ── EXECUTIVE SUMMARY ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, marginBottom: "0.875rem" }}>🎯 Executive Summary</p>
          <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.75rem" }}>
            <p style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 600, color: C.text, lineHeight: 1.6 }}>
              {brief.executiveSummary}
            </p>
          </div>
        </section>

        {/* ── MARKET PERFORMANCE ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, marginBottom: "0.875rem" }}>📊 Market Performance</p>
          <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", overflow: "hidden" }}>
            {brief.marketPerformance.map((item, i) => (
              <div key={item.index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.5rem", borderBottom: i < brief.marketPerformance.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: C.text }}>{item.index}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.875rem", color: C.muted }}>{item.value}</span>
                  <span style={{ fontFamily: C.serif, fontSize: "0.9rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "0.5rem", backgroundColor: item.direction === "up" ? `${C.red}12` : `${C.green}12`, color: item.direction === "up" ? C.red : C.green }}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.5rem" }}>
            * Green = favorable move. Red = unfavorable move. Context matters.
          </p>
        </section>

        {/* ── KEY DEVELOPMENTS ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, marginBottom: "0.875rem" }}>🗞️ Key Developments</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {brief.keyDevelopments.map(item => (
              <div key={item.headline} style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  <h3 style={{ fontFamily: C.serif, fontSize: "1.05rem", fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{item.headline}</h3>
                </div>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: C.muted, paddingLeft: "1.9rem" }}>{item.plain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT TO WATCH ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, marginBottom: "0.875rem" }}>🔮 What to Watch (Next 24–48 Hours)</p>
          <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", overflow: "hidden" }}>
            {brief.whatToWatch.map((item, i) => (
              <div key={item.item} style={{ padding: "1.25rem 1.5rem", borderBottom: i < brief.whatToWatch.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ minWidth: 22, height: 22, borderRadius: "50%", backgroundColor: `${C.green}18`, color: C.green, fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {i + 1}
                  </span>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, color: C.text, marginBottom: "0.35rem" }}>{item.item}</p>
                    <p style={{ fontSize: "0.875rem", lineHeight: 1.7, color: C.muted }}>{item.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TACTICAL INSIGHT ── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <p style={{ ...lbl, marginBottom: "0.875rem" }}>💡 Tactical Insight</p>
          <div style={{ backgroundColor: `${C.coral}0f`, border: `1px solid ${C.coral}30`, borderRadius: "1rem", padding: "1.75rem" }}>
            <p style={{ fontFamily: C.serif, fontSize: "1.15rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
              {brief.tacticalInsight.title}
            </p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: C.muted }}>
              {brief.tacticalInsight.body}
            </p>
          </div>
        </section>

        {/* ── BOTTOM DATE NAV ── */}
        <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <button onClick={() => hasPrev && setIdx(i => i - 1)} disabled={!hasPrev}
            style={{ fontSize: "0.875rem", fontWeight: 600, color: hasPrev ? C.text : C.border, background: "none", border: "none", cursor: hasPrev ? "pointer" : "not-allowed", fontFamily: C.sans }}>
            ← {hasPrev ? ALL_BRIEFS[idx-1].date.split(",")[0] : "No earlier brief"}
          </button>
          <span style={{ fontSize: "0.75rem", color: C.muted }}>{idx + 1} of {ALL_BRIEFS.length}</span>
          <button onClick={() => hasNext && setIdx(i => i + 1)} disabled={!hasNext}
            style={{ fontSize: "0.875rem", fontWeight: 600, color: hasNext ? C.text : C.border, background: "none", border: "none", cursor: hasNext ? "pointer" : "not-allowed", fontFamily: C.sans }}>
            {hasNext ? ALL_BRIEFS[idx+1].date.split(",")[0] : "No later brief"} →
          </button>
        </div>

        {/* ── SUBSCRIBE CTA ── */}
        <div style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "2rem", textAlign: "center" }}>
          <p style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 600, color: C.text, marginBottom: "0.5rem" }}>Get this in your inbox</p>
          <p style={{ fontSize: "0.875rem", color: C.muted, marginBottom: "1.25rem" }}>Every weekday morning. Under 5 minutes. Free.</p>
          <a href="#" style={{ backgroundColor: C.coral, color: "#fff", fontWeight: 600, padding: "0.75rem 1.75rem", borderRadius: 9999, textDecoration: "none", fontSize: "0.9rem", display: "inline-block" }}>
            Subscribe to the Daily Brief →
          </a>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "2.5rem 1.5rem", fontFamily: C.sans }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <span style={{ fontFamily: C.serif, fontWeight: 700, color: C.muted }}>Rich <span style={{ color: C.green }}>with Sophia</span></span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[["Home","/"],["Daily Brief","/daily-brief"],["Tools","/tools"],["About","/about"]].map(([l,h]) => (
              <a key={l} href={h} style={{ color: C.muted, fontSize: "0.875rem", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <a href="#" style={{ color: C.muted, fontSize: "0.82rem", textDecoration: "underline" }}>Unsubscribe anytime</a>
        </div>
      </footer>
    </div>
  );
}