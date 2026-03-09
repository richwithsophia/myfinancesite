import type { Metadata } from "next";
import PageWrapper from "../components/PageWrapper";
import { SectionLabel, Divider, SubscribeForm } from "../components/ui";
import { C } from "@/app/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: "Rich with Sophia is personal finance and market news explained simply — built for anyone who wants to build wealth and become financially independent.",
  openGraph: {
    title: "About | Rich with Sophia",
    description: "Personal finance and market news explained simply for high-earning women.",
    url: "https://myfinancesite.vercel.app/about",
  },
  twitter: {
    title: "About | Rich with Sophia",
    description: "Personal finance and market news explained simply for high-earning women.",
  },
};

export default function AboutPage() {
  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>

          {/* ── HEADER ── */}
          <SectionLabel>About</SectionLabel>
          <h1
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.1,
              marginTop: 0,
              marginBottom: "1.5rem",
              maxWidth: 640,
            }}
          >
            I spent years on Wall Street. Nobody taught me how to manage my own money.
          </h1>

          <Divider my="0" />

          {/* ── STORY ── */}
          <section style={{ maxWidth: 680, marginTop: "2.5rem" }}>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: "1.5rem",
              }}
            >
              I majored in finance, got my MBA, and spent three years as a Wall Street banker. I&apos;ve been investing since 2015. By most measures, I should have had this figured out.
            </p>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: "1.5rem",
              }}
            >
              But here&apos;s what they don&apos;t tell you: finance at the corporate level is completely different from managing your own money. I knew how to model a leveraged buyout. I did not know how to think clearly about my own expenses, investments, or long-term wealth. Nobody teaches that — not in school, not on the job, not really anywhere.
            </p>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: "1.5rem",
              }}
            >
              And the tools that exist? They&apos;re intimidating, jargon-heavy, and built for someone else. Money at the individual and family level is personal. It&apos;s emotional. It&apos;s sometimes irrational. The Bloomberg terminal was never designed for that.
            </p>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              That&apos;s why I built Rich with Sophia.
            </p>
          </section>

          <Divider />

          {/* ── MISSION ── */}
          <section style={{ maxWidth: 680 }}>
            <SectionLabel>The Mission</SectionLabel>
            <h2
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.2,
                marginTop: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Financial independence is for everyone. Nothing is too small to start.
            </h2>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: "1.5rem",
              }}
            >
              Rich with Sophia is for anyone who wants to build wealth and become financially independent — whether you&apos;re just starting out or finally ready to get serious about money you&apos;ve been ignoring.
            </p>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: "1.5rem",
              }}
            >
              I believe financial literacy should be accessible, not gatekept. The markets affect your life whether you follow them or not — your mortgage rate, your 401k, your job security. You deserve to understand what&apos;s happening in plain language, and what it actually means for you.
            </p>
            <p
              style={{
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                lineHeight: 1.9,
                color: C.muted,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              Knowledge is power. I&apos;m here to make it as easy as possible.
            </p>
          </section>

          <Divider />

          {/* ── PULL QUOTE ── */}
          <div
            style={{
              borderLeft: `3px solid ${C.green}`,
              paddingLeft: "1.5rem",
              maxWidth: 600,
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(1.1rem, 2.5vw, 1.35rem)",
                fontWeight: 600,
                fontStyle: "italic",
                color: C.text,
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              &ldquo;The markets affect your life whether you follow them or not. You deserve to understand what&apos;s happening — in plain language, without the Wall Street jargon.&rdquo;
            </p>
            <p
              style={{
                fontSize: "0.825rem",
                fontWeight: 600,
                color: C.green,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginTop: "0.75rem",
                marginBottom: 0,
              }}
            >
              — Sophia
            </p>
          </div>

          {/* ── SUBSCRIBE CTA ── */}
          <div
            style={{
              backgroundColor: C.card,
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: 560,
            }}
          >
            <p
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(1.1rem, 2.5vw, 1.2rem)",
                fontWeight: 600,
                color: C.text,
                marginTop: 0,
                marginBottom: "0.4rem",
              }}
            >
              Start here.
            </p>
            <p
              style={{
                fontSize: "0.875rem",
                color: C.muted,
                lineHeight: 1.7,
                marginTop: 0,
                marginBottom: "1.25rem",
              }}
            >
              Get the Daily Brief in your inbox every weekday morning. Markets explained in under 5 minutes. Free.
            </p>
            <SubscribeForm compact />
          </div>

        </div>
      </main>
    </PageWrapper>
  );
}