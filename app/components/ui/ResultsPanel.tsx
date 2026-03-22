/**
 * app/components/ui/ResultsPanel.tsx
 * Conditional wrapper that shows children when results are ready,
 * or a centered empty state message when they are not.
 *
 * Usage:
 *   <ResultsPanel isReady={hasInput}>
 *     <StatCard ... />
 *     <PieChart ... />
 *   </ResultsPanel>
 *
 *   <ResultsPanel isReady={hasInput} emptyMessage="Enter your loan details above to see your payoff plan.">
 *     <BreakdownTable ... />
 *   </ResultsPanel>
 */

import { C } from "../../lib/brand";

type ResultsPanelProps = {
  isReady: boolean;
  emptyMessage?: string;
  children?: React.ReactNode;
};

export function ResultsPanel({
  isReady,
  emptyMessage = "Enter your details above to see your results.",
  children,
}: ResultsPanelProps) {
  if (!isReady) {
    return (
      <div className="rws-card" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "8rem",
        textAlign: "center",
      }}>
        <p style={{
          fontSize: "0.9rem",
          color: C.muted,
          fontFamily: C.sans,
          margin: 0,
          lineHeight: 1.6,
        }}>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}