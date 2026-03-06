"use client";

import { useState, useMemo } from "react";
import PageWrapper from "../../components/PageWrapper";
import { SectionLabel } from "../../components/ui";
import { C, labelStyle } from "../../lib/brand";

type Field = { id: string; label: string; hint: string };

const ASSET_FIELDS: Field[] = [
  { id: "checking",    label: "Checking & Savings",    hint: "Cash in bank accounts — checking, savings, money market, CDs." },
  { id: "investments", label: "Investment Accounts",   hint: "Brokerage accounts, stocks, ETFs, mutual funds outside retirement." },
  { id: "retirement",  label: "Retirement (401k/IRA)", hint: "401(k), Roth IRA, Traditional IRA, or any pension balance." },
  { id: "home",        label: "Home Value",            hint: "Estimated market value — check Zillow or Redfin." },
  { id: "car",         label: "Car Value",             hint: "Current resale value. Use Kelley Blue Book (kbb.com)." },
  { id: "otherAssets", label: "Other Assets",          hint: "Crypto, jewelry, business ownership, or anything else of value." },
];

const LIABILITY_FIELDS: Field[] = [
  { id: "studentLoans", label: "Student Loans",    hint: "Total remaining balance — federal and private combined." },
  { id: "creditCards",  label: "Credit Card Debt", hint: "Outstanding balances across all cards — not your limit." },
  { id: "mortgage",     label: "Mortgage",         hint: "Remaining balance on your home loan." },
  { id: "carLoan",      label: "Car Loan",         hint: "Remaining auto loan balance. Paid off? Enter $0." },
  { id: "otherDebt",    label: "Other Debt",       hint: "Personal loans, medical debt, or any other liabilities." },
];

const MAX_INPUT = 999_999_999;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function fmtCompact(n: number) {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000)    return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return fmt(n);
}
function parseVal(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : Math.min(n, MAX_INPUT);
}
function sanitize(raw: string): string {
  const stripped = raw.replace(/[^0-9.]/g, "");
  if (!stripped || stripped === ".") return "";
  const n = parseFloat(stripped);
  if (isNaN(n)) return "";
  return n > MAX_INPUT ? String(MAX_INPUT) : stripped;
}
function getMessage(nw: number, has: boolean): { text: string; color: string } {
  if (!has)         return { text: "Fill in your numbers — no judgment, just math. 💛",                                      color: C.muted };
  if (nw >= 500000) return { text: "You're building serious wealth. Keep compounding. 🚀",                                  color: C.green };
  if (nw >= 100000) return { text: "Six figures — a real milestone. Keep investing. 💪",                                    color: C.green };
  if (nw >= 0)      return { text: "Positive territory. Every dollar invested compounds from here. 🌱",                     color: C.green };
  if (nw >= -50000) return { text: "Negative net worth is common with student loans. Track monthly and watch it climb. 📈", color: C.amber };
  return              { text: "Awareness is step one. Focus on high-interest debt first. You've got this. 🧡",               color: C.amber };
}

function MoneyInput({ field, value, onChange }: { field: Field; value: string; onChange: (id: string, v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <label style={{ fontSize: "0.875rem", fontWeight: 600, color: C.text, display: "block", lineHeight: 1.2 }}>
          {field.label}
        </label>
        <p style={{ fontSize: "0.75rem", color: C.muted, marginTop: "0.1rem", lineHeight: 1.35, marginBottom: 0 }}>
          {field.hint}
        </p>
      </div>
      <div
        className="rws-money-input"
        style={{
          border: `2px solid ${focused ? C.green : C.border}`,
          borderRadius: "0.625rem",
          padding: "0.45rem 0.625rem",
          backgroundColor: C.white,
          boxShadow: focused ? `0 0 0 3px ${C.green}18` : "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        <span style={{ color: C.muted, fontSize: "0.875rem", marginRight: "0.2rem", flexShrink: 0 }}>$</span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="0"
          value={value}
          onChange={e => onChange(field.id, sanitize(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (value) {
              const n = parseFloat(value);
              if (!isNaN(n)) onChange(field.id, String(Math.floor(n)));
            }
          }}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontSize: "0.875rem", fontWeight: 600, color: C.text,
            fontFamily: C.sans, width: "100%", minWidth: 0,
          }}
        />
      </div>
    </div>
  );
}

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [liabs,  setLiabs]  = useState<Record<string, string>>({});

  const totalAssets = useMemo(() => ASSET_FIELDS.reduce((s, f)  => s + parseVal(assets[f.id] ?? ""), 0), [assets]);
  const totalLiabs  = useMemo(() => LIABILITY_FIELDS.reduce((s, f) => s + parseVal(liabs[f.id] ?? ""),  0), [liabs]);
  const netWorth    = totalAssets - totalLiabs;
  const hasInput    = totalAssets > 0 || totalLiabs > 0;
  const assetPct    = hasInput ? Math.round((totalAssets / (totalAssets + totalLiabs || 1)) * 100) : 50;
  const msg         = getMessage(netWorth, hasInput);

  return (
    <PageWrapper>
      <main>
        <div className="rws-container" style={{ paddingTop: "5.5rem", paddingBottom: "2rem" }}>

          {/* ── PAGE HEADER ── */}
          <div style={{ marginBottom: "1.5rem" }}>
            <SectionLabel>🧮 Tools</SectionLabel>
            <h1 style={{ fontFamily: C.serif, fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 700, color: C.text, lineHeight: 1.1, marginTop: 0, marginBottom: "0.4rem" }}>
              Net Worth Calculator
            </h1>
            <p style={{ fontSize: "0.9rem", color: C.muted, margin: 0 }}>
              Everything you own minus everything you owe — live as you type.
            </p>
          </div>

          {/* ── LIVE SUMMARY BAR ── */}
          <div className="rws-card-white" style={{ marginBottom: "1.25rem", padding: "1.25rem" }}>
            <div className="rws-flex-stack" style={{ gap: "1rem" }}>

              {/* Stats — always 3-col grid, clamp font to stay in bounds */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", flexShrink: 0 }}>
                {[
                  { label: "Total Assets",      value: fmtCompact(totalAssets), color: C.green },
                  { label: "Total Liabilities", value: fmtCompact(totalLiabs),  color: C.red   },
                  { label: "Net Worth",         value: fmtCompact(netWorth),    color: netWorth >= 0 ? C.green : C.amber },
                ].map((s, i) => (
                  <div key={s.label} style={{ textAlign: "center", paddingRight: i < 2 ? "0.5rem" : 0, borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                    <p style={{ ...labelStyle, fontSize: "0.62rem", marginBottom: "0.2rem" }}>{s.label}</p>
                    <p style={{ fontFamily: C.serif, fontSize: "clamp(0.9rem, 3vw, 1.15rem)", fontWeight: 700, color: s.color, whiteSpace: "nowrap", margin: 0 }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar + message */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontWeight: 600, color: C.muted, marginBottom: "0.35rem" }}>
                  <span>Assets {hasInput ? `${assetPct}%` : ""}</span>
                  <span>Debt {hasInput ? `${100 - assetPct}%` : ""}</span>
                </div>
                <div style={{ display: "flex", height: "0.5rem", borderRadius: 9999, overflow: "hidden", backgroundColor: C.card }}>
                  <div style={{ width: `${hasInput ? assetPct : 50}%`, backgroundColor: C.green, transition: "width 0.4s ease" }} />
                  <div style={{ width: `${hasInput ? 100 - assetPct : 50}%`, backgroundColor: C.red, transition: "width 0.4s ease" }} />
                </div>
                <p style={{ fontSize: "0.8rem", fontWeight: 500, color: msg.color, lineHeight: 1.5, marginTop: "0.5rem", marginBottom: 0 }}>
                  {msg.text}
                </p>
              </div>

            </div>
          </div>

          {/* ── INPUT COLUMNS — stacks on mobile, side-by-side on desktop ── */}
          <div className="rws-grid-2" style={{ marginBottom: "1.25rem" }}>

            {/* Assets */}
            <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", padding: "1.25rem" }}>
              <p className="rws-label">💰 Assets — what you own</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", flex: 1 }}>
                {ASSET_FIELDS.map(f => (
                  <MoneyInput key={f.id} field={f} value={assets[f.id] ?? ""} onChange={(id, v) => setAssets(p => ({ ...p, [id]: v }))} />
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: "1rem", paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ ...labelStyle, margin: 0 }}>Total Assets</p>
                <p style={{ fontFamily: C.serif, fontSize: "1.1rem", fontWeight: 700, color: C.green, margin: 0 }}>{fmt(totalAssets)}</p>
              </div>
            </div>

            {/* Liabilities */}
            <div className="rws-card-white" style={{ display: "flex", flexDirection: "column", padding: "1.25rem" }}>
              <p className="rws-label">💳 Liabilities — what you owe</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", flex: 1 }}>
                {LIABILITY_FIELDS.map(f => (
                  <MoneyInput key={f.id} field={f} value={liabs[f.id] ?? ""} onChange={(id, v) => setLiabs(p => ({ ...p, [id]: v }))} />
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: "1rem", paddingTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ ...labelStyle, margin: 0 }}>Total Liabilities</p>
                <p style={{ fontFamily: C.serif, fontSize: "1.1rem", fontWeight: 700, color: C.red, margin: 0 }}>{fmt(totalLiabs)}</p>
              </div>
            </div>

          </div>

          {/* ── CONTEXT NOTE ── */}
          <div style={{ backgroundColor: `${C.green}0D`, border: `1px solid ${C.green}25`, borderRadius: "0.75rem", padding: "0.875rem 1.25rem", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
            <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "0.1rem" }}>📌</span>
            <p style={{ fontSize: "0.825rem", color: C.muted, lineHeight: 1.6, margin: 0 }}>
              Median net worth for Americans under 35 is ~<strong style={{ color: C.text }}>$13,900</strong>. Student loans making yours negative? Completely normal. Track the trend, not just the number.
            </p>
          </div>

        </div>
      </main>
    </PageWrapper>
  );
}