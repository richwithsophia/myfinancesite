"use client";

import PageWrapper from "./components/PageWrapper";
import { SectionLabel, CtaBand, PageCard, SubscribeForm } from "./components/ui";
import { C } from "./lib/brand";

const featureCards = [
  {
    href: "/daily-brief", emoji: "📰",
    title: "Translated Market News",
    body: "The Fed raised rates. Cool — but what does that actually mean for your mortgage, your 401(k), and your savings account? I break it down in plain English, every single day.",
    cta: "Read today's brief →",
  },
  {
    href: "/tools/net-worth", emoji: "📈",
    title: "Weekly Portfolio Check-ins",
    body: "A quick gut-check on your portfolio every week — what's moving, what it means, and whether you actually need to do anything. Spoiler: usually you don't.",
    cta: "See this week's check-in →",
  },
  {
    href: "/tools", emoji: "⚡",
    title: "Zero Jargon, All Signal",
    body: "No 'yield curve inversions' without a translation. No CNBC-speak. Just the information that matters for someone earning great money and trying to make it grow.",
    cta: "See how it works →",
  },
];

export default function HomePage() {
  return (
    <PageWrapper>
      <main>

        {/* ── HERO ── */}
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
          <div style={{ maxWidth: 680 }}>

            <SectionLabel pulse>Daily market intel</SectionLabel>

            <h1 style={{
              fontFamily: C.serif,
              fontSize: "clamp(2.4rem, 7vw, 4rem)",
              fontWeight: 700, lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: C.text,
              marginTop: 0, marginBottom: "1.25rem",
            }}>
              Markets explained{" "}
              <span style={{ color: C.green }}>for your</span>{" "}
              real life.
            </h1>

            <p style={{
              fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
              lineHeight: 1.75, color: C.muted,
              maxWidth: 520, marginBottom: "2.5rem", marginTop: 0,
            }}>
              I watch the markets so you don't have to — and I'll tell you exactly
              how it affects your money, your job, and your life.
            </p>

            {/* Subscribe form inline in hero */}
            <div style={{ marginBottom: "3rem" }}>
              <SubscribeForm compact />
            </div>

            {/* Trust strip */}
            <div style={{
              borderTop: `1px solid ${C.border}`,
              paddingTop: "1.75rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem 2rem",
            }}>
              {[
                "📍 Updates for anyone, anywhere",
                "💼 Corporate, Tech, Finance, Law, Healthcare",
                "📊 Zero jargon, all signal",
              ].map((item, i) => (
                <span key={i} style={{ fontSize: "0.85rem", color: C.muted }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Section divider */}
        <div className="rws-container">
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        {/* ── FEATURE CARDS ── */}
        <div className="rws-container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <p className="rws-label">What you get</p>
          <div className="rws-grid-3">
            {featureCards.map(card => (
              <PageCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* ── CTA BAND ── */}
        <CtaBand
          variant="full"
          headline="Stop skipping the financial news."
          body="Join thousands of high-earning individuals who get the markets decoded in their inbox — every weekday morning, in under 5 minutes."
          cta="Get the Daily Brief →"
          href="/daily-brief"
          footnote="Free. No spam. Unsubscribe anytime."
        />

      </main>
    </PageWrapper>
  );
}