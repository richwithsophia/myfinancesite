"use client";

import PageWrapper from "../components/PageWrapper";
import { SectionLabel, Divider, SubscribeForm } from "../components/ui";
import { C, labelStyle } from "@/app/lib/brand";
import { type Brief } from "@/app/lib/briefs";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  brief: Brief | null;
  fetchError?: boolean;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatPublishedAt(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─── Empty / error state ───────────────────────────────────────────────────────

function EmptyState({ fetchError }: { fetchError?: boolean }) {
  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
          <SectionLabel pulse>Market Intel</SectionLabel>
          <h1
            style={{
              fontFamily: C.serif,
              fontSize: "clamp(2rem, 5vw, 2.5rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.1,
              marginTop: 0,
              marginBottom: "2rem",
            }}
          >
            Daily Brief
          </h1>
          <Divider my="0" />
          <div
            style={{
              marginTop: "3rem",
              padding: "3rem 2rem",
              backgroundColor: C.card,
              borderRadius: "1rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: C.serif,
                fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
                fontWeight: 600,
                color: C.text,
                marginBottom: "0.5rem",
                marginTop: 0,
              }}
            >
              {fetchError
                ? "Something went wrong loading today's brief."
                : "First brief coming tomorrow morning."}
            </p>
            <p style={{ fontSize: "0.9rem", color: C.muted, marginTop: 0 }}>
              {fetchError
                ? "Please check back in a moment."
                : "Subscribe below so you don't miss it."}
            </p>
          </div>
          <Divider />
          <SubscribeForm compact />
        </div>
      </main>
    </PageWrapper>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function DailyBriefClient({ brief, fetchError }: Props) {
  if (!brief || fetchError) {
    return <EmptyState fetchError={fetchError} />;
  }

  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>

          {/* ── HEADER ── */}
          <div
            className="rws-flex-stack"
            style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}
          >
            <div>
              <SectionLabel pulse>Market Intel</SectionLabel>
              <h1
                style={{
                  fontFamily: C.serif,
                  fontSize: "clamp(2rem, 5vw, 2.5rem)",
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.1,
                  marginTop: 0,
                  marginBottom: 0,
                }}
              >
                Daily Brief
              </h1>
            </div>

            {/* Date + published time badge */}
            <div
              style={{
                backgroundColor: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: "0.875rem",
                padding: "0.625rem 0.875rem",
                alignSelf: "flex-start",
                flexShrink: 0,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: C.text,
                  whiteSpace: "nowrap",
                  margin: 0,
                }}
              >
                {brief.date}
              </p>
              {brief.publishedAt && (
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    color: C.muted,
                    margin: "0.15rem 0 0",
                    whiteSpace: "nowrap",
                  }}
                >
                  Published {formatPublishedAt(brief.publishedAt)}
                </p>
              )}
              <p
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  color: C.green,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  margin: "0.15rem 0 0",
                }}
              >
                Latest
              </p>
            </div>
          </div>

          <Divider my="0" />

          {/* ── EXECUTIVE SUMMARY ── */}
          <section style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
            <p className="rws-label">🎯 Executive Summary</p>
            <div className="rws-card-white">
              <p
                style={{
                  fontFamily: C.serif,
                  fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
                  fontWeight: 600,
                  color: C.text,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {brief.executiveSummary}
              </p>
            </div>
          </section>

          {/* ── TACTICAL INSIGHT ── */}
          <section style={{ marginBottom: "1.5rem" }}>
            <p className="rws-label">💡 Tactical Insight</p>
            <div
              style={{
                backgroundColor: `${C.coral}0f`,
                border: `1px solid ${C.coral}35`,
                borderRadius: "1rem",
                padding: "1.5rem",
              }}
            >
              <p
                style={{
                  fontFamily: C.serif,
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: "0.6rem",
                  marginTop: 0,
                  lineHeight: 1.3,
                }}
              >
                {brief.tacticalInsight.title}
              </p>
              <p
                style={{
                  fontSize: "0.925rem",
                  lineHeight: 1.8,
                  color: C.muted,
                  margin: 0,
                }}
              >
                {brief.tacticalInsight.body}
              </p>
            </div>
          </section>

          {/* ── MARKET PERFORMANCE ── */}
          <section style={{ marginBottom: "2rem" }}>
            <p className="rws-label">📊 Market Performance</p>
            <div className="rws-grid-market">
              {brief.marketPerformance.map((item) => (
                <div
                  key={item.index}
                  style={{ backgroundColor: C.card, borderRadius: "0.875rem", padding: "1rem" }}
                >
                  <p style={{ ...labelStyle, fontSize: "0.62rem", marginBottom: "0.5rem" }}>
                    {item.index}
                  </p>
                  <p
                    style={{
                      fontFamily: C.serif,
                      fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
                      fontWeight: 700,
                      color: item.direction === "up" ? C.red : C.green,
                      margin: 0,
                    }}
                  >
                    {item.change}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: C.muted,
                      marginTop: "0.2rem",
                      marginBottom: 0,
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", color: C.muted, marginTop: "0.6rem", marginBottom: 0 }}>
              * Green = favorable move. Red = unfavorable move. Context matters — a falling yield can be good news.
            </p>
          </section>

          <Divider my="0" />

          {/* ── EDITORIAL SPLIT ── */}
          <div className="rws-editorial" style={{ marginTop: "2rem" }}>

            {/* LEFT — Key Developments */}
            <section>
              <p className="rws-label">🗞️ Key Developments</p>
              {brief.keyDevelopments.map((item, i) => (
                <div
                  key={item.headline}
                  style={
                    i > 0
                      ? { borderTop: `1px solid ${C.border}`, paddingTop: "2rem", marginTop: "2rem" }
                      : {}
                  }
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                    <span>{item.icon}</span>
                    <p style={{ ...labelStyle, margin: 0 }}>{item.tag}</p>
                  </div>
                  <h2
                    style={{
                      fontFamily: C.serif,
                      fontSize: "clamp(1.15rem, 3vw, 1.4rem)",
                      fontWeight: 700,
                      color: C.text,
                      lineHeight: 1.25,
                      marginTop: 0,
                      marginBottom: "0.875rem",
                    }}
                  >
                    {item.headline}
                  </h2>
                  <p
                    style={{
                      fontSize: "clamp(0.9rem, 1.5vw, 0.95rem)",
                      lineHeight: 1.85,
                      color: C.muted,
                      margin: 0,
                    }}
                  >
                    {item.plain}
                  </p>
                </div>
              ))}
            </section>

            {/* RIGHT — Sidebar */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

              {/* What to Watch */}
              <div className="rws-card">
                <p className="rws-label">🔮 What to Watch</p>
                {brief.whatToWatch.map((w, i) => (
                  <div
                    key={w.item}
                    style={
                      i > 0
                        ? { borderTop: `1px solid ${C.border}`, paddingTop: "1.1rem", marginTop: "1.1rem" }
                        : {}
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "flex-start",
                        marginBottom: "0.35rem",
                      }}
                    >
                      <span
                        style={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: "50%",
                          backgroundColor: `${C.green}18`,
                          color: C.green,
                          fontSize: "0.62rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {i + 1}
                      </span>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: C.text,
                          lineHeight: 1.35,
                          margin: 0,
                        }}
                      >
                        {w.item}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "0.825rem",
                        lineHeight: 1.7,
                        color: C.muted,
                        paddingLeft: 28,
                        margin: 0,
                      }}
                    >
                      {w.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Net Worth CTA */}
              <div className="rws-card-white" style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: C.serif,
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: "0.4rem",
                    marginTop: 0,
                  }}
                >
                  Know your number.
                </p>
                <p
                  style={{
                    fontSize: "0.825rem",
                    color: C.muted,
                    lineHeight: 1.65,
                    marginBottom: "1rem",
                    marginTop: 0,
                  }}
                >
                  Days like today are a good reminder to check your net worth. It takes 2 minutes.
                </p>
                <a
                  href="/tools/net-worth"
                  className="rws-btn-secondary"
                  style={{ display: "inline-flex" }}
                >
                  Try the calculator →
                </a>
              </div>

            </aside>
          </div>

          {/* ── SUBSCRIBE CTA ── */}
          <Divider />
          <div
            className="rws-flex-stack"
            style={{ justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div>
              <p
                style={{
                  fontFamily: C.serif,
                  fontSize: "clamp(1.1rem, 2.5vw, 1.2rem)",
                  fontWeight: 600,
                  color: C.text,
                  marginBottom: "0.3rem",
                  marginTop: 0,
                }}
              >
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