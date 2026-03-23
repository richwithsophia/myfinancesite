/**
 * app/tools/debt-payoff/page.tsx
 * Debt Payoff Calculator — compares Snowball vs Avalanche methods side by side.
 *
 * Layout: 40/60 side-by-side on desktop (results sticky), stacked on mobile.
 *
 * Results hierarchy:
 *   Banner     — plain-English comparison: avalanche saves $X, snowball wins first payoff in X months
 *   Row 1      — side-by-side stat cards: Avalanche (left) vs Snowball (right)
 *                each showing Debt-Free Date, Total Interest, Time to Payoff, First Debt Gone
 *   Toggle     — switches pie + table between Avalanche and Snowball (defaults to Avalanche)
 *   Row 2      — Pie chart reflecting selected method (interest vs principal)
 *   Row 3      — Collapsible breakdown table reflecting selected method
 *
 * Edge cases handled:
 *   - Identical rates → snowball recommended, banner copy adjusted
 *   - Payment doesn't cover interest → validation error surfaced per debt
 *   - 0% interest rate → info callout, full payment goes to principal
 *
 * Session storage key: "debt-payoff:debts"
 * Extra payment: not implemented in v1 — planned fast follow
 * PayoffTimeline: not implemented in v1 — planned fast follow
 */

"use client";

import { useState, useMemo } from "react";
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
    calculatePayoffDate,
    formatCurrency,
    formatYears,
    computeDebtComparison,
    type DebtInput,
    type DebtStrategy,
} from "../../lib/calculators";
import { isValidRate, isValidBalance, isValidPayment } from "../../lib/validators";


// ─── TYPES ─────────────────────────────────────────────────────────────────────

type ToggleStrategy = DebtStrategy;

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function emptyDebt(index: number): DebtInput {
    if (index === 0) {
        return { name: "Debt 1", balance: "5000", rate: "19.99", payment: "150" };
    }
    return { name: `Debt ${index + 1}`, balance: "", rate: "", payment: "" };
}

function validateDebt(debt: DebtInput): string | null {
    if (!isValidBalance(debt.balance)) return null;
    if (!isValidRate(debt.rate)) return null;
    const balance = parseCurrencyInput(debt.balance);
    const rate = parseFloat(debt.rate);
    const payment = parseCurrencyInput(debt.payment);
    if (payment <= 0) return null;
    if (!isValidPayment(payment, balance, rate)) {
        return `${debt.name || "This debt"}'s payment doesn't cover the monthly interest. It will never pay off.`;
    }
    return "valid";
}

// ─── COMPONENT ─────────────────────────────────────────────────────────────────

export default function DebtPayoffCalculator() {
    const [debts, setDebts] = useSessionState<DebtInput[]>("debt-payoff:debts", [emptyDebt(0)]);
    const [tableOpen, setTableOpen] = useState(false);
    const [activeToggle, setActiveToggle] = useState<ToggleStrategy>("avalanche");
    const [extraPayment, setExtraPayment] = useSessionState<string>("debt-payoff:extraPayment", "100");

    // ── VALIDATION ──
    const validationErrors = useMemo(() => debts.map(debt => {
        const v = validateDebt(debt);
        if (v === null || v === "valid") return null;
        return v;
    }), [debts]);

    const zeroRateWarnings = useMemo(() => debts.map(debt => {
        if (!debt.rate) return false;
        return parseFloat(debt.rate) === 0 && isValidBalance(debt.balance);
    }), [debts]);

    // ── COMPUTATION ──
    const comparison = useMemo(() => {
        const extra = extraPayment === "" ? 100 : parseCurrencyInput(extraPayment);
        return computeDebtComparison(debts, extra);
    }, [debts, extraPayment]);

    const hasResults = comparison !== null;

    // Active method data for pie + table
    const activeResult = hasResults
        ? (activeToggle === "avalanche" ? comparison.avalanche : comparison.snowball)
        : null;

    // ── BANNER COPY ──
    const bannerMessage = useMemo(() => {
        if (!comparison) return "";

        const { avalanche, snowball, interestDelta, firstWinDelta } = comparison;

        const interestLine = interestDelta > 0
            ? `Avalanche saves you ${formatCurrency(interestDelta)} in interest.`
            : interestDelta < 0
                ? `Snowball saves you ${formatCurrency(Math.abs(interestDelta))} in interest.`
                : `Both methods cost the same in total interest.`;

        const firstWinLine = firstWinDelta > 0
            ? `Snowball pays off ${snowball.firstPayoffName} ${formatYears(firstWinDelta)} sooner.`
            : firstWinDelta < 0
                ? `Avalanche pays off ${avalanche.firstPayoffName} ${formatYears(Math.abs(firstWinDelta))} sooner.`
                : `Both methods pay off your first debt at the same time.`;

        return `${interestLine} ${firstWinLine}`;
    }, [comparison]);

    // ── HANDLERS ──
    function updateDebt(index: number, field: keyof DebtInput, value: string) {
        setDebts(prev => prev.map((d, i) => i === index ? { ...d, [field]: value } : d));
    }

    // ── TABLE ROWS ──
    const tableRows = useMemo(() => {
        if (!activeResult) return [];
        return activeResult.debts.map(d => ({
            name: d.name,
            total: formatCurrency(d.totalPaid),
            interest: formatCurrency(d.totalInterest),
            months: formatYears(d.months),
            date: d.payoffDate,
        }));
    }, [activeResult]);

    const totalsRow = useMemo(() => {
        if (!activeResult) return undefined;
        return {
            name: "Total",
            total: formatCurrency(activeResult.totalPaid),
            interest: formatCurrency(activeResult.totalInterest),
            months: formatYears(activeResult.totalMonths),
            date: activeResult.debtFreeDate,
        };
    }, [activeResult]);

    // ─── RENDER ────────────────────────────────────────────────────────────────

    return (
        <PageWrapper>
            <main>
                <ErrorBoundary>
                    <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "4rem" }}>

                        {/* ── PAGE HEADER ── */}
                        <div style={{ marginBottom: "2rem" }}>
                            <SectionLabel>💳 Tools</SectionLabel>
                            <h1 style={{
                                fontFamily: C.serif,
                                fontSize: "clamp(1.6rem, 4vw, 2rem)",
                                fontWeight: 700,
                                color: C.text,
                                lineHeight: 1.1,
                                marginTop: 0,
                                marginBottom: "0.4rem",
                            }}>
                                Debt Payoff Calculator
                            </h1>
                            <p style={{ fontSize: "0.9rem", color: C.muted, margin: 0 }}>
                                Compare two proven payoff strategies side by side — see which saves you more money and which gets you your first win faster.
                            </p>
                        </div>

                        {/* ── MAIN GRID ── */}
                        <div className="rws-grid-tool" style={{ "--tool-grid-cols": "2fr 3fr", marginBottom: "2.5rem" } as React.CSSProperties}>

                            {/* ── LEFT: INPUTS ── */}
                            <div>

                                {/* Explainer callout */}
                                <div style={{ marginBottom: "1.25rem" }}>
                                    <InsightCallout
                                        variant="info"
                                        icon="💡"
                                        message="Avalanche: pay highest interest first — saves the most money. Snowball: pay smallest balance first — builds momentum with quick wins. Enter your debts below to see which works better for you."
                                    />
                                </div>

                                <DynamicList
                                    items={debts}
                                    maxItems={10}
                                    onAdd={() => setDebts(prev => [...prev, emptyDebt(prev.length)])}
                                    onRemove={i => setDebts(prev => prev.filter((_, idx) => idx !== i))}
                                    addLabel="Add another debt"
                                    showRemove={false}
                                    renderItem={(debt, i) => (
                                        <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <p style={{ ...labelStyle, margin: 0 }}>Debt {i + 1}</p>
                                                {i > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDebts(prev => prev.filter((_, idx) => idx !== i))}
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
                                                    Debt Name <span style={{ color: C.muted, fontWeight: 400 }}>(optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="rws-text-input"
                                                    value={debt.name ?? ""}
                                                    onChange={e => updateDebt(i, "name", e.target.value)}
                                                    placeholder={`Debt ${i + 1}`}
                                                />
                                            </div>

                                            <MoneyInput
                                                label="Remaining Balance"
                                                value={debt.balance}
                                                onChange={v => updateDebt(i, "balance", v)}
                                                placeholder="5000"
                                            />

                                            <PercentInput
                                                label="Interest Rate"
                                                hint="Your annual interest rate"
                                                value={debt.rate}
                                                onChange={v => updateDebt(i, "rate", v)}
                                                placeholder="19.99"
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
                                                value={debt.payment}
                                                onChange={v => updateDebt(i, "payment", v)}
                                                placeholder="150"
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
                                {/* ── EXTRA PAYMENT ── */}
                               <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.25rem" }}>
                                    <MoneyInput
                                        label="Extra monthly payment"
                                        hint="Amount above your minimums directed at your target debt each month. Defaults to $100."
                                        value={extraPayment}
                                        onChange={setExtraPayment}
                                        placeholder="100"
                                    />
                                    <InsightCallout
                                        variant="info"
                                        icon="💡"
                                        message="This is money beyond your minimums you commit to debt payoff each month. When a debt is eliminated, its payment rolls into the next target automatically."
                                    />
                                </div>
                            </div>

                            {/* ── RIGHT: STICKY RESULTS ── */}
                            <div className="rws-sticky-panel" style={{ minWidth: 0, overflow: "hidden" }}>
                                <ResultsPanel
                                    isReady={hasResults}
                                    emptyMessage="Enter your debts on the left to see your personalized payoff comparison. Avalanche minimizes total interest. Snowball builds momentum with quick wins."
                                >
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                                        {/* ── BANNER ── */}
                                        <InsightCallout
                                            variant="info"
                                            icon="📊"
                                            message={bannerMessage}
                                        />

                                        {/* ── SIDE BY SIDE STAT CARDS ── */}
                                        {comparison && (
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

                                                {/* Avalanche column */}
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                                    <p style={{ ...labelStyle, margin: 0, textAlign: "center" }}>
                                                        📉 Avalanche
                                                    </p>
                                                    <StatCard
                                                        label="Debt-Free Date"
                                                        value={comparison.avalanche.debtFreeDate}
                                                        color={C.green}
                                                    />
                                                    <StatCard
                                                        label="Total Interest"
                                                        value={formatCurrency(comparison.avalanche.totalInterest)}
                                                        color={C.coral}
                                                    />
                                                    <StatCard
                                                        label="Time to Payoff"
                                                        value={formatYears(comparison.avalanche.totalMonths)}
                                                    />
                                                    <StatCard
                                                        label="First Debt Gone"
                                                        value={`${comparison.avalanche.firstPayoffName} in ${formatYears(comparison.avalanche.firstPayoffMonths)}`}
                                                    />
                                                </div>

                                                {/* Snowball column */}
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                                    <p style={{ ...labelStyle, margin: 0, textAlign: "center" }}>
                                                        ⛄ Snowball
                                                    </p>
                                                    <StatCard
                                                        label="Debt-Free Date"
                                                        value={comparison.snowball.debtFreeDate}
                                                        color={C.green}
                                                    />
                                                    <StatCard
                                                        label="Total Interest"
                                                        value={formatCurrency(comparison.snowball.totalInterest)}
                                                        color={C.coral}
                                                    />
                                                    <StatCard
                                                        label="Time to Payoff"
                                                        value={formatYears(comparison.snowball.totalMonths)}
                                                    />
                                                    <StatCard
                                                        label="First Debt Gone"
                                                        value={`${comparison.snowball.firstPayoffName} in ${formatYears(comparison.snowball.firstPayoffMonths)}`}
                                                    />
                                                </div>

                                            </div>
                                        )}

                                        {/* ── METHOD TOGGLE ── */}
                                        <div>
                                            <p style={{ ...labelStyle, margin: "0 0 0.625rem" }}>View details by method</p>
                                            <div style={{
                                                display: "inline-flex",
                                                borderRadius: "9999px",
                                                border: `1px solid ${C.border}`,
                                                overflow: "hidden",
                                                backgroundColor: C.card,
                                            }}>
                                                {(["avalanche", "snowball"] as ToggleStrategy[]).map(strategy => (
                                                    <button
                                                        key={strategy}
                                                        type="button"
                                                        onClick={() => setActiveToggle(strategy)}
                                                        style={{
                                                            padding: "0.4rem 1.1rem",
                                                            fontSize: "0.8rem",
                                                            fontWeight: 600,
                                                            fontFamily: C.sans,
                                                            border: "none",
                                                            cursor: "pointer",
                                                            borderRadius: "9999px",
                                                            transition: "all 0.15s",
                                                            backgroundColor: activeToggle === strategy ? C.green : "transparent",
                                                            color: activeToggle === strategy ? "#fff" : C.muted,
                                                        }}
                                                    >
                                                        {strategy === "avalanche" ? "📉 Avalanche" : "⛄ Snowball"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* ── PIE CHART ── */}
                                        {activeResult && (
                                            <div className="rws-card-white" style={{ padding: "1.25rem" }}>
                                                <p style={{ ...labelStyle, margin: "0 0 0.2rem" }}>Where your money goes</p>
                                                <p style={{ fontSize: "0.78rem", color: C.muted, margin: "0 0 1.25rem", fontFamily: C.sans }}>
                                                    {activeToggle === "avalanche" ? "Avalanche method" : "Snowball method"} — total across all debts
                                                </p>
                                                <PieChart
                                                    data={[
                                                        {
                                                            label: "Principal",
                                                            value: activeResult.debts.reduce((s, d) => s + d.balance, 0),
                                                            color: C.green,
                                                        },
                                                        {
                                                            label: "Interest",
                                                            value: activeResult.totalInterest,
                                                            color: C.coral,
                                                        },
                                                    ]}
                                                    centerValue={formatCurrency(activeResult.totalPaid)}
                                                    centerLabel="Total Paid"
                                                    size={160}
                                                    layout="horizontal"
                                                />
                                            </div>
                                        )}

                                        {/* ── COLLAPSIBLE TABLE ── */}
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

                                            {tableOpen && activeResult && (
                                                <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}>
                                                    <BreakdownTable
                                                        columns={[
                                                            { key: "name", label: "Debt", align: "left" },
                                                            { key: "total", label: "Total Paid", align: "right" },
                                                            { key: "interest", label: "Total Interest", align: "right" },
                                                            { key: "months", label: "Time to Payoff", align: "right" },
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
                            headline="Know your numbers. Now grow them."
                            body="The Daily Brief explains how rate changes and market moves affect your debt payoff timeline — in plain English, every weekday."
                            cta="Get the Daily Brief →"
                            href="/daily-brief"
                        />

                    </div>
                </ErrorBoundary>
            </main>
        </PageWrapper>
    );
}