/**
 * ui/SubscribeForm.tsx
 * Email capture for the Daily Brief — wired to Beehiiv via /api/subscribe.
 *
 * Usage:
 *   <SubscribeForm />              — stacked layout (sidebar, footer)
 *   <SubscribeForm compact />      — inline row (hero, CTA band)
 */
"use client";

import { useState } from "react";
import { C } from "../../lib/brand";

type SubscribeFormProps = { compact?: boolean };

export function SubscribeForm({ compact = false }: SubscribeFormProps) {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email.");

  async function handleSubmit() {
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });

      if (!res.ok) {
        setErrorMsg("Something went wrong — please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Could not connect — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p style={{ fontSize: "0.9rem", color: C.green, fontWeight: 600, margin: 0 }}>
        ✓ You&apos;re in! Welcome to Rich with Sophia.
      </p>
    );
  }

  if (compact) {
    return (
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="rws-email-input"
          style={{ flex: 1, minWidth: "12rem", borderColor: status === "error" ? C.coral : undefined }}
          disabled={status === "loading"}
        />
        <button
          onClick={handleSubmit}
          className="rws-btn-primary"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Subscribing..." : "Subscribe →"}
        </button>
        {status === "error" && (
          <p style={{ width: "100%", fontSize: "0.8rem", color: C.coral, margin: "0.25rem 0 0" }}>
            {errorMsg}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 420, width: "100%" }}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="rws-email-input"
        style={{ borderColor: status === "error" ? C.coral : undefined }}
        disabled={status === "loading"}
      />
      <button
        onClick={handleSubmit}
        className="rws-btn-primary"
        style={{ width: "100%", fontSize: "0.95rem" }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Subscribing..." : "Get the Daily Brief →"}
      </button>
      {status === "error" && (
        <p style={{ fontSize: "0.8rem", color: C.coral, margin: 0 }}>{errorMsg}</p>
      )}
      <p style={{ fontSize: "0.8rem", color: C.muted, margin: 0 }}>Free. No spam. Unsubscribe anytime.</p>
    </div>
  );
}