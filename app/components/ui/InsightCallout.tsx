/**
 * app/components/ui/InsightCallout.tsx
 * Highlighted info, warning, or interactive impact box.
 *
 * variant="info"    — green tint, informational message
 * variant="warning" — amber tint, warning message
 * variant="impact"  — green tint, with an embedded input and live result copy
 *
 * Usage:
 *   <InsightCallout variant="info" message="Extra payments go to the highest rate loan first." />
 *   <InsightCallout variant="warning" message="Less than 20% down typically requires PMI." />
 *   <InsightCallout
 *     variant="impact"
 *     message={<>Paying an extra <strong>$100</strong>/month saves you...</>}
 *     input={<MoneyInput ... />}
 *   />
 */

import { C } from "../../lib/brand";
import type { ReactNode } from "react";

type InsightCalloutProps =
  | {
      variant: "info" | "warning";
      message: string;
      icon?: string;
      input?: never;
    }
  | {
      variant: "impact";
      message: ReactNode;
      icon?: string;
      input: ReactNode;
    };

export function InsightCallout({ message, icon = "📌", variant, input }: InsightCalloutProps) {
  const isWarning = variant === "warning";
  const color     = isWarning ? C.amber : C.green;
  const bg        = `${color}0D`;
  const border    = `${color}25`;

  return (
    <div style={{
      backgroundColor: bg,
      border: `1px solid ${border}`,
      borderRadius: "0.75rem",
      padding: "1rem 1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.875rem",
    }}>
      {/* Top row — icon + message or input */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
        <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.1rem" }}>
          {icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {variant === "impact" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Input */}
              {input}
              {/* Live result */}
              <p style={{
                fontSize: "0.875rem",
                color: C.text,
                lineHeight: 1.6,
                margin: 0,
                fontFamily: C.sans,
              }}>
                {message}
              </p>
            </div>
          ) : (
            <p style={{
              fontSize: "0.825rem",
              color: C.muted,
              lineHeight: 1.6,
              margin: 0,
              fontFamily: C.sans,
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}