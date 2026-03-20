/**
 * app/components/ui/PieChart.tsx
 * Inline SVG donut chart with center label/value and legend below.
 * Zero-value segments are hidden from both the chart and legend.
 * Legend includes a "Total Payment" totals row at the bottom.
 * Uses formatCurrency from calculators.ts for legend dollar amounts.
 *
 * Usage:
 *   <PieChart
 *     data={[
 *       { label: "Principal", value: 20000, color: C.green },
 *       { label: "Interest",  value: 4800,  color: C.coral },
 *     ]}
 *     centerValue="$1,802"
 *   />
 *   <PieChart
 *     data={[...]}
 *     centerValue="$1,802"
 *     centerLabel="Monthly"
 *     size={180}
 *   />
 */

import { C, labelStyle } from "../../lib/brand";
import { formatCurrency } from "../../lib/calculators";

type PieSlice = {
  label: string;
  value: number;
  color: string;
};

type PieChartProps = {
  data: PieSlice[];
  centerValue: string;
  centerLabel?: string;
  size?: number;
};

export function PieChart({
  data,
  centerValue,
  centerLabel = "Total",
  size = 200,
}: PieChartProps) {
  // Filter out zero-value segments
  const slices = data.filter(d => d.value > 0);
  const total  = slices.reduce((sum, d) => sum + d.value, 0);

  // Nothing to render
  if (slices.length === 0 || total === 0) return null;

  const cx         = size / 2;
  const cy         = size / 2;
  const outerR     = size / 2 - 4;
  const innerR     = outerR * 0.58; // donut hole — thick enough to see slices, roomy enough for center text

  function polarToCartesian(angle: number, r: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: parseFloat((cx + r * Math.cos(rad)).toFixed(4)),
      y: parseFloat((cy + r * Math.sin(rad)).toFixed(4)),
    };
  }

  function buildPath(startAngle: number, endAngle: number) {
// Full circle edge case — uses even-odd fill rule to cut donut hole
if (endAngle - startAngle >= 359.999) {
  return [
    `M ${cx} ${cy - outerR}`,
    `A ${outerR} ${outerR} 0 1 1 ${parseFloat((cx - 0.001).toFixed(4))} ${cy - outerR}`,
    `Z`,
    `M ${cx} ${cy - innerR}`,
    `A ${innerR} ${innerR} 0 1 1 ${parseFloat((cx - 0.001).toFixed(4))} ${cy - innerR}`,
    `Z`,
  ].join(" ");
}

    const outerStart = polarToCartesian(startAngle, outerR);
    const outerEnd   = polarToCartesian(endAngle,   outerR);
    const innerStart = polarToCartesian(startAngle, innerR);
    const innerEnd   = polarToCartesian(endAngle,   innerR);
    const largeArc   = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerEnd.x} ${innerEnd.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
      `Z`,
    ].join(" ");
  }

  let cursor = 0;
  const paths = slices.map(slice => {
    const sweep      = (slice.value / total) * 360;
    const startAngle = cursor;
    const endAngle   = cursor + sweep;
    cursor           = endAngle;
    return { ...slice, path: buildPath(startAngle, endAngle) };
  });

  // Font size for center value — scales with donut size
  const centerValueSize = size < 160 ? "0.9rem" : "1.1rem";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>

      {/* SVG donut */}
      <div style={{ position: "relative", width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: "visible" }}
        >
          {paths.map((slice, i) => (
            <path
              key={i}
              d={slice.path}
              fill={slice.color}
              fillRule="evenodd"
              stroke={C.white}
              strokeWidth={2}
            />
          ))}
        </svg>

        {/* Center text */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}>
          <p style={{
            ...labelStyle,
            fontSize: "0.6rem",
            margin: 0,
            marginBottom: "0.2rem",
          }}>
            {centerLabel}
          </p>
          <p style={{
            fontFamily: C.serif,
            fontSize: centerValueSize,
            fontWeight: 700,
            color: C.text,
            margin: 0,
            whiteSpace: "nowrap",
          }}>
            {centerValue}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
        {paths.map((slice, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                width: "0.625rem",
                height: "0.625rem",
                borderRadius: "50%",
                backgroundColor: slice.color,
                flexShrink: 0,
              }} />
              <span style={{ ...labelStyle, fontSize: "0.7rem", margin: 0 }}>
                {slice.label}
              </span>
            </div>
            <span style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: C.text,
              fontFamily: C.sans,
            }}>
              {formatCurrency(slice.value)}
            </span>
          </div>
        ))}

        {/* Total Payment row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          borderTop: `1px solid ${C.border}`,
          paddingTop: "0.5rem",
          marginTop: "0.25rem",
        }}>
          <span style={{ ...labelStyle, fontSize: "0.7rem", margin: 0 }}>
            Total Payment
          </span>
          <span style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: C.text,
            fontFamily: C.sans,
          }}>
            {centerValue}
          </span>
        </div>
      </div>

    </div>
  );
}