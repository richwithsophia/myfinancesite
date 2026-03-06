/**
 * ui/SubscribeForm.tsx
 * Email capture for the Daily Brief.
 * Drop on any page. Ready to wire to Mailchimp / ConvertKit / Resend.
 *
 * Usage:
 *   <SubscribeForm />              — stacked layout (sidebar, footer)
 *   <SubscribeForm compact />      — inline row (hero, CTA band)
 *
 * To connect to an email provider: replace the TODO in handleSubmit.
 */
"use client";

import { useState } from "react";

type SubscribeFormProps = { compact?: boolean };

export function SubscribeForm({ compact = false }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) { setStatus("error"); return; }
    // TODO: POST to /api/subscribe with { email }
    // await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
    setStatus("success");
    setEmail("");
  };

  if (status === "success") {
    return (
      <p style={{ fontSize: "0.9rem", color: "#2D6A4F", fontWeight: 600, margin: 0 }}>
        ✓ You're in! Check your inbox for a confirmation.
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
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          className="rws-email-input"
          style={{ flex: 1, minWidth: "12rem", borderColor: status === "error" ? "#E07A5F" : undefined }}
        />
        <button onClick={handleSubmit} className="rws-btn-primary">
          Subscribe →
        </button>
        {status === "error" && (
          <p style={{ width: "100%", fontSize: "0.8rem", color: "#E07A5F", margin: "0.25rem 0 0" }}>
            Please enter a valid email.
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
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        className="rws-email-input"
        style={{ borderColor: status === "error" ? "#E07A5F" : undefined }}
      />
      <button onClick={handleSubmit} className="rws-btn-primary" style={{ width: "100%", fontSize: "0.95rem" }}>
        Get the Daily Brief →
      </button>
      {status === "error" && (
        <p style={{ fontSize: "0.8rem", color: "#E07A5F", margin: 0 }}>Please enter a valid email.</p>
      )}
      <p style={{ fontSize: "0.8rem", color: "#6B6760", margin: 0 }}>Free. No spam. Unsubscribe anytime.</p>
    </div>
  );
}