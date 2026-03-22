/**
 * app/tools/mortgage/page.tsx
 * Mortgage Calculator.
 * Layout: 40/60 side-by-side on desktop (results sticky), stacked on mobile.
 *
 * Results hierarchy:
 *   Row 1 — 3 stat cards: Total Principal, Total Interest, Total Paid
 *   Row 2 — Pie chart: monthly payment breakdown by component
 *   Row 3 — Amortization table: collapsible, yearly by default, toggle to monthly
 */

"use client";

import { useState, useMemo } from "react";
import PageWrapper from "../../components/PageWrapper";
import {
  SectionLabel,
  CtaBand,
  MoneyInput,
  PercentInput,
  SelectInput,
  ToggleInput,
  StatCard,
  PieChart,
  BreakdownTable,
  InsightCallout,
  ResultsPanel,
} from "../../components/ui";
import { C, labelStyle } from "../../lib/brand";
import {
  parseCurrencyInput,
  sanitizeCurrencyInput,
  calculateAmortization,
  formatCurrency,
  formatCurrencyCompact,
  calculateTotalInterest,
} from "../../lib/calculators";

// ─── HELPERS ───────────────────────────────────────────────────────────────────

/**
 * Converts an annual dollar or percent value to a monthly dollar amount.
 */
function toMonthlyDollar(value: string, mode: "dollar" | "percent", homeValue: number): number {
  const n = parseCurrencyInput(value);
  if (!n) return 0;
  if (mode === "dollar") return n / 12;
  return (homeValue * (n / 100)) / 12;
}

/**
 * Builds year-by-year amortization summary from monthly schedule.
 * Uses 1-based year numbers (1, 2, 3...) as the period key.
 * Filters out any trailing zero-balance rows.
 */
function buildYearlySchedule(schedule: ReturnType<typeof calculateAmortization>) {
  // Filter out trailing zero rows
  const valid = schedule.filter(r => r.beginningBalance > 0);

  const years: Record<string, string>[] = [];
  let yearNum = 1;
  let i       = 0;

  while (i < valid.length) {
    const chunk     = valid.slice(i, i + 12);
    const first     = chunk[0];
    const last      = chunk[chunk.length - 1];
    const interest  = chunk.reduce((s, r) => s + r.interestPaid,  0);
    const principal = chunk.reduce((s, r) => s + r.principalPaid, 0);

    years.push({
      period:    String(yearNum),
      beginning: formatCurrency(first.beginningBalance),
      interest:  formatCurrency(interest),
      principal: formatCurrency(principal),
      ending:    formatCurrency(last.endingBalance),
    });

    i += 12;
    yearNum++;
  }

  return years;
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function MortgageCalculator() {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  const [homeValue,   setHomeValue]   = useState("400000");
  const [downPayment, setDownPayment] = useState("20");
  const [downMode,    setDownMode]    = useState<"dollar" | "percent">("percent");
  const [loanType,    setLoanType]    = useState("30");
  const [rate,        setRate]        = useState("6.8");
  const [taxValue,    setTaxValue]    = useState("1.2");
  const [taxMode,     setTaxMode]     = useState<"dollar" | "percent">("percent");
  const [insurance,   setInsurance]   = useState("1500");
  const [hoa,         setHoa]         = useState("");
const [pmiRate,     setPmiRate]     = useState("1");
  const [tableOpen,   setTableOpen]   = useState(false);
  const [tableView,   setTableView]   = useState<"yearly" | "monthly">("yearly");

  // ── Derived values ──────────────────────────────────────────────────────────
  const homeVal    = parseCurrencyInput(homeValue);
  const termYears  = parseInt(loanType);
  const annualRate = parseFloat(rate) || 0;

  const downDollars = useMemo(() => {
    const n = parseCurrencyInput(downPayment);
    if (!n) return 0;
    if (downMode === "dollar") return n;
    return homeVal * (n / 100);
  }, [downPayment, downMode, homeVal]);

  const downPercent = homeVal > 0 ? (downDollars / homeVal) * 100 : 0;
  const loanAmount  = Math.max(0, homeVal - downDollars);
  const showPMI = downPercent < 20 && homeVal > 0 && loanAmount > 0;

  const monthlyTax       = toMonthlyDollar(taxValue, taxMode, homeVal);
  const monthlyPMI       = showPMI ? (loanAmount * (parseFloat(pmiRate) || 0) / 100) / 12 : 0;
  const monthlyInsurance = parseCurrencyInput(insurance) / 12;
  const monthlyHoa       = parseCurrencyInput(hoa);
  const monthlyRate      = annualRate / 100 / 12;
  const termMonths       = termYears * 12;

  const monthlyPI = useMemo(() => {
    if (!loanAmount || !annualRate) return 0;
    if (annualRate === 0) return loanAmount / termMonths;
    return loanAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }, [loanAmount, annualRate, monthlyRate, termMonths]);

  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHoa + monthlyPMI;

  const schedule = useMemo(() => {
    if (!loanAmount || !monthlyPI) return [];
    return calculateAmortization(loanAmount, annualRate, monthlyPI);
  }, [loanAmount, annualRate, monthlyPI]);

  const totalInterest = useMemo(() => calculateTotalInterest(schedule), [schedule]);
  const hasResults    = loanAmount > 0 && monthlyPI > 0;

  // ── Table data ──────────────────────────────────────────────────────────────
  const yearlyRows = useMemo(() => buildYearlySchedule(schedule), [schedule]);

  const monthlyRows = useMemo(() =>
    schedule
      .filter(r => r.beginningBalance > 0)
      .map(r => ({
        period:    String(r.month),
        beginning: formatCurrency(r.beginningBalance),
        interest:  formatCurrency(r.interestPaid),
        principal: formatCurrency(r.principalPaid),
        ending:    formatCurrency(r.endingBalance),
      })),
  [schedule]);

  const tableRows   = tableView === "yearly" ? yearlyRows : monthlyRows;
  const periodLabel = tableView === "yearly" ? "Year" : "Month";

  const totalsRow = hasResults ? {
    period:    "Lifetime",
    beginning: "",
    interest:  formatCurrency(totalInterest),
    principal: formatCurrency(loanAmount),
    ending:    "$0",
  } : undefined;

  // ── Pie chart ───────────────────────────────────────────────────────────────
const pieData = [
  { label: "Principal & Interest", value: Math.round(monthlyPI),        color: C.green   },
  { label: "PMI",                  value: Math.round(monthlyPMI),        color: C.red     },
  { label: "Property Tax",         value: Math.round(monthlyTax),        color: C.amber   },
  { label: "Insurance",            value: Math.round(monthlyInsurance),  color: "#9CA3AF" },
  { label: "HOA",                  value: Math.round(monthlyHoa),        color: C.muted   },
].filter(d => d.value > 0);

  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "4rem" }}>

          {/* ── PAGE HEADER ── */}
          <div style={{ marginBottom: "2rem" }}>
            <SectionLabel>🏠 Tools</SectionLabel>
            <h1 style={{
              fontFamily: C.serif,
              fontSize: "clamp(1.6rem, 4vw, 2rem)",
              fontWeight: 700,
              color: C.text,
              lineHeight: 1.1,
              marginTop: 0,
              marginBottom: "0.4rem",
            }}>
              Mortgage Calculator
            </h1>
            <p style={{ fontSize: "0.9rem", color: C.muted, margin: 0 }}>
              See your full monthly payment breakdown and exactly how much you'll pay over the life of your loan.
            </p>
          </div>

          {/* ── MAIN GRID ── */}
          <div
            className="rws-grid-tool"
            style={{ "--tool-grid-cols": "2fr 3fr", marginBottom: "2.5rem" } as React.CSSProperties}
          >

            {/* ── LEFT: INPUTS ── */}
            <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              <p style={{ ...labelStyle, margin: 0 }}>Loan Details</p>

              <MoneyInput
                label="Home Value"
                value={homeValue}
                onChange={setHomeValue}
                placeholder="400000"
              />

              <ToggleInput
                label="Down Payment"
                value={downPayment}
                onChange={v => setDownPayment(sanitizeCurrencyInput(v))}
                mode={downMode}
                onModeChange={mode => {
                  setDownMode(mode);
                  setDownPayment("");
                }}
              />

              {showPMI && (
  <>
    <PercentInput
      label="PMI Rate"
      hint="Lenders typically charge 0.5%–1.5%. We've assumed 1% — adjust if you know your rate."
      value={pmiRate}
      onChange={setPmiRate}
      placeholder="1"
    />
    <InsightCallout
      variant="warning"
      message="Putting less than 20% down typically requires PMI. The estimate above assumes a 1% annual rate — adjust if you know your rate."
    />
  </>
)}

              <SelectInput
                label="Loan Type"
                value={loanType}
                onChange={setLoanType}
                options={[
                  { label: "30-Year Fixed", value: "30" },
                  { label: "15-Year Fixed", value: "15" },
                ]}
              />

              <PercentInput
                label="Interest Rate"
                hint="Your annual interest rate"
                value={rate}
                onChange={setRate}
                placeholder="6.8"
              />

              <hr className="rws-divider" style={{ margin: "0.25rem 0" }} />

              <p style={{ ...labelStyle, margin: 0 }}>Monthly Costs</p>

              <ToggleInput
                label="Property Tax"
                hint="Annual amount or rate"
                value={taxValue}
                onChange={v => setTaxValue(sanitizeCurrencyInput(v))}
                mode={taxMode}
                onModeChange={mode => {
                  setTaxMode(mode);
                  setTaxValue("");
                }}
              />

              <MoneyInput
                label="Homeowner's Insurance"
                hint="Annual premium"
                value={insurance}
                onChange={setInsurance}
                placeholder="1500"
              />

              <MoneyInput
                label="HOA Dues"
                hint="Monthly amount"
                value={hoa}
                onChange={setHoa}
                placeholder="0"
              />

            </div>

            {/* ── RIGHT: STICKY RESULTS ── */}
            <div className="rws-sticky-panel" style={{ minWidth: 0, overflow: "hidden" }}>
              <ResultsPanel
                isReady={hasResults}
                emptyMessage="Enter your loan details on the left to see your payment breakdown."
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  {/* ── ROW 1: 3 stat cards ── */}
                  <div className="rws-grid-3">
                    <StatCard
  label="Total Principal"
  value={formatCurrencyCompact(loanAmount)}
/>
<StatCard
  label="Total Interest"
  value={formatCurrencyCompact(totalInterest)}
  color={C.coral}
/>
<StatCard
  label="Total Paid"
  value={formatCurrencyCompact(loanAmount + totalInterest)}
/>
                  </div>

                  {/* ── ROW 2: Pie chart ── */}
                  <div className="rws-card-white" style={{ padding: "1.25rem" }}>
                    <p style={{ ...labelStyle, margin: "0 0 0.2rem" }}>Monthly Payment Breakdown</p>
                    <p style={{ fontSize: "0.78rem", color: C.muted, margin: "0 0 1.25rem", fontFamily: C.sans }}>
                      Where your monthly payment goes
                    </p>
                    <PieChart
                      data={pieData}
                      centerValue={formatCurrency(totalMonthly)}
                      centerLabel="Per Month"
                      size={160}
                      layout="horizontal"
                    />
                  </div>

                  {/* ── ROW 3: Collapsible amortization table ── */}
                  <div style={{ minWidth: 0, width: "100%" }}>

                    {/* Table header row */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: tableOpen ? "1rem" : 0,
                    }}>
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
                        }}
                      >
                        {tableOpen ? "Hide amortization ▲" : "See amortization schedule ▾"}
                      </button>

                      {/* Yearly / Monthly toggle — only when open */}
                      {tableOpen && (
                        <div style={{
                          display: "flex",
                          border: `1.5px solid ${C.border}`,
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                        }}>
                          {(["yearly", "monthly"] as const).map(v => (
                            <button
                              key={v}
                              type="button"
                              onClick={() => setTableView(v)}
                              style={{
                                padding: "0.2rem 0.75rem",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                fontFamily: C.sans,
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: tableView === v ? C.green : C.white,
                                color: tableView === v ? "#fff" : C.muted,
                                transition: "background-color 0.15s ease, color 0.15s ease",
                                minHeight: "unset",
                              }}
                            >
                              {v === "yearly" ? "Yearly" : "Monthly"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Scrollable table container */}
                    {tableOpen && (
                      <div style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                        overflowX: "auto",
                      }}>
                        <BreakdownTable
                          columns={[
                            { key: "period",    label: periodLabel,         align: "left"  },
                            { key: "beginning", label: "Beg. Balance", align: "right" },
                            { key: "interest",  label: "Interest Paid",     align: "right" },
                            { key: "principal", label: "Principal Paid",    align: "right" },
                            { key: "ending",    label: "End. Balance",    align: "right" },
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
            headline="Know your numbers before you buy."
            body="The Daily Brief breaks down how rate changes and market moves affect your mortgage — in plain English."
            cta="Get the Daily Brief →"
            href="/daily-brief"
          />

        </div>
      </main>
    </PageWrapper>
  );
}