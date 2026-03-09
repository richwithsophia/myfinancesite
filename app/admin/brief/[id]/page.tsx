"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import type { Brief } from "@/app/lib/briefs";

const S = {
  page:      { background: "#000000", minHeight: "100vh", padding: "32px 24px", fontFamily: "Arial, sans-serif" },
  container: { maxWidth: 720, margin: "0 auto" },
  heading:   { color: "#9ca3af", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #1a1a1a" },
  label:     { color: "#9ca3af", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 6, display: "block" },
  textarea:  { width: "100%", background: "#1a1a1a", color: "#ffffff", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px", fontSize: 14, lineHeight: 1.6, resize: "vertical" as const, boxSizing: "border-box" as const, fontFamily: "Arial, sans-serif" },
  mono:      { width: "100%", background: "#1a1a1a", color: "#ffffff", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px", fontSize: 13, lineHeight: 1.6, resize: "vertical" as const, boxSizing: "border-box" as const, fontFamily: "monospace" },
  section:   { marginBottom: 32 },
  subjectBtn: (selected: boolean) => ({
    background: selected ? "#2d6a4f" : "#1a1a1a",
    border: `2px solid ${selected ? "#2d6a4f" : "#2a2a2a"}`,
    borderRadius: 8, padding: "14px 16px", cursor: "pointer",
    color: "#ffffff", fontSize: 14, marginBottom: 10,
    display: "block", width: "100%", textAlign: "left" as const,
  }),
  btnGreen:  { background: "#2d6a4f", color: "#ffffff", border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer" },
  btnCoral:  { background: "#2a2a2a", color: "#ffffff", border: "1px solid #3a3a3a", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer" },
  btnGhost:  { background: "none", color: "#6b7280", border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 500, cursor: "pointer" },
  error:     { color: "#f87171", fontSize: 14, marginTop: 8 },
};

export default function BriefEditorPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const id           = params.id as string;
  const token        = searchParams.get("token") ?? "";

  const [brief,          setBrief]          = useState<Brief | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [authError,      setAuthError]      = useState(false);
  const [notFound,       setNotFound]       = useState(false);
  const [saving,         setSaving]         = useState(false);
  const [publishing,     setPublishing]     = useState(false);
  const [saveMsg,        setSaveMsg]        = useState("");
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [error,          setError]          = useState("");

  // Editable fields
  const [openingTakeaways, setOpeningTakeaways] = useState("");
  const [openingContext,   setOpeningContext]   = useState("");
  const [quotableInsight,  setQuotableInsight]  = useState("");
  const [mood,             setMood]             = useState("");
  const [marketPerf,       setMarketPerf]       = useState("");
  const [keyDevs,          setKeyDevs]          = useState("");
  const [whatToWatch,      setWhatToWatch]      = useState("");
  const [tacticalInsight,  setTacticalInsight]  = useState("");
  const [selectedSubject,  setSelectedSubject]  = useState(0);

  // ─── Load ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/brief/${id}?token=${token}`);
        if (res.status === 401) { setAuthError(true);  setLoading(false); return; }
        if (res.status === 404) { setNotFound(true);   setLoading(false); return; }
        if (!res.ok)            { setError("Failed to load brief"); setLoading(false); return; }

        const data: Brief = await res.json();
        setBrief(data);
        setOpeningTakeaways(JSON.stringify(data.openingSection?.takeaways ?? [], null, 2));
        setOpeningContext(data.openingSection?.context ?? "");
        setQuotableInsight(data.quotableInsight);
        setMood(data.mood);
        setMarketPerf(JSON.stringify(data.marketPerformance, null, 2));
        setKeyDevs(JSON.stringify(data.keyDevelopments, null, 2));
        setWhatToWatch(JSON.stringify(data.whatToWatch, null, 2));
        setTacticalInsight(JSON.stringify(data.tacticalInsight, null, 2));
      } catch {
        setError("Failed to load brief");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, token]);

  // ─── Build payload ────────────────────────────────────────────────────────

  function buildPayload() {
    return {
      openingSection: {
        takeaways: JSON.parse(openingTakeaways),
        context:   openingContext,
      },
      quotableInsight,
      mood,
      marketPerformance: JSON.parse(marketPerf),
      keyDevelopments:   JSON.parse(keyDevs),
      whatToWatch:       JSON.parse(whatToWatch),
      tacticalInsight:   JSON.parse(tacticalInsight),
      subjectLines: brief?.subjectLines
        ? [
            brief.subjectLines[selectedSubject],
            brief.subjectLines[selectedSubject === 0 ? 1 : 0],
          ]
        : null,
    };
  }

  // ─── Save ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true); setSaveMsg(""); setError("");
    try {
      const res = await fetch(`/api/brief/${id}?token=${token}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(buildPayload()),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveMsg("Saved ✓");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setError("Save failed — check JSON fields for syntax errors");
    } finally {
      setSaving(false);
    }
  }

  // ─── Publish ──────────────────────────────────────────────────────────────

  async function handlePublish() {
    setPublishing(true); setError("");
    try {
      // Save edits first
      const saveRes = await fetch(`/api/brief/${id}?token=${token}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(buildPayload()),
      });
      if (!saveRes.ok) throw new Error("Failed to save edits before publishing");

      // Then publish
      const pubRes = await fetch(`/api/brief/${id}?token=${token}&action=publish`);
      if (!pubRes.ok) throw new Error("Publish failed");

      setPublishSuccess(true);
    } catch {
      setError("Publish failed — check JSON fields for syntax errors");
    } finally {
      setPublishing(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading)   return <div style={{ ...S.page, padding: "80px 24px", color: "#9ca3af", textAlign: "center" }}>Loading...</div>;
  if (authError) return <div style={{ ...S.page, padding: "80px 24px", color: "#f87171", textAlign: "center" }}>403 — Invalid token</div>;
  if (notFound)  return <div style={{ ...S.page, padding: "80px 24px", color: "#f87171", textAlign: "center" }}>404 — Brief not found</div>;


  if (publishSuccess) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    return (
      <div style={S.page}>
        <div style={{ ...S.container, textAlign: "center", paddingTop: 80 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <h2 style={{ color: "#ffffff", margin: "0 0 12px" }}>Brief Published</h2>
          <p style={{ color: "#9ca3af", margin: "0 0 24px" }}>The {id} brief is now live.</p>
          <a href={`${siteUrl}/daily-brief`} style={{ ...S.btnGreen, textDecoration: "none", display: "inline-block" }}>
            View Live Brief →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ color: "#2d6a4f", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Rich with Sophia</p>
          <h1 style={{ color: "#ffffff", fontSize: 24, margin: "0 0 4px" }}>Edit Brief</h1>
          <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>{id} · {brief?.status}</p>
        </div>

        {/* Subject Lines */}
        {brief?.subjectLines && brief.subjectLines.length === 2 && (
          <div style={S.section}>
            <p style={S.heading}>Subject Line — select one</p>
            {brief.subjectLines.map((line, i) => (
              <button key={i} style={S.subjectBtn(selectedSubject === i)} onClick={() => setSelectedSubject(i)}>
                {selectedSubject === i ? "✓  " : ""}{line}
              </button>
            ))}
          </div>
        )}

        {/* Mood */}
        <div style={S.section}>
          <p style={S.heading}>Mood</p>
          <textarea rows={1} style={S.textarea} value={mood} onChange={(e) => setMood(e.target.value)} />
        </div>

        {/* Opening Section — Takeaways */}
        <div style={S.section}>
          <p style={S.heading}>Today in 60 Seconds — Takeaways (JSON array)</p>
          <textarea rows={6} style={S.mono} value={openingTakeaways} onChange={(e) => setOpeningTakeaways(e.target.value)} />
        </div>

        {/* Opening Section — Context */}
        <div style={S.section}>
          <p style={S.heading}>Today in 60 Seconds — Context</p>
          <textarea rows={4} style={S.textarea} value={openingContext} onChange={(e) => setOpeningContext(e.target.value)} />
        </div>

        {/* Quotable Insight */}
        <div style={S.section}>
          <p style={S.heading}>Quotable Insight</p>
          <textarea rows={2} style={S.textarea} value={quotableInsight} onChange={(e) => setQuotableInsight(e.target.value)} />
        </div>

        {/* Market Performance */}
        <div style={S.section}>
          <p style={S.heading}>Market Performance — JSON</p>
          <textarea rows={20} style={S.mono} value={marketPerf} onChange={(e) => setMarketPerf(e.target.value)} />
        </div>

        {/* Key Developments */}
        <div style={S.section}>
          <p style={S.heading}>Key Developments — JSON</p>
          <textarea rows={24} style={S.mono} value={keyDevs} onChange={(e) => setKeyDevs(e.target.value)} />
        </div>

        {/* Tactical Insight */}
        <div style={S.section}>
          <p style={S.heading}>Tactical Insight — JSON</p>
          <textarea rows={8} style={S.mono} value={tacticalInsight} onChange={(e) => setTacticalInsight(e.target.value)} />
        </div>

        {/* What to Watch */}
        <div style={S.section}>
          <p style={S.heading}>What to Watch — JSON</p>
          <textarea rows={16} style={S.mono} value={whatToWatch} onChange={(e) => setWhatToWatch(e.target.value)} />
        </div>

        {/* Error */}
        {error && <p style={S.error}>{error}</p>}

        {/* Actions */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16, marginBottom: 64 }}>
          <button style={S.btnGreen} onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing..." : "Publish Brief →"}
          </button>
          <button style={S.btnCoral} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <a href="/admin" style={{ ...S.btnGhost, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            ← Back to Dashboard
          </a>
          {saveMsg && <span style={{ color: "#4ade80", fontSize: 14, alignSelf: "center" }}>{saveMsg}</span>}
        </div>

      </div>
    </div>
  );
}