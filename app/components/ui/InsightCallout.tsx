/**
 * app/components/ui/InsightCallout.tsx
 * Highlighted info or warning box for contextual messages.
 * Matches the green context note pattern used in net-worth/page.tsx.
 *
 * Usage:
 *   <InsightCallout variant="info" message="Extra payments go to the highest rate loan first." />
 *   <InsightCallout variant="warning" message="Less than 20% down typically requires PMI." />
 *   <InsightCallout variant="info" icon="💡" message="Your custom message here." />
 */

import { C } from "../../lib/brand";

type InsightCalloutProps = {
  message: string;
  icon?: string;
  variant: "info" | "warning";
};

export function InsightCallout({ message, icon = "📌", variant }: InsightCalloutProps) {
  const isInfo = variant === "info";

  const color  = isInfo ? C.green : C.amber;
  const bg     = `${color}0D`;
  const border = `${color}25`;

  return (
    <div style={{
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: "0.75rem",
      padding: "0.875rem 1.25rem",
      display: "flex",
      alignItems: "flex-start",
      gap: "0.75rem",
    }}>
      <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.1rem" }}>
        {icon}
      </span>
      <p style={{
        fontSize: "0.825rem",
        color: C.muted,
        lineHeight: 1.6,
        margin: 0,
        fontFamily: C.sans,
      }}>
        {message}
      </p>
    </div>
  );
}