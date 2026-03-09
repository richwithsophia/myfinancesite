"use client";

import { useState } from "react";
import type { Brief } from "@/app/lib/briefs";

// ─────────────────────────────────────────────────────────────────────────────
// app/admin/page.tsx
//
// Admin index — token gate + brief dashboard.
// Lists all briefs (drafts + published) with links to the editor.
// Token is stored in sessionStorage so you only enter it once per session.
// ─────────────────────────────────────────────────────────────────────────────

const S = {
  page:       { background: "#000000", minHeight: "100vh", padding: "32px 24px", fontFamily: "Arial, sans-serif" },
  container:  { maxWidth: 760, margin: "0 auto" },
  label:      { color: "#9ca3af", fontSize: 11, textTransform: "uppercase" as const, letterSpacing: 1, marginBottom: 6, display: "block" },
  input:      { width: "100%", background: "#1a1a1a", color: "#ffffff", border: "1px solid #2a2a2a", borderRadius: 8, padding: "12px", fontSize: 14, boxSizing: "border-box" as const, fontFamily: "Arial, sans-serif" },
  btnGreen:   { background: "#2d6a4f", color: "#ffffff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnCoral:   { background: "#1a1a1a", color: "#e07a5f", border: "2px solid #e07a5f", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnGhost:   { background: "#1a1a1a", color: "#9ca3af", border: "1px solid #2a2a2a", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  error:      { color: "#f87171", fontSize: 13, marginTop: 8 },
  card:       { background: "#0f0f0f", border: "1px solid #1a1a1a", borderRadius: 12, padding: "20px 24px", marginBottom: 12 },
  statusDot:  (published: boolean) => ({
    display: "inline-block",
    width: 8, height: 8,
    borderRadius: "50%",
    backgroundColor: published ? "#22c55e" : "#f59e0b",
    marginRight: 6,
  }),
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T12:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

// ─── Token gate ───────────────────────────────────────────────────────────────

function TokenGate({ onToken }: { onToken: (t: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!value.trim()) return;
    setLoading(true); setError("");
    try {
      // Validate token by attempting to fetch briefs
      const res = await fetch(`/api/admin/briefs?token=${value.trim()}`);
      if (res.status === 401) { setError("Invalid token — check your EDITOR_SECRET"); return; }
      if (!res.ok) { setError("Something went wrong"); return; }
      // Store in sessionStorage so it persists across navigation
      sessionStorage.setItem("rws_admin_token", value.trim());
      onToken(value.trim());
    } catch {
      setError("Could not connect — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <p style={{ color: "#2d6a4f", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Rich with Sophia</p>
        <h1 style={{ color: "#ffffff", fontSize: 22, margin: "0 0 24px" }}>Admin</h1>
        <label style={S.label}>Editor Secret</label>
        <input
          type="password"
          style={S.input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your EDITOR_SECRET"
          autoFocus
        />
        {error && <p style={S.error}>{error}</p>}
        <div style={{ marginTop: 16 }}>
          <button style={S.btnGreen} onClick={handleSubmit} disabled={loading}>
            {loading ? "Checking..." : "Enter →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Brief dashboard ──────────────────────────────────────────────────────────

function Dashboard({ token }: { token: string }) {
  const [briefs, setBriefs]         = useState<Brief[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [publishing, setPublishing] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg]         = useState("");

  // Load briefs on mount
  useState(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/briefs?token=${token}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setBriefs(data);
      } catch {
        setError("Failed to load briefs");
      } finally {
        setLoading(false);
      }
    }
    load();
  });

  async function handlePublish(id: string) {
    setPublishing(id); setError("");
    try {
      const res = await fetch(`/api/brief/${id}?token=${token}&action=publish`);
      if (!res.ok) throw new Error("Publish failed");
      // Refresh list
      const updated = await fetch(`/api/admin/briefs?token=${token}`);
      setBriefs(await updated.json());
    } catch {
      setError(`Failed to publish ${id}`);
    } finally {
      setPublishing(null);
    }
  }

  async function handleGenerate() {
    setGenerating(true); setGenMsg(""); setError("");
    try {
      const res = await fetch(`/api/generate-brief`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Generation failed");
      setGenMsg("Brief generated! Refresh to see it.");
      // Refresh list after a moment
      setTimeout(async () => {
        const updated = await fetch(`/api/admin/briefs?token=${token}`);
        setBriefs(await updated.json());
        setGenMsg("");
      }, 3000);
    } catch {
      setError("Generation failed — check that markets are open or try again");
    } finally {
      setGenerating(false);
    }
  }

  const drafts    = briefs.filter((b) => b.status === "draft");
  const published = briefs.filter((b) => b.status === "published");

  return (
    <div style={S.page}>
      <div style={S.container}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <p style={{ color: "#2d6a4f", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Rich with Sophia</p>
            <h1 style={{ color: "#ffffff", fontSize: 24, margin: "0 0 4px" }}>Brief Dashboard</h1>
            <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>{briefs.length} total briefs</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <button style={S.btnGreen} onClick={handleGenerate} disabled={generating}>
              {generating ? "Generating..." : "⚡ Generate New Brief"}
            </button>
            {genMsg && <p style={{ color: "#4ade80", fontSize: 13, margin: 0 }}>{genMsg}</p>}
          </div>
        </div>

        {error && <p style={S.error}>{error}</p>}

        {loading && <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading briefs...</p>}

        {/* Drafts */}
        {!loading && drafts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <p style={{ color: "#f59e0b", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              ● Drafts ({drafts.length})
            </p>
            {drafts.map((b) => (
              <BriefRow
                key={b.date}
                brief={b}
                token={token}
                onPublish={() => handlePublish(b.date)}
                publishing={publishing === b.date}
              />
            ))}
          </div>
        )}

        {/* Published */}
        {!loading && published.length > 0 && (
          <div>
            <p style={{ color: "#22c55e", fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              ● Published ({published.length})
            </p>
            {published.map((b) => (
              <BriefRow
                key={b.date}
                brief={b}
                token={token}
                onPublish={() => handlePublish(b.date)}
                publishing={publishing === b.date}
              />
            ))}
          </div>
        )}

        {!loading && briefs.length === 0 && (
          <div style={{ ...S.card, textAlign: "center", padding: "48px 24px" }}>
            <p style={{ color: "#9ca3af", fontSize: 14, margin: 0 }}>No briefs yet. Generate your first one above.</p>
          </div>
        )}

        {/* Sign out */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #1a1a1a" }}>
          <button
            style={{ ...S.btnGhost, fontSize: 12 }}
            onClick={() => { sessionStorage.removeItem("rws_admin_token"); window.location.reload(); }}
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── Brief row ────────────────────────────────────────────────────────────────

function BriefRow({
  brief, token, onPublish, publishing,
}: {
  brief: Brief;
  token: string;
  onPublish: () => void;
  publishing: boolean;
}) {
  const isPublished = brief.status === "published";
  const subject     = brief.subjectLines?.[0] ?? "No subject line";

  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <span style={S.statusDot(isPublished)} />
            <span style={{ color: "#ffffff", fontSize: 15, fontWeight: 600 }}>
              {formatDate(brief.date)}
            </span>
          </div>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {subject}
          </p>
          {brief.mood && (
            <span style={{ fontSize: 11, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
              {brief.mood}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <a
            href={`/admin/brief/${brief.date}?token=${token}`}
            style={{ ...S.btnGhost, textDecoration: "none", display: "inline-block" }}
          >
            Edit →
          </a>
          {!isPublished && (
            <button style={S.btnCoral} onClick={onPublish} disabled={publishing}>
              {publishing ? "Publishing..." : "Publish"}
            </button>
          )}
          {isPublished && (
            <a
              href="/daily-brief"
              target="_blank"
              style={{ ...S.btnGreen, textDecoration: "none", display: "inline-block", fontSize: 13, padding: "8px 16px" }}
            >
              View Live
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("rws_admin_token");
    }
    return null;
  });

  if (!token) return <TokenGate onToken={setToken} />;
  return <Dashboard token={token} />;
}