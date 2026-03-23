/**
 * app/tools/student-loan/page.tsx
 * Student Loan Payoff Calculator.
 * Layout: 40/60 side-by-side on desktop (results sticky), stacked on mobile.
 *
 * Results hierarchy:
 *   Row 1 — 3 stat cards: Debt-Free Date, Total Monthly Payment, Total Interest Paid
 *   Row 2 — What if widget: extra payment impact with correct avalanche rollover
 *   Row 3 — Pie chart (always visible) + table (collapsed behind toggle)
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import PageWrapper from "../../components/PageWrapper";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { useSessionState } from "../../lib/useSessionState";
import {
  SectionLabel,
  CtaBand,
  MoneyInput,
  PercentInput,
  StatCard,
  PieChart,
  BreakdownTable,
  InsightCallout,
  ResultsPanel,
  DynamicList,
} from "../../components/ui";
import { C, labelStyle } from "../../lib/brand";
import {
  parseCurrencyInput,
  calculateAmortization,
  calculatePayoffDate,
  formatYears,
  formatCurrency,
  calculateTotalInterest,
  computeAvalancheImpact,
  type AvalancheLoan,
} from "../../lib/calculators";
import { isValidRate, isValidBalance, isValidPayment } from "../../lib/validators";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type Loan = {
  name: string;
  balance: string;
  rate: string;
  payment: string;
};

type LoanResult = {
  name: string;
  monthlyPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPaid: number;
  months: number;
  payoffDate: string;
  rate: number;
};

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function emptyLoan(index: number): Loan {
  if (index === 0) {
    return { name: "Loan 1", balance: "10000", rate: "6.5", payment: "200" };
  }
  return { name: `Loan ${index + 1}`, balance: "", rate: "", payment: "" };
}

function validateLoan(loan: Loan): string | null {
  if (!isValidBalance(loan.balance)) return null;
  if (!isValidRate(loan.rate)) return null;
  const balance = parseCurrencyInput(loan.balance);
  const rate = parseFloat(loan.rate);
  const payment = parseCurrencyInput(loan.payment);
  if (payment <= 0) return null;
  if (!isValidPayment(payment, balance, rate)) {
    return `${loan.name || "This loan"}'s payment doesn't cover the monthly interest. The loan will never pay off.`;
  }
  return "valid";
}

function computeLoanResult(loan: Loan): LoanResult | null {
  const validation = validateLoan(loan);
  if (!validation || validation !== "valid") return null;
  const balance = parseCurrencyInput(loan.balance);
  const rate = parseFloat(loan.rate);
  const payment = parseCurrencyInput(loan.payment);
  const schedule = calculateAmortization(balance, rate, payment);
  const totalInterest = calculateTotalInterest(schedule);
  const totalPrincipal = balance;
  const totalPaid = totalPrincipal + totalInterest;
  const months = schedule.length;
  const payoffDate = calculatePayoffDate(months);
  return {
    name: loan.name || "Loan",
    monthlyPayment: payment,
    totalPrincipal,
    totalInterest,
    totalPaid,
    months,
    payoffDate,
    rate,
  };
}

/**
 * Computes smart default extra payment:
 * 10% of total monthly payment, rounded to nearest $25, minimum $25.
 */
function smartDefault(totalMonthly: number): string {
  const raw = totalMonthly * 0.1;
  const rounded = Math.max(25, Math.round(raw / 25) * 25);
  return String(rounded);
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function StudentLoanCalculator() {
  const [loans, setLoans] = useSessionState<Loan[]>("student-loan:loans", [emptyLoan(0)]);
  const [extraPayment, setExtraPayment] = useSessionState<string>("student-loan:extraPayment", "100");
  const [tableOpen, setTableOpen] = useState(false);
  const [userEditedExtra, setUserEditedExtra] = useState(false);

  const validationErrors = useMemo(() => loans.map(loan => {
    const v = validateLoan(loan);
    if (v === null || v === "valid") return null;
    return v;
  }), [loans]);

  const zeroRateWarnings = useMemo(() => loans.map(loan => {
    if (!loan.rate) return false;
    return parseFloat(loan.rate) === 0 && isValidBalance(loan.balance);
  }), [loans]);

  const results = useMemo(() =>
    loans.map(computeLoanResult).filter((r): r is LoanResult => r !== null),
    [loans]);

  const hasResults = results.length > 0;

  const totalMonthlyPayment = useMemo(() => results.reduce((s, r) => s + r.monthlyPayment, 0), [results]);
  const totalInterestAll = useMemo(() => results.reduce((s, r) => s + r.totalInterest, 0), [results]);
  const totalPrincipalAll = useMemo(() => results.reduce((s, r) => s + r.totalPrincipal, 0), [results]);
  const totalPaidAll = totalInterestAll + totalPrincipalAll;
  const maxMonths = useMemo(() => results.length > 0 ? Math.max(...results.map(r => r.months)) : 0, [results]);
  const debtFreeDate = hasResults ? calculatePayoffDate(maxMonths) : "—";

  // Update extra payment default when total monthly payment changes
  useEffect(() => {
    if (totalMonthlyPayment > 0 && !userEditedExtra) {
      setExtraPayment(smartDefault(totalMonthlyPayment));
    }
  }, [totalMonthlyPayment, userEditedExtra]);

  const [debouncedExtra, setDebouncedExtra] = useState(extraPayment);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedExtra(extraPayment), 300);
    return () => clearTimeout(timer);
  }, [extraPayment]);

  const extraMonthly = parseCurrencyInput(debouncedExtra);

  const avalancheLoans: AvalancheLoan[] = results.map(r => ({
    balance: r.totalPrincipal,
    annualRate: r.rate,
    monthlyPayment: r.monthlyPayment,
  }));

  const impact = useMemo(() =>
    hasResults
      ? computeAvalancheImpact(avalancheLoans, extraMonthly, maxMonths, totalInterestAll)
      : null,
    [avalancheLoans, extraMonthly, maxMonths, totalInterestAll, hasResults]);

  function updateLoan(index: number, field: keyof Loan, value: string) {
    setLoans(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  }

  const tableRows = results.map(r => ({
    loan: r.name || `Loan`,
    principal: formatCurrency(r.totalPrincipal),
    interest: formatCurrency(r.totalInterest),
    total: formatCurrency(r.totalPaid),
    date: r.payoffDate,
  }));

  const totalsRow = hasResults ? {
    loan: "Total",
    principal: formatCurrency(totalPrincipalAll),
    interest: formatCurrency(totalInterestAll),
    total: formatCurrency(totalPaidAll),
    date: "",
  } : undefined;

  const impactMessage = impact ? (
    <>
      Paying an extra <strong style={{ color: C.text }}>{formatCurrency(extraMonthly)}</strong>/month saves you{" "}
      <strong style={{ color: C.text }}>{formatYears(impact.monthsSaved)}</strong> and{" "}
      <strong style={{ color: C.text }}>{formatCurrency(impact.interestSaved)}</strong> in interest.{" "}
      You'll be debt-free by <strong style={{ color: C.green }}>{impact.newPayoffDate}</strong> instead of{" "}
      {debtFreeDate}.
    </>
  ) : extraMonthly > 0 ? (
    <span style={{ color: C.muted, fontSize: "0.825rem", fontFamily: C.sans }}>
      Try a higher amount to see a meaningful impact.
    </span>
  ) : (
    <span style={{ color: C.muted, fontSize: "0.825rem", fontFamily: C.sans }}>
      Enter at least $25 extra per month to see the impact.
    </span>
  );

  return (
    <PageWrapper>
      <main>
        <ErrorBoundary>
          <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "4rem" }}>

            {/* ── PAGE HEADER ── */}
            <div style={{ marginBottom: "2rem" }}>
              <SectionLabel>🎓 Tools</SectionLabel>
              <h1 style={{
                fontFamily: C.serif,
                fontSize: "clamp(1.6rem, 4vw, 2rem)",
                fontWeight: 700,
                color: C.text,
                lineHeight: 1.1,
                marginTop: 0,
                marginBottom: "0.4rem",
              }}>
                Student Loan Payoff Calculator
              </h1>
              <p style={{ fontSize: "0.9rem", color: C.muted, margin: 0 }}>
                See exactly when you'll be debt-free and how much interest you'll pay — live as you type.
              </p>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="rws-grid-tool" style={{ "--tool-grid-cols": "2fr 3fr", marginBottom: "2.5rem" } as React.CSSProperties}>

              {/* ── LEFT: INPUTS ── */}
              <div>
                <DynamicList
                  items={loans}
                  maxItems={10}
                  onAdd={() => setLoans(prev => [...prev, emptyLoan(prev.length)])}
                  onRemove={i => setLoans(prev => prev.filter((_, idx) => idx !== i))}
                  addLabel="Add another loan"
                  showRemove={false}
                  renderItem={(loan, i) => (
                    <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ ...labelStyle, margin: 0 }}>Loan {i + 1}</p>
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={() => setLoans(prev => prev.filter((_, idx) => idx !== i))}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              color: C.red,
                              fontFamily: C.sans,
                              padding: 0,
                              minHeight: "unset",
                              textDecoration: "underline",
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        <label style={{ fontSize: "0.875rem", fontWeight: 600, color: C.text, fontFamily: C.sans }}>
                          Loan Name <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span>
                        </label>
                        <input
                          type="text"
                          className="rws-text-input"
                          value={loan.name ?? ""}
                          onChange={e => updateLoan(i, "name", e.target.value)}
                          placeholder={`Loan ${i + 1}`}
                        />
                      </div>

                      <MoneyInput
                        label="Remaining Balance"
                        value={loan.balance}
                        onChange={v => updateLoan(i, "balance", v)}
                        placeholder="10000"
                      />

                      <PercentInput
                        label="Interest Rate"
                        hint="Your annual interest rate"
                        value={loan.rate}
                        onChange={v => updateLoan(i, "rate", v)}
                        placeholder="6.5"
                      />

                      {zeroRateWarnings[i] && (
                        <InsightCallout
                          variant="info"
                          icon="💡"
                          message="A 0% interest rate means your full payment goes directly to principal."
                        />
                      )}

                      <MoneyInput
                        label="Minimum Monthly Payment"
                        value={loan.payment}
                        onChange={v => updateLoan(i, "payment", v)}
                        placeholder="200"
                      />

                      {validationErrors[i] && (
                        <InsightCallout
                          variant="warning"
                          icon="⚠️"
                          message={validationErrors[i]!}
                        />
                      )}

                    </div>
                  )}
                />
              </div>

              {/* ── RIGHT: STICKY RESULTS ── */}
              <div className="rws-sticky-panel" style={{ minWidth: 0, overflow: "hidden" }}>
                <ResultsPanel
                  isReady={hasResults}
                  emptyMessage="Enter your loan details on the left to see your payoff plan."
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                    {/* ── ROW 1: 3 stat cards ── */}
                    <div className="rws-grid-3">
                      <StatCard
                        label="Debt-Free Date"
                        value={debtFreeDate}
                        color={C.green}
                      />
                      <StatCard
                        label="Monthly Payment"
                        value={formatCurrency(totalMonthlyPayment)}
                      />
                      <StatCard
                        label="Total Interest"
                        value={formatCurrency(totalInterestAll)}
                        color={C.coral}
                      />
                    </div>

                    {/* ── ROW 2: What if widget ── */}
                    <InsightCallout
                      variant="impact"
                      icon="💡"
                      message={impactMessage}
                      input={
                        <MoneyInput
                          label="What if you paid extra each month?"
                          hint="Applied to your highest-rate loan first using the avalanche method — estimate only"
                          value={extraPayment}
                          onChange={v => {
                            setUserEditedExtra(true);
                            setExtraPayment(v);
                          }}
                          placeholder="100"
                        />
                      }
                    />

                    {/* ── ROW 3: Pie chart ── */}
                    <div className="rws-card-white" style={{ padding: "1.25rem" }}>
                      <p style={{ ...labelStyle, margin: "0 0 0.2rem" }}>Where your money goes</p>
                      <p style={{ fontSize: "0.78rem", color: C.muted, margin: "0 0 1.25rem", fontFamily: C.sans }}>
                        Total across all loans
                      </p>
                      <PieChart
                        data={[
                          { label: "Principal", value: totalPrincipalAll, color: C.green },
                          { label: "Interest", value: totalInterestAll, color: C.coral },
                        ]}
                        centerValue={formatCurrency(totalPaidAll)}
                        centerLabel="Total Paid"
                        size={160}
                        layout="horizontal"
                      />
                    </div>

                    {/* ── ROW 4: Collapsible table ── */}
                    <div style={{ minWidth: 0, width: "100%" }}>
                      <button
                        type="button"
                        aria-expanded={tableOpen}
                        onClick={() => setTableOpen(prev => !prev)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: C.green,
                          fontFamily: C.sans,
                          padding: 0,
                          minHeight: "unset",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          marginBottom: tableOpen ? "1rem" : 0,
                        }}
                      >
                        {tableOpen ? "Hide breakdown ▲" : "See full breakdown ▾"}
                      </button>

                      {tableOpen && (
                        <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                          <BreakdownTable
                            columns={[
                              { key: "loan", label: "Loan Name", align: "left" },
                              { key: "principal", label: "Total Principal", align: "right" },
                              { key: "interest", label: "Total Interest", align: "right" },
                              { key: "total", label: "Total Paid", align: "right" },
                              { key: "date", label: "Payoff Date", align: "right" },
                            ]}
                            rows={tableRows}
                            totalsRow={totalsRow}
                          />
                        </div>
                      )}
                    </div>

                  </div>
                </ResultsPanel>
              </div>

            </div>

            {/* ── BOTTOM CTA ── */}
            <CtaBand
              variant="card"
              headline="Want the full picture?"
              body="The Daily Brief puts market moves in context — and tells you exactly how they affect your debt payoff timeline."
              cta="Get the Daily Brief →"
              href="/daily-brief"
            />

          </div>
        </ErrorBoundary>
      </main>
    </PageWrapper>
  );
}