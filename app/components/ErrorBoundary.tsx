/**
 * app/components/ErrorBoundary.tsx
 * React error boundary for calculator and tool pages.
 * Catches runtime errors and shows a friendly recovery message
 * instead of crashing the entire page.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <StudentLoanCalculator />
 *   </ErrorBoundary>
 */

"use client";

import { Component, type ReactNode } from "react";
import { C, labelStyle } from "../lib/brand";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rws-card" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minHeight: "12rem",
          gap: "0.75rem",
        }}>
          <span style={{ fontSize: "1.5rem" }}>⚠️</span>
          <p style={{ ...labelStyle, margin: 0 }}>Something went wrong</p>
          <p style={{ fontSize: "0.875rem", color: C.muted, margin: 0, fontFamily: C.sans }}>
            There was an error loading this calculator.
          </p>
          <button
            className="rws-btn-secondary"
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: "0.5rem" }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}