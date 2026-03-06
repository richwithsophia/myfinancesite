"use client";

import PageWrapper from "../components/PageWrapper";
import { SectionLabel, PageCard, CtaBand } from "../components/ui";
import { C } from "../lib/brand";

/**
 * To add a new tool: append to this array. Zero other changes needed.
 */
const tools = [
  {
    href: "/tools/net-worth", emoji: "🧮",
    available: true, badge: "Live",
    title: "Net Worth Calculator",
    body: "Add up everything you own and everything you owe. Your net worth updates live as you type — no account needed, no data stored.",
    cta: "Calculate my net worth →",
  },
  {
    href: "#", emoji: "📊",
    available: false, badge: "Coming Soon",
    title: "Investment Growth Calculator",
    body: "See how your money grows over time with compound interest. Plug in your starting amount, monthly contribution, and time horizon.",
    cta: "Notify me →",
  },
  {
    href: "#", emoji: "🎓",
    available: false, badge: "Coming Soon",
    title: "Student Loan Payoff Planner",
    body: "Compare payoff strategies side by side — avalanche vs. snowball — and see exactly how much interest you'll save.",
    cta: "Notify me →",
  },
  {
    href: "#", emoji: "🏠",
    available: false, badge: "Coming Soon",
    title: "Rent vs. Buy Calculator",
    body: "Stop guessing. Enter your market, income, and savings to see whether buying or renting actually makes more financial sense for you.",
    cta: "Notify me →",
  },
];

export default function ToolsPage() {
  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "8rem", paddingBottom: "5rem" }}>

          {/* ── HEADER ── */}
          <div style={{ marginBottom: "3rem" }}>
            <SectionLabel>⚡ Financial Tools</SectionLabel>
            <h1 style={{
              fontFamily: C.serif,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700, color: C.text,
              lineHeight: 1.1, marginTop: 0, marginBottom: "1rem",
            }}>
              Tools that do the <span style={{ color: C.green }}>math for you.</span>
            </h1>
            <p style={{
              fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
              lineHeight: 1.75, color: C.muted,
              maxWidth: 520, marginTop: 0, marginBottom: 0,
            }}>
              Free calculators built for high earners who are too busy to mess around with
              spreadsheets. No sign-up. No data stored. Just answers.
            </p>
          </div>

          {/* ── TOOL CARDS ── */}
          <div className="rws-grid-2" style={{ marginBottom: "3rem" }}>
            {tools.map(tool => (
              <PageCard
                key={tool.title}
                href={tool.href}
                emoji={tool.emoji}
                title={tool.title}
                body={tool.body}
                cta={tool.cta}
                badge={tool.badge}
                disabled={!tool.available}
              />
            ))}
          </div>

          {/* ── BOTTOM CTA ── */}
          <CtaBand
            variant="card"
            headline="Want the full picture?"
            body="The Daily Brief puts all of this in context — market moves, rate changes, and what it actually means for your money."
            cta="Get the Daily Brief →"
            href="/daily-brief"
          />

        </div>
      </main>
    </PageWrapper>
  );
}