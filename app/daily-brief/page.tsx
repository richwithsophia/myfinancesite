"use client";

import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { SectionLabel, Divider, SubscribeForm } from "../components/ui";
import { C, labelStyle } from "../lib/brand";

/**
 * Brief data — v1 hardcoded here.
 * v2 migration path: move to app/lib/briefs.ts or fetch from CMS/API.
 * The page component below doesn't care where data comes from.
 */
type Brief = {
  id: string;
  date: string;
  executiveSummary: string;
  marketPerformance: { index: string; value: string; change: string; direction: "up" | "down" }[];
  keyDevelopments: { headline: string; icon: string; tag: string; plain: string }[];
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
      { icon: "🌐", tag: "Trade Policy", headline: "Trade policy uncertainty returns", plain: "Over the weekend, the White House signaled it could move forward with broad tariffs on Canadian and Mexican imports as early as Tuesday. Markets dislike uncertainty more than bad news — which is why even the rumor was enough to move indexes." },
      { icon: "💵", tag: "Currency",     headline: "Dollar strengthens against major currencies", plain: "The U.S. dollar index rose 0.4% to start the week. A stronger dollar sounds good but can hurt U.S. companies that sell abroad — their products get more expensive for foreign buyers. Watch multinational earnings calls for this language." },
      { icon: "🛢️", tag: "Commodities", headline: "Oil slides on demand concerns", plain: "Crude oil fell below $70/barrel as traders worried slower global growth could dent energy demand. Lower oil is good for your gas bill — but signals that big investors are getting cautious about the economy." },
    ],
    whatToWatch: [
      { item: "Tariff announcement timing", detail: "All eyes on whether the White House confirms Tuesday's tariff rollout. A confirmation likely sends markets lower; a delay or softening could trigger a relief rally." },
      { item: "ISM Manufacturing data (Tuesday)", detail: "This monthly survey tells us how factory activity is doing. A number below 50 means contraction — and adds fuel to the slowdown narrative." },
      { item: "Fed speakers this week", detail: "Several Fed officials are scheduled to speak. Any comments linking tariffs to inflation could push rate cut expectations further out." },
    ],
    tacticalInsight: { title: "Uncertainty is not the same as danger.", body: "A −0.5% day on the S&P 500 is noise. The economy is still growing, unemployment is low, and corporate earnings are solid. Stay invested. If you have cash on the sidelines, mild dips like today are historically decent entry points for long-term investors." },
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
      { icon: "🌎", tag: "Trade Policy", headline: "Tariffs on Canada & Mexico took effect", plain: "The U.S. imposed 25% tariffs on most imports from our two biggest trading partners. In plain English: everyday goods just got more expensive to bring into the country. Think avocados, car parts, lumber — and companies that rely on cross-border supply chains took a direct hit." },
      { icon: "💻", tag: "Tech",         headline: "Nvidia dropped 8.7%. Here's why your 401(k) felt it.", plain: "When the biggest stocks in the index fall hard, the whole index falls with them. Nvidia, Apple, and Meta together make up a huge slice of the S&P 500. If your retirement account is in a total market fund — and it probably is — you felt this today. That's normal. Don't touch it." },
      { icon: "📉", tag: "Bonds",        headline: "Bond yields fell. That's the market being nervous.", plain: "When investors get scared, they sell stocks and park cash in bonds. That pushes bond prices up and yields down. The 10-year Treasury dropping to 4.21% tells you one thing: big money is playing defense right now." },
    ],
    whatToWatch: [
      { item: "Fed Chair Powell speaks Wednesday", detail: "Watch for 'patient' and 'data-dependent' — Fed-speak for 'we're not cutting anytime soon.' Any inflation mention tied to tariffs could push rate cut expectations further out." },
      { item: "Friday jobs report (NFP)", detail: "A strong number pushes yields up and weighs on stocks. A weak number might actually rally the market — it gives the Fed cover to cut rates. Yes, bad news can be good news. Welcome to markets." },
      { item: "Retaliatory tariff announcements", detail: "Canada has already signaled counter-tariffs. If Mexico follows, expect another volatile session. Consumer staples are the canary in the coal mine — watch them first." },
    ],
    tacticalInsight: { title: "Don't touch your long-term investments.", body: "If your money is in a diversified index fund for a goal that's 5+ years away, today's drop is noise. The S&P 500 has recovered from every single correction in its history. What you should do: check your cash position. If you don't have 3–6 months of expenses in a high-yield savings account (currently paying ~4.5–5%), build that buffer before adding more to investments." },
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
      { icon: "🏦", tag: "Fed",          headline: "Powell says the Fed is 'in no hurry' to cut rates", plain: "Fed Chair Powell testified before Congress and kept things calm — no surprises, no new signals. He repeated that the Fed wants more data before cutting rates. Translation: don't expect a rate cut in March or May. This is actually fine for long-term investors; it means the Fed isn't panicking either." },
      { icon: "💻", tag: "Tech",         headline: "Tech bounces on dip-buying", plain: "After Tuesday's brutal selloff, some investors stepped in to buy beaten-down tech stocks at a discount. Nvidia recovered 3.1%, Amazon gained 1.8%. This is called a 'relief rally' — it doesn't mean the bottom is in, but it signals that buyers still exist at these prices." },
      { icon: "🍁", tag: "Trade Policy", headline: "Canada announces retaliatory tariffs", plain: "Canada confirmed 25% counter-tariffs on ~$20B of U.S. goods, targeting products like orange juice, peanut butter, and clothing. This trade war is now officially bilateral — expect prices on some everyday goods to creep up over the next few months." },
    ],
    whatToWatch: [
      { item: "Powell's second day of testimony (Thursday)", detail: "He speaks again tomorrow in front of the Senate. If his tone shifts at all — more hawkish or more dovish — markets will react quickly." },
      { item: "Friday jobs report (NFP)", detail: "Consensus estimate is around 160,000 new jobs. A beat likely pushes yields higher; a miss could spark another flight to bonds." },
      { item: "Retail sales data (Thursday)", detail: "Consumer spending is 70% of the U.S. economy — if this comes in weak, it adds to the slowdown narrative that's been building all week." },
    ],
    tacticalInsight: { title: "Green days after selloffs are normal — don't read too much into them.", body: "Today's bounce doesn't erase this week's losses or resolve the tariff uncertainty. The VIX is still elevated above 20, which means the market is still on edge. If you've been meaning to rebalance — checking that your stock/bond split matches your risk tolerance — this kind of volatile period is a good prompt to do that." },
  },
];

export default function DailyBrief() {
  const [idx, setIdx] = useState(ALL_BRIEFS.length - 1);
  const brief    = ALL_BRIEFS[idx];
  const hasPrev  = idx > 0;
  const hasNext  = idx < ALL_BRIEFS.length - 1;
  const isLatest = idx === ALL_BRIEFS.length - 1;

  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>

          {/* ── HEADER + DATE NAV ── */}
          <div className="rws-flex-stack" style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
            <div>
              <SectionLabel pulse>Market Intel</SectionLabel>
              <h1 style={{ fontFamily: C.serif, fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 700, color: C.text, lineHeight: 1.1, marginTop: 0, marginBottom: 0 }}>
                Daily Brief
              </h1>
            </div>

            {/* Date navigator */}
            <div style={{
              backgroundColor: C.white, border: `1px solid ${C.border}`,
              borderRadius: "0.875rem", padding: "0.625rem 0.875rem",
              display: "flex", alignItems: "center", gap: "0.75rem",
              alignSelf: "flex-start", flexShrink: 0,
            }}>
              <button
                onClick={() => hasPrev && setIdx(i => i - 1)}
                disabled={!hasPrev}
                style={{ fontFamily: C.sans, fontSize: "0.825rem", fontWeight: 600, color: hasPrev ? C.text : C.border, background: "none", border: "none", cursor: hasPrev ? "pointer" : "not-allowed", padding: "0 0.25rem", minHeight: 44 }}
                aria-label="Previous brief"
              >←</button>
              <div style={{ textAlign: "center", borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, padding: "0 0.875rem" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: C.text, whiteSpace: "nowrap", margin: 0 }}>{brief.date}</p>
                {isLatest && <p style={{ fontSize: "0.6rem", fontWeight: 700, color: C.green, letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Latest</p>}
              </div>
              <button
                onClick={() => hasNext && setIdx(i => i + 1)}
                disabled={!hasNext}
                style={{ fontFamily: C.sans, fontSize: "0.825rem", fontWeight: 600, color: hasNext ? C.text : C.border, background: "none", border: "none", cursor: hasNext ? "pointer" : "not-allowed", padding: "0 0.25rem", minHeight: 44 }}
                aria-label="Next brief"
              >→</button>
            </div>
          </div>

          <Divider my="0" />

          {/* ── EXECUTIVE SUMMARY ── */}
          <section style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
            <p className="rws-label">🎯 Executive Summary</p>
            <div className="rws-card-white">
              <p style={{ fontFamily: C.serif, fontSize: "clamp(1.05rem, 2vw, 1.25rem)", fontWeight: 600, color: C.text, lineHeight: 1.7, margin: 0 }}>
                {brief.executiveSummary}
              </p>
            </div>
          </section>

          {/* ── TACTICAL INSIGHT ── */}
          <section style={{ marginBottom: "1.5rem" }}>
            <p className="rws-label">💡 Tactical Insight</p>
            <div style={{ backgroundColor: `${C.coral}0f`, border: `1px solid ${C.coral}35`, borderRadius: "1rem", padding: "1.5rem" }}>
              <p style={{ fontFamily: C.serif, fontSize: "clamp(1rem, 2vw, 1.15rem)", fontWeight: 700, color: C.text, marginBottom: "0.6rem", marginTop: 0, lineHeight: 1.3 }}>
                {brief.tacticalInsight.title}
              </p>
              <p style={{ fontSize: "0.925rem", lineHeight: 1.8, color: C.muted, margin: 0 }}>
                {brief.tacticalInsight.body}
              </p>
            </div>
          </section>

          {/* ── MARKET PERFORMANCE ── */}
          <section style={{ marginBottom: "2rem" }}>
            <p className="rws-label">📊 Market Performance</p>
            <div className="rws-grid-market">
              {brief.marketPerformance.map(item => (
                <div key={item.index} style={{ backgroundColor: C.card, borderRadius: "0.875rem", padding: "1rem" }}>
                  <p style={{ ...labelStyle, fontSize: "0.62rem", marginBottom: "0.5rem" }}>{item.index}</p>
                  <p style={{ fontFamily: C.serif, fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 700, color: item.direction === "up" ? C.red : C.green, margin: 0 }}>
                    {item.change}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.2rem", marginBottom: 0 }}>{item.value}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: "0.6rem", marginBottom: 0 }}>
              * Green = favorable move. Red = unfavorable move. Context matters — a falling yield can be good news.
            </p>
          </section>

          <Divider my="0" />

          {/* ── EDITORIAL SPLIT ──
              Mobile:  content first, sidebar below  (readability first)
              Desktop: 2fr content | 1fr sidebar     */}
          <div className="rws-editorial" style={{ marginTop: "2rem" }}>

            {/* LEFT — Key Developments */}
            <section>
              <p className="rws-label">🗞️ Key Developments</p>
              {brief.keyDevelopments.map((item, i) => (
                <div key={item.headline} style={i > 0 ? { borderTop: `1px solid ${C.border}`, paddingTop: "2rem", marginTop: "2rem" } : {}}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                    <span>{item.icon}</span>
                    <p style={{ ...labelStyle, margin: 0 }}>{item.tag}</p>
                  </div>
                  <h2 style={{ fontFamily: C.serif, fontSize: "clamp(1.15rem, 3vw, 1.4rem)", fontWeight: 700, color: C.text, lineHeight: 1.25, marginTop: 0, marginBottom: "0.875rem" }}>
                    {item.headline}
                  </h2>
                  <p style={{ fontSize: "clamp(0.9rem, 1.5vw, 0.95rem)", lineHeight: 1.85, color: C.muted, margin: 0 }}>
                    {item.plain}
                  </p>
                </div>
              ))}
            </section>

            {/* RIGHT — Sidebar (renders below content on mobile) */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* What to Watch */}
              <div className="rws-card">
                <p className="rws-label">🔮 What to Watch</p>
                {brief.whatToWatch.map((w, i) => (
                  <div key={w.item} style={i > 0 ? { borderTop: `1px solid ${C.border}`, paddingTop: "1.1rem", marginTop: "1.1rem" } : {}}>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: "0.35rem" }}>
                      <span style={{ minWidth: 20, height: 20, borderRadius: "50%", backgroundColor: `${C.green}18`, color: C.green, fontSize: "0.62rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        {i + 1}
                      </span>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: C.text, lineHeight: 1.35, margin: 0 }}>{w.item}</p>
                    </div>
                    <p style={{ fontSize: "0.825rem", lineHeight: 1.7, color: C.muted, paddingLeft: 28, margin: 0 }}>{w.detail}</p>
                  </div>
                ))}
              </div>

              {/* Net Worth CTA */}
              <div className="rws-card-white" style={{ textAlign: "center" }}>
                <p style={{ fontFamily: C.serif, fontSize: "1rem", fontWeight: 600, color: C.text, marginBottom: "0.4rem", marginTop: 0 }}>
                  Know your number.
                </p>
                <p style={{ fontSize: "0.825rem", color: C.muted, lineHeight: 1.65, marginBottom: "1rem", marginTop: 0 }}>
                  Days like today are a good reminder to check your net worth. It takes 2 minutes.
                </p>
                <a href="/tools/net-worth" className="rws-btn-secondary" style={{ display: "inline-flex" }}>
                  Try the calculator →
                </a>
              </div>

            </aside>
          </div>

          {/* ── SUBSCRIBE CTA ── */}
          <Divider />
          <div className="rws-flex-stack" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: C.serif, fontSize: "clamp(1.1rem, 2.5vw, 1.2rem)", fontWeight: 600, color: C.text, marginBottom: "0.3rem", marginTop: 0 }}>
                Get this in your inbox.
              </p>
              <p style={{ fontSize: "0.875rem", color: C.muted, marginTop: 0, marginBottom: 0 }}>
                Every weekday morning. Under 5 minutes. Free.
              </p>
            </div>
            <SubscribeForm compact />
          </div>

        </div>
      </main>
    </PageWrapper>
  );
}