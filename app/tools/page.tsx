"use client";

import Nav from "../components/Nav";

const C = {
  bg: "#FAFAF7", card: "#F2F0EB", text: "#1A1A1A",
  muted: "#6B6760", green: "#2D6A4F", coral: "#E07A5F",
  border: "#E5E2DC", serif: "'Playfair Display', serif", sans: "'Inter', sans-serif",
};
const lbl = { fontFamily: C.sans, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.muted };

const tools = [
  {
    href: "/tools/net-worth", emoji: "🧮", available: true, label: "Live",
    title: "Net Worth Calculator",
    description: "Add up everything you own and everything you owe. Your net worth updates live as you type — no account needed, no data stored.",
    cta: "Calculate my net worth →",
  },
  {
    href: "#", emoji: "📊", available: false, label: "Coming Soon",
    title: "Investment Growth Calculator",
    description: "See how your money grows over time with compound interest. Plug in your starting amount, monthly contribution, and time horizon.",
    cta: "Notify me →",
  },
  {
    href: "#", emoji: "🎓", available: false, label: "Coming Soon",
    title: "Student Loan Payoff Planner",
    description: "Compare payoff strategies side by side — avalanche vs. snowball — and see exactly how much interest you'll save.",
    cta: "Notify me →",
  },
  {
    href: "#", emoji: "🏠", available: false, label: "Coming Soon",
    title: "Rent vs. Buy Calculator",
    description: "Stop guessing. Enter your market, income, and savings to see whether buying or renting actually makes more financial sense for you.",
    cta: "Notify me →",
  },
];

export default function ToolsPage() {
  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: C.sans, minHeight: "100vh" }}>
      <Nav />

      <main style={{ maxWidth: 1152, margin: "0 auto", padding: "8rem 1.5rem 5rem" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: `${C.green}18`, border: `1px solid ${C.green}30`, color: C.green, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0.5rem 1rem", borderRadius: 9999, marginBottom: "1.25rem" }}>
            ⚡ Financial Tools
          </div>
          <h1 style={{ fontFamily: C.serif, fontSize: "clamp(2.2rem, 4vw, 3rem)", fontWeight: 700, color: C.text, lineHeight: 1.1, marginBottom: "1rem" }}>
            Tools that do the{" "}
            <span style={{ color: C.green }}>math for you.</span>
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.75, color: C.muted, maxWidth: 520 }}>
            Free calculators built for high earners who are too busy to mess around with spreadsheets.
            No sign-up. No data stored. Just answers.
          </p>
        </div>

        {/* ── TOOL CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem", marginBottom: "4rem" }}>
          {tools.map(tool => (
            <a key={tool.title} href={tool.available ? tool.href : undefined as any}
              style={{ backgroundColor: C.card, border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "2rem", textDecoration: "none", display: "flex", flexDirection: "column", opacity: tool.available ? 1 : 0.55, cursor: tool.available ? "pointer" : "default" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "1.75rem" }}>{tool.emoji}</div>
                <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: 9999, backgroundColor: tool.available ? `${C.green}18` : `${C.text}0d`, color: tool.available ? C.green : C.muted }}>
                  {tool.label}
                </span>
              </div>
              <h2 style={{ fontFamily: C.serif, fontSize: "1.25rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem" }}>
                {tool.title}
              </h2>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: C.muted, flex: 1, marginBottom: "1.5rem" }}>
                {tool.description}
              </p>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: tool.available ? C.green : C.muted }}>
                {tool.cta}
              </p>
            </a>
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div style={{ backgroundColor: C.green, borderRadius: "1rem", padding: "2.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: C.serif, fontSize: "1.3rem", fontWeight: 600, color: C.bg, marginBottom: "0.4rem" }}>
              Want the full picture?
            </p>
            <p style={{ fontSize: "0.9rem", color: `${C.bg}99`, lineHeight: 1.65, maxWidth: 440 }}>
              The Daily Brief puts all of this in context — market moves, rate changes, and what it actually means for your money.
            </p>
          </div>
          <a href="/daily-brief" style={{ backgroundColor: C.coral, color: "#fff", fontWeight: 600, padding: "0.85rem 1.75rem", borderRadius: 9999, textDecoration: "none", whiteSpace: "nowrap", fontSize: "0.9rem" }}>
            Get the Daily Brief →
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