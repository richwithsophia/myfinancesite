/**
 * app/test/page.tsx
 * Visual test page for all Goal 0B shared UI components.
 * DELETE THIS FILE before committing Goal 0B.
 */

"use client";

import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import {
  MoneyInput,
  PercentInput,
  SelectInput,
  ToggleInput,
  StatCard,
  PieChart,
  BreakdownTable,
  InsightCallout,
  ResultsPanel,
  DynamicList,
} from "../components/ui";
import { C } from "../lib/brand";

export default function TestPage() {
  // Input state
  const [money, setMoney]         = useState("");
  const [percent, setPercent]     = useState("");
  const [select, setSelect]       = useState("30");
  const [toggleVal, setToggleVal] = useState("");
  const [toggleMode, setToggleMode] = useState<"dollar" | "percent">("percent");

  // DynamicList state
  const [items, setItems] = useState(["Loan 1", "Loan 2"]);

  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "4rem" }}>

          <h1 style={{ fontFamily: C.serif, fontSize: "2rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem" }}>
            Component Test Page
          </h1>
          <p style={{ color: C.muted, fontSize: "0.9rem", marginBottom: "3rem" }}>
            DELETE this page before committing Goal 0B.
          </p>

          {/* ── INPUTS ── */}
          <Section title="Inputs">
            <div className="rws-grid-2">
              <MoneyInput
                label="Remaining Balance"
                hint="Enter your current loan balance"
                value={money}
                onChange={setMoney}
                placeholder="50000"
              />
              <MoneyInput
                label="Disabled Input"
                hint="This input is disabled"
                value="25000"
                onChange={() => {}}
                disabled
              />
              <PercentInput
                label="Interest Rate"
                hint="Your annual interest rate"
                value={percent}
                onChange={setPercent}
                placeholder="6.5"
              />
              <SelectInput
                label="Loan Type"
                hint="Select your loan term"
                value={select}
                onChange={setSelect}
                options={[
                  { label: "30Y Fixed", value: "30" },
                  { label: "15Y Fixed", value: "15" },
                ]}
              />
              <ToggleInput
                label="Down Payment"
                hint="Switch between dollar and percent"
                value={toggleVal}
                onChange={setToggleVal}
                mode={toggleMode}
                onModeChange={setToggleMode}
              />
            </div>

            {/* Live values */}
            <div style={{ marginTop: "1rem", padding: "1rem", backgroundColor: C.card, borderRadius: "0.75rem", fontSize: "0.8rem", color: C.muted, fontFamily: C.sans }}>
              <strong>Live values:</strong> money="{money}" | percent="{percent}" | select="{select}" | toggle="{toggleVal}" ({toggleMode})
            </div>
          </Section>

          {/* ── STAT CARDS ── */}
          <Section title="StatCard">
            <div className="rws-grid-3">
              <StatCard label="Debt-Free Date" value="June 2031" />
              <StatCard label="Time to Payoff" value="5 years and 2 months" subtext="Based on current payments" />
              <StatCard label="Total Interest" value="$12,400" subtext="At current rate" color={C.coral} />
            </div>
          </Section>

          {/* ── PIE CHART ── */}
          <Section title="PieChart">
            <div className="rws-grid-2">
              {/* 2 slices */}
              <div className="rws-card-white">
                <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "1rem" }}>2 slices (student loan)</p>
                <PieChart
                  data={[
                    { label: "Principal", value: 20000, color: C.green },
                    { label: "Interest",  value: 4800,  color: C.coral },
                  ]}
                  centerValue="$24,800"
                />
              </div>

              {/* 4 slices — one zero value (should be hidden) */}
              <div className="rws-card-white">
                <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "1rem" }}>4 slices, 1 zero (zero should be hidden)</p>
                <PieChart
                  data={[
                    { label: "Principal",  value: 1800, color: C.green },
                    { label: "Interest",   value: 620,  color: C.coral },
                    { label: "Tax",        value: 350,  color: C.amber },
                    { label: "HOA",        value: 0,    color: C.muted },
                  ]}
                  centerValue="$2,770"
                  centerLabel="Monthly"
                />
              </div>

              {/* Single slice — full circle edge case */}
              <div className="rws-card-white">
                <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "1rem" }}>1 slice (full circle edge case)</p>
                <PieChart
                  data={[
                    { label: "Principal", value: 5000, color: C.green },
                  ]}
                  centerValue="$5,000"
                />
              </div>

              {/* All zero — should render nothing */}
              <div className="rws-card-white">
                <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "1rem" }}>All zero — should render nothing</p>
                <PieChart
                  data={[
                    { label: "Principal", value: 0, color: C.green },
                    { label: "Interest",  value: 0, color: C.coral },
                  ]}
                  centerValue="$0"
                />
                <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: "0.5rem" }}>(nothing above = correct)</p>
              </div>
            </div>
          </Section>

          {/* ── BREAKDOWN TABLE ── */}
          <Section title="BreakdownTable">

            {/* Student loan layout */}
            <p style={{ color: C.muted, fontSize: "0.8rem", marginBottom: "0.75rem", fontFamily: C.sans }}>
              Student loan layout — one row per loan:
            </p>
            <BreakdownTable
              columns={[
                { key: "loan",      label: "Loan Name",            align: "left"  },
                { key: "payment",   label: "Monthly Payment",      align: "right" },
                { key: "principal", label: "Total Principal Paid",  align: "right" },
                { key: "interest",  label: "Total Interest Paid",   align: "right" },
                { key: "total",     label: "Total Amount Paid",     align: "right" },
                { key: "date",      label: "Payoff Date",           align: "right" },
              ]}
              rows={[
                { loan: "Sallie Mae",  payment: "$450", principal: "$18,400", interest: "$3,200", total: "$21,600", date: "June 2027"  },
                { loan: "Navient",     payment: "$280", principal: "$12,000", interest: "$5,100", total: "$17,100", date: "March 2029" },
                { loan: "Great Lakes", payment: "$190", principal: "$6,200",  interest: "$1,800", total: "$8,000",  date: "Jan 2028"   },
              ]}
              totalsRow={{ loan: "Total", payment: "$920", principal: "$36,600", interest: "$10,100", total: "$46,700", date: "" }}
            />

            {/* Mortgage amortization layout */}
            <p style={{ color: C.muted, fontSize: "0.8rem", margin: "2rem 0 0.75rem", fontFamily: C.sans }}>
              Mortgage amortization layout — year by year:
            </p>
            <BreakdownTable
              columns={[
                { key: "year",      label: "Year",              align: "left"  },
                { key: "beginning", label: "Beginning Balance", align: "right" },
                { key: "interest",  label: "Interest Paid",     align: "right" },
                { key: "principal", label: "Principal Paid",    align: "right" },
                { key: "ending",    label: "Ending Balance",    align: "right" },
              ]}
              rows={[
                { year: "2025", beginning: "$400,000", interest: "$26,800", principal: "$5,400", ending: "$394,600" },
                { year: "2026", beginning: "$394,600", interest: "$26,430", principal: "$5,770", ending: "$388,830" },
                { year: "2027", beginning: "$388,830", interest: "$26,040", principal: "$6,160", ending: "$382,670" },
              ]}
              totalsRow={{ year: "Lifetime", beginning: "", interest: "$312,000", principal: "$400,000", ending: "$0" }}
            />

          </Section>

          {/* ── INSIGHT CALLOUT ── */}
          <Section title="InsightCallout">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <InsightCallout
                variant="info"
                message="Extra payments are applied to the highest interest rate loan first (avalanche method). This minimizes the total interest you pay over time."
              />
              <InsightCallout
                variant="warning"
                message="Putting less than 20% down typically requires PMI (Private Mortgage Insurance), which isn't included in this estimate."
              />
              <InsightCallout
                variant="info"
                icon="💡"
                message="Custom icon example — you can override the default 📌 with any emoji."
              />
            </div>
          </Section>

          {/* ── RESULTS PANEL ── */}
          <Section title="ResultsPanel">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p style={{ color: C.muted, fontSize: "0.8rem", margin: 0 }}>Empty state (isReady=false):</p>
              <ResultsPanel isReady={false} />

              <p style={{ color: C.muted, fontSize: "0.8rem", margin: 0 }}>Custom empty message:</p>
              <ResultsPanel isReady={false} emptyMessage="Enter your loan details above to see your payoff plan." />

              <p style={{ color: C.muted, fontSize: "0.8rem", margin: 0 }}>Ready state (isReady=true):</p>
              <ResultsPanel isReady={true}>
                <StatCard label="Debt-Free Date" value="June 2031" subtext="Based on current inputs" />
              </ResultsPanel>
            </div>
          </Section>

          {/* ── DYNAMIC LIST ── */}
          <Section title="DynamicList">
            <DynamicList
              items={items}
              maxItems={4}
              onAdd={() => setItems(prev => [...prev, `Loan ${prev.length + 1}`])}
              onRemove={i => setItems(prev => prev.filter((_, idx) => idx !== i))}
              addLabel="Add another loan"
              renderItem={(item, i) => (
                <div className="rws-card" style={{ padding: "1rem" }}>
                  <p style={{ margin: 0, fontFamily: C.sans, fontSize: "0.875rem", color: C.text }}>
                    Item {i + 1}: <strong>{item}</strong>
                  </p>
                </div>
              )}
            />
            <p style={{ color: C.muted, fontSize: "0.8rem", marginTop: "0.5rem" }}>
              Max 4 items. Add button disappears at 4. First item has no Remove link.
            </p>
          </Section>

        </div>
      </main>
    </PageWrapper>
  );
}

// ─── LOCAL SECTION WRAPPER ─────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
        <h2 style={{ fontFamily: C.serif, fontSize: "1.25rem", fontWeight: 700, color: C.text, margin: 0 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 1, backgroundColor: C.border }} />
      </div>
      {children}
    </div>
  );
}