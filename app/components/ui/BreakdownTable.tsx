/**
 * app/components/ui/BreakdownTable.tsx
 * Scrollable data table with optional totals row.
 * Horizontally scrollable on mobile so columns never get crushed.
 * Column headers use labelStyle. Totals row has a distinct background.
 *
 * Usage:
 *   <BreakdownTable
 *     columns={[
 *       { key: "loan",     label: "Loan",          align: "left"  },
 *       { key: "payment",  label: "Monthly Payment", align: "right" },
 *       { key: "interest", label: "Total Interest", align: "right" },
 *     ]}
 *     rows={[
 *       { loan: "Sallie Mae", payment: "$450", interest: "$3,200" },
 *     ]}
 *     totalsRow={{ loan: "Total", payment: "$450", interest: "$3,200" }}
 *   />
 */

import { C, labelStyle } from "../../lib/brand";

type Column = {
  key: string;
  label: string;
  align?: "left" | "right";
};

type BreakdownTableProps = {
  columns: Column[];
  rows: Record<string, string>[];
  totalsRow?: Record<string, string>;
};

export function BreakdownTable({ columns, rows, totalsRow }: BreakdownTableProps) {
  const cellBase: React.CSSProperties = {
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    fontFamily: C.sans,
    color: C.text,
    whiteSpace: "nowrap",
    borderBottom: `1px solid ${C.border}`,
  };

  return (
    <div style={{
      width: "100%",
      overflowX: "auto",
      borderRadius: "0.75rem",
      border: `1px solid ${C.border}`,
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "480px", // forces scroll on mobile before columns get too tight
      }}>

        {/* Header */}
        <thead>
          <tr style={{ backgroundColor: C.card }}>
            {columns.map(col => (
              <th
                key={col.key}
                style={{
                  ...labelStyle,
                  padding: "0.75rem 1rem",
                  textAlign: col.align ?? "left",
                  whiteSpace: "nowrap",
                  borderBottom: `1px solid ${C.border}`,
                  fontWeight: 600,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{ backgroundColor: i % 2 === 0 ? C.white : `${C.card}80` }}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  style={{
                    ...cellBase,
                    textAlign: col.align ?? "left",
                    fontWeight: col.align === "right" ? 600 : 400,
                    borderBottom: i === rows.length - 1 && !totalsRow ? "none" : `1px solid ${C.border}`,
                  }}
                >
                  {row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        {/* Totals row */}
        {totalsRow && (
          <tfoot>
            <tr style={{ backgroundColor: C.card }}>
              {columns.map((col, i) => (
                <td
                  key={col.key}
                  style={{
                    ...cellBase,
                    textAlign: col.align ?? "left",
                    fontWeight: 700,
                    color: i === 0 ? C.muted : C.text,
                    borderBottom: "none",
                    borderTop: `2px solid ${C.border}`,
                  }}
                >
                  {totalsRow[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          </tfoot>
        )}

      </table>
    </div>
  );
}