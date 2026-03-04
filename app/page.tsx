"use client";

import Nav from "./components/Nav";
import Footer from "./components/Footer";

const C = {
  bg: "#FAFAF7", card: "#F2F0EB", text: "#1A1A1A",
  muted: "#6B6760", green: "#2D6A4F", coral: "#E07A5F",
  border: "#E5E2DC", serif: "'Playfair Display', serif", sans: "'Inter', sans-serif",
};

const featureCards = [
  {
    href: "/daily-brief", emoji: "📰",
    title: "Translated Market News",
    body: "The Fed raised rates. Cool — but what does that actually mean for your mortgage, your 401(k), and your savings account? I break it down in plain English, every single day.",
    link: "Read today's brief →",
  },
  {
    href: "/tools/net-worth", emoji: "📈",
    title: "Weekly Portfolio Check-ins",
    body: "A quick gut-check on your portfolio every week — what's moving, what it means, and whether you actually need to do anything. Spoiler: usually you don't.",
    link: "See this week's check-in →",
  },
  {
    href: "/tools", emoji: "⚡",
    title: "Zero Jargon, All Signal",
    body: "No 'yield curve inversions' without a translation. No CNBC-speak. Just the information that matters for someone earning great money and trying to make it grow.",
    link: "See how it works →",
  },
];

export default function HomePage() {
  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: C.sans, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav />

      <main style={{ flex: 1 }}>

        {/* ── HERO ── */}
        <section style={{ maxWidth: 1152, margin: "0 auto", padding: "9rem 1.5rem 5rem" }}>
          <div style={{ maxWidth: 720 }}>

            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: `${C.green}18`, border: `1px solid ${C.green}30`, color: C.green, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.5rem 1rem", borderRadius: 9999, marginBottom: "1.75rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.green, display: "inline-block" }} className="animate-pulse" />
              Daily market intel
            </div>

            <h1 style={{ fontFamily: C.serif, fontSize: "clamp(2.6rem, 5vw, 4rem)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", color: C.text, marginBottom: "1.25rem" }}>
              Markets explained{" "}
              <span style={{ color: C.green }}>for your</span>{" "}
              real life.
            </h1>

            <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: C.muted, maxWidth: 520, marginBottom: "2.25rem" }}>
              I watch the markets so you don't have to — and I'll tell you exactly
              how it affects your life.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
              <a href="/daily-brief" style={{ backgroundColor: C.coral, color: "#fff", fontWeight: 600, padding: "0.85rem 1.75rem", borderRadius: 9999, textDecoration: "none", fontSize: "1rem" }}>
                Get the Daily Brief →
              </a>
              <span style={{ color: C.muted, fontSize: "0.85rem" }}>Free. No spam. Unsubscribe anytime.</span>
            </div>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              {["📍 Updates for anyone, anywhere", "💼 Corporate, Tech, Finance, Law, Healthcare", "📊 Zero jargon, all signal"].map((item, i) => (
                <span key={i} style={{ fontSize: "0.85rem", color: C.muted }}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ borderTop: `1px solid ${C.border}` }} />
        </div>

        {/* ── FEATURE CARDS ── */}
        <section style={{ maxWidth: 1152, margin: "0 auto", padding: "4rem 1.5rem" }}>
          <p style={{ fontFamily: C.sans, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, marginBottom: "2rem" }}>
            What you get
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {featureCards.map(card => (
              <a key={card.title} href={card.href} style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "2rem", textDecoration: "none", display: "block" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "1.25rem" }}>{card.emoji}</div>
                <h3 style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: C.muted, marginBottom: "1.5rem" }}>
                  {card.body}
                </p>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, color: C.green }}>{card.link}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section style={{ backgroundColor: C.green, padding: "5rem 1.5rem" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontFamily: C.serif, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: C.bg, lineHeight: 1.2, marginBottom: "1rem" }}>
              Stop skipping the financial news.
            </h2>
            <p style={{ color: `${C.bg}99`, fontSize: "1rem", lineHeight: 1.75, marginBottom: "2rem" }}>
              Join thousands of high-earning individuals who get the markets decoded in
              their inbox — every weekday morning, in under 5 minutes.
            </p>
            <a href="/daily-brief" style={{ backgroundColor: C.coral, color: "#fff", fontWeight: 600, padding: "1rem 2rem", borderRadius: 9999, textDecoration: "none", fontSize: "1rem", display: "inline-block" }}>
              Get the Daily Brief →
            </a>
            <p style={{ color: `${C.bg}55`, fontSize: "0.8rem", marginTop: "1rem" }}>Free. No spam. Unsubscribe anytime.</p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}