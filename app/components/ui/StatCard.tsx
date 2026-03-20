/**
 * app/components/ui/StatCard.tsx
 * Single large stat with an overline label and optional subtext.
 * Used in results sections to highlight key calculated values.
 *
 * Usage:
 *   <StatCard label="Debt-Free Date" value="June 2031" />
 *   <StatCard label="Total Interest" value="$12,400" subtext="Over 5 years" color={C.coral} />
 */

import { C, labelStyle } from "../../lib/brand";

type StatCardProps = {
  label: string;
  value: string;
  subtext?: string;
  color?: string;
};

export function StatCard({ label, value, subtext, color = C.text }: StatCardProps) {
  return (
    <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>

      {/* Overline label */}
      <p style={{ ...labelStyle, margin: 0 }}>
        {label}
      </p>

      {/* Main value */}
      <p style={{
        fontFamily: C.serif,
        fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
        fontWeight: 700,
        color,
        margin: 0,
        lineHeight: 1.1,
      }}>
        {value}
      </p>

      {/* Subtext */}
      {subtext && (
        <p style={{
          fontSize: "0.775rem",
          color: C.muted,
          margin: 0,
          lineHeight: 1.4,
          fontFamily: C.sans,
        }}>
          {subtext}
        </p>
      )}

    </div>
  );
}