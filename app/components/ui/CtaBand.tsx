/**
 * ui/CtaBand.tsx
 * Green CTA strip. Two variants:
 *   "card" — rounded, inline within page content (Tools page bottom)
 *   "full" — full-width section break (Home page bottom)
 *
 * Usage:
 *   <CtaBand variant="card" headline="Want the full picture?" body="..." cta="Get the Brief →" href="/daily-brief" />
 *   <CtaBand variant="full" headline="Stop skipping..." body="..." cta="..." href="..." footnote="Free. No spam." />
 */
import { C } from "../../lib/brand";
type CtaBandProps = {
  variant?: "card" | "full";
  headline: string;
  body: string;
  cta: string;
  href: string;
  footnote?: string;
};

export function CtaBand({ variant = "card", headline, body, cta, href, footnote }: CtaBandProps) {
  if (variant === "full") {
    return (
      <section className="rws-cta-band-full">
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 700, color: C.bg, lineHeight: 1.2, marginBottom: "1rem", marginTop: 0 }}>
            {headline}
          </h2>
          <p style={{ color: `${C.bg}99`, fontSize: "clamp(0.9rem, 2vw, 1rem)", lineHeight: 1.75, marginBottom: "2rem", marginTop: 0 }}>
            {body}
          </p>
          <a href={href} className="rws-btn-primary" style={{ fontSize: "1rem", padding: "0.85rem 2rem" }}>
            {cta}
          </a>
          {footnote && <p style={{ color: `${C.bg}55`, fontSize: "0.8rem", marginTop: "1rem", marginBottom: 0 }}>{footnote}</p>}
        </div>
      </section>
    );
  }

  return (
    <div className="rws-cta-band">
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: C.serif, fontSize: "clamp(1.1rem, 2.5vw, 1.3rem)", fontWeight: 600, color: C.bg, marginBottom: "0.4rem", marginTop: 0 }}>
          {headline}
        </p>
        <p style={{ fontSize: "0.9rem", color: `${C.bg}99`, lineHeight: 1.65, margin: 0 }}>
          {body}
        </p>
      </div>
      <a href={href} className="rws-btn-primary" style={{ flexShrink: 0 }}>
        {cta}
      </a>
    </div>
  );
}