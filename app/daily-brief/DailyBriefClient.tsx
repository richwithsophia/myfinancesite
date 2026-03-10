"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/daily-brief/DailyBriefClient.tsx
//
// Client component — renders the full daily brief UI.
//
// Responsibilities:
//   1. Renders the complete brief in this order:
//      Mood → Today in 60 Seconds → Quotable Insight → Market Performance
//      → Key Developments + Sidebar → Subscribe CTA → Prev/Next Nav
//   2. Handles empty/error state when no published brief exists
//   3. Renders prev/next navigation so readers can browse all published briefs
//   4. Manages current brief index in local state — no additional API calls
//
// Navigation: allBriefs is sorted newest-first. "Newer" moves toward index 0,
// "Older" moves toward the end of the array.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import { SectionLabel, Divider, SubscribeForm } from "../components/ui";
import { C, labelStyle } from "@/app/lib/brand";
import { type Brief } from "@/app/lib/briefs";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  brief: Brief | null;
  allBriefs?: Brief[];
  fetchError?: boolean;
  initialIndex?: number;
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

function formatBriefDate(dateStr: string, options: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", options);
  } catch {
    return dateStr;
  }
}

// ─── Mood config ───────────────────────────────────────────────────────────────

function getMoodColor(mood: string): string {
  const m = mood.toLowerCase();
  if (["nervous", "volatile", "fearful", "stressed"].includes(m)) return "#ef4444";
  if (["cautious", "mixed", "uncertain", "uneasy"].includes(m))   return "#f59e0b";
  if (["steady", "optimistic", "calm", "bullish"].includes(m))    return "#22c55e";
  return "#6b7280";
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

export default function DailyBriefClient({ brief, allBriefs = [], fetchError, initialIndex = 0 }: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const activeBrief = allBriefs.length > 0 ? allBriefs[currentIndex] : brief;
  const hasPrev     = currentIndex < allBriefs.length - 1;
  const hasNext     = currentIndex > 0;

  if (!activeBrief || fetchError) {
    return <EmptyState fetchError={fetchError} />;
  }

  const brief2    = activeBrief;
  const moodColor = getMoodColor(brief2.mood ?? "");

  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>

          {/* ── HEADER ── */}
          <div
            className="rws-flex-stack"
            style={{ justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}
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
                {formatBriefDate(brief2.date, { month: "long", day: "numeric", year: "numeric" })}
              </p>
              {brief2.publishedAt && (
                <p
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 500,
                    color: C.muted,
                    margin: "0.15rem 0 0",
                    whiteSpace: "nowrap",
                  }}
                >
                  Published {formatPublishedAt(brief2.publishedAt)}
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
                {currentIndex === 0 ? "Latest" : "Archive"}
              </p>
            </div>
          </div>

          {/* ── MOOD INDICATOR ── */}
          {brief2.mood && (
            <div style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  backgroundColor: `${moodColor}15`,
                  border: `1px solid ${moodColor}40`,
                  borderRadius: "9999px",
                  padding: "0.35rem 0.875rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: moodColor,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: moodColor,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {brief2.mood}
              </span>
            </div>
          )}

          <Divider my="0" />

          {/* ════════════════════════════════════════
              TODAY IN 60 SECONDS
              ════════════════════════════════════════ */}

          {(brief2.openingSection || (brief2 as any).keyTakeaways) && (
            <section style={{ marginTop: "2rem", marginBottom: "1.5rem" }}>
              <p className="rws-label">⚡ Today in 60 Seconds</p>
              <div
                style={{
                  backgroundColor: C.card,
                  borderRadius: "1rem",
                  padding: "1.25rem 1.5rem",
                }}
              >
                {/* Takeaways */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.875rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {(brief2.openingSection?.takeaways ?? (brief2 as any).keyTakeaways ?? []).map((takeaway: string, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        ...(i > 0 && {
                          borderTop: `1px solid ${C.border}`,
                          paddingTop: "0.875rem",
                        }),
                      }}
                    >
                      <span
                        style={{
                          minWidth: 22,
                          height: 22,
                          borderRadius: "50%",
                          backgroundColor: `${C.green}18`,
                          color: C.green,
                          fontSize: "0.65rem",
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
                          fontSize: "clamp(0.875rem, 1.5vw, 0.925rem)",
                          fontWeight: 500,
                          color: C.text,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {takeaway}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Context paragraph */}
                <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1.25rem" }}>
                  <p
                    style={{
                      fontSize: "clamp(0.875rem, 1.5vw, 0.925rem)",
                      lineHeight: 1.8,
                      color: C.muted,
                      margin: 0,
                    }}
                  >
                    {brief2.openingSection?.context ?? (brief2 as any).executiveSummary ?? ""}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ── QUOTABLE INSIGHT ── */}
          {brief2.quotableInsight && (
            <section style={{ marginBottom: "1rem" }}>
              <div style={{ borderLeft: `3px solid ${C.green}`, paddingLeft: "1.25rem" }}>
                <p
                  style={{
                    fontFamily: C.serif,
                    fontSize: "clamp(1rem, 2vw, 1.15rem)",
                    fontWeight: 600,
                    fontStyle: "italic",
                    color: C.text,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  &ldquo;{brief2.quotableInsight}&rdquo;
                </p>
              </div>
            </section>
          )}

          <Divider my="0.5rem" />

          {/* ════════════════════════════════════════
              MARKET PERFORMANCE
              ════════════════════════════════════════ */}

          {Array.isArray(brief2.marketPerformance) && brief2.marketPerformance.length > 0 && (
            <section style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <p className="rws-label">📊 Market Performance</p>
              <div className="rws-grid-market">
                {brief2.marketPerformance.map((item) => (
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
                        color: item.direction === "up" ? "#22c55e" : "#ef4444",
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
                * Green = up. Red = down. Context matters — a falling Treasury yield can be good news for your mortgage rate.
              </p>
            </section>
          )}

          <Divider my="0" />

                    {/* ════════════════════════════════════════
              EDITORIAL SPLIT
              ════════════════════════════════════════ */}

          <div className="rws-editorial" style={{ marginTop: "2rem" }}>

            {/* LEFT — Key Developments */}
            <section>
              <p className="rws-label">🗞️ Key Developments</p>
              {(brief2.keyDevelopments ?? []).map((item, i) => (
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

              {/* Tactical Insight */}
              {brief2.tacticalInsight && (
                <div
                  style={{
                    backgroundColor: `${C.coral}0f`,
                    border: `1px solid ${C.coral}35`,
                    borderRadius: "1rem",
                    padding: "1.5rem",
                  }}
                >
                  <p className="rws-label">💡 Tactical Insight</p>
                  <p
                    style={{
                      fontFamily: C.serif,
                      fontSize: "clamp(1rem, 2vw, 1.1rem)",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "0.6rem",
                      marginTop: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {brief2.tacticalInsight.title}
                  </p>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.8,
                      color: C.muted,
                      margin: 0,
                    }}
                  >
                    {brief2.tacticalInsight.body}
                  </p>
                </div>
              )}

              {/* What to Watch */}
              {Array.isArray(brief2.whatToWatch) && brief2.whatToWatch.length > 0 && (
                <div className="rws-card">
                  <p className="rws-label">🔮 What to Watch</p>
                  {brief2.whatToWatch.map((w, i) => (
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
              )}

              {/* Seasonal Tip — only renders when present */}
              {brief2.seasonalTip && (
                <div
                  style={{
                    backgroundColor: `${C.green}0a`,
                    border: `1px solid ${C.green}30`,
                    borderRadius: "1rem",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                    <span>📅</span>
                    <p style={{ ...labelStyle, margin: 0, color: C.green }}>
                      {brief2.seasonalTip.tag}
                    </p>
                  </div>
                  <p
                    style={{
                      fontFamily: C.serif,
                      fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "0.5rem",
                      marginTop: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {brief2.seasonalTip.headline}
                  </p>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      lineHeight: 1.8,
                      color: C.muted,
                      margin: 0,
                    }}
                  >
                    {brief2.seasonalTip.plain}
                  </p>
                </div>
              )}

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
                  Calculate my net worth →
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

          {/* ── PREV / NEXT NAVIGATION ── */}
          {allBriefs.length > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "2.5rem",
                paddingTop: "1.5rem",
                borderTop: `1px solid ${C.border}`,
              }}
            >
              {hasPrev ? (
                <button
                  onClick={() => setCurrentIndex((i) => i + 1)}
                  style={{
                    background: "none",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.825rem",
                    fontWeight: 500,
                    color: C.muted,
                    cursor: "pointer",
                  }}
                >
                  ← {formatBriefDate(allBriefs[currentIndex + 1].date, { month: "short", day: "numeric" })}
                </button>
              ) : (
                <div style={{ width: 80 }} />
              )}

              <p style={{ fontSize: "0.75rem", color: C.muted, margin: 0 }}>
                {currentIndex + 1} of {allBriefs.length}
              </p>

              {hasNext ? (
                <button
                  onClick={() => setCurrentIndex((i) => i - 1)}
                  style={{
                    background: "none",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    padding: "0.5rem 1rem",
                    fontSize: "0.825rem",
                    fontWeight: 500,
                    color: C.muted,
                    cursor: "pointer",
                  }}
                >
                  {formatBriefDate(allBriefs[currentIndex - 1].date, { month: "short", day: "numeric" })} →
                </button>
              ) : (
                <div style={{ width: 80 }} />
              )}
            </div>
          )}

        </div>
      </main>
    </PageWrapper>
  );
}