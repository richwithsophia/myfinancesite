/**
 * ui/PageCard.tsx
 * Standard content card: emoji + title + body + CTA link.
 * Used on Home (feature cards) and Tools (tool cards).
 *
 * Usage:
 *   <PageCard href="/daily-brief" emoji="📰" title="..." body="..." cta="Read →" />
 *   <PageCard ... badge="Coming Soon" disabled />
 */
import { C } from "../../lib/brand";

type PageCardProps = {
  href: string;
  emoji: string;
  title: string;
  body: string;
  cta: string;
  disabled?: boolean;
  badge?: string;
};

export function PageCard({ href, emoji, title, body, cta, disabled = false, badge }: PageCardProps) {
  return (
    <a
      href={disabled ? undefined : href}
      style={{
        backgroundColor: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: "1rem",
        padding: "1.75rem",
        textDecoration: "none",
        display: "flex",
        flexDirection: "column",
        opacity: disabled ? 0.55 : 1,
        cursor: disabled ? "default" : "pointer",
        minHeight: "unset",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{emoji}</span>
        {badge && (
          <span style={{
            fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", padding: "0.3rem 0.75rem", borderRadius: 9999,
            backgroundColor: disabled ? `${C.text}0d` : `${C.green}18`,
            color: disabled ? C.muted : C.green,
          }}>
            {badge}
          </span>
        )}
      </div>
      <h2 style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 600, color: C.text, marginBottom: "0.75rem", marginTop: 0, lineHeight: 1.3 }}>
        {title}
      </h2>
      <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: C.muted, flex: 1, marginBottom: "1.5rem", marginTop: 0 }}>
        {body}
      </p>
      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: disabled ? C.muted : C.green, margin: 0 }}>
        {cta}
      </p>
    </a>
  );
}
