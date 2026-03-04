"use client";

import { useState, useMemo } from "react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";

const C = {
  bg: "#FAFAF7", card: "#F2F0EB", text: "#1A1A1A",
  muted: "#6B6760", green: "#2D6A4F", coral: "#E07A5F",
  red: "#C1440E", border: "#E5E2DC",
  serif: "'Playfair Display', serif", sans: "'Inter', sans-serif",
};
const lbl = { fontFamily: C.sans, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: C.muted };

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

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
function parseVal(s: string) {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : n;
}
function getMessage(nw: number, has: boolean): { text: string; color: string } {
  if (!has)         return { text: "Fill in your numbers — no judgment, just math. 💛",                                       color: C.muted };
  if (nw >= 500000) return { text: "You're building serious wealth. Keep compounding. 🚀",                                   color: C.green };
  if (nw >= 100000) return { text: "Six figures — a real milestone. Keep investing. 💪",                                     color: C.green };
  if (nw >= 0)      return { text: "Positive territory. Every dollar invested compounds from here. 🌱",                      color: C.green };
  if (nw >= -50000) return { text: "Negative net worth is common with student loans. Track monthly and watch it climb. 📈",  color: "#B45309" };
  return              { text: "Awareness is step one. Focus on high-interest debt first. You've got this. 🧡",                color: "#B45309" };
}

function MoneyInput({ field, value, onChange }: { field: Field; value: string; onChange: (id: string, v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <label style={{ fontSize: "0.9375rem", fontWeight: 600, color: C.text, display: "block", lineHeight: 1.2 }}>{field.label}</label>
        <p style={{ fontSize: "0.8rem", color: C.muted, marginTop: "0.1rem", lineHeight: 1.3 }}>{field.hint}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", border: `2px solid ${focused ? C.green : C.border}`, borderRadius: "0.625rem", padding: "0.4rem 0.75rem", width: "9.5rem", flexShrink: 0, backgroundColor: "#fff", boxShadow: focused ? `0 0 0 3px ${C.green}18` : "none", transition: "all 0.15s" }}>
        <span style={{ color: C.muted, fontSize: "0.9375rem", marginRight: "0.25rem" }}>$</span>
        <input type="number" min="0" placeholder="0" value={value}
          onChange={e => onChange(field.id, e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "0.9375rem", fontWeight: 600, color: C.text, fontFamily: C.sans, width: "100%" }}
        />
      </div>
    </div>
  );
}

export default function NetWorthCalculator() {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [liabs,  setLiabs]  = useState<Record<string, string>>({});

  const totalAssets = useMemo(() => ASSET_FIELDS.reduce((s, f) => s + parseVal(assets[f.id] ?? ""), 0), [assets]);
  const totalLiabs  = useMemo(() => LIABILITY_FIELDS.reduce((s, f) => s + parseVal(liabs[f.id] ?? ""), 0), [liabs]);
  const netWorth    = totalAssets - totalLiabs;
  const hasInput    = totalAssets > 0 || totalLiabs > 0;
  const assetPct    = hasInput ? Math.round((totalAssets / (totalAssets + totalLiabs || 1)) * 100) : 50;
  const msg         = getMessage(netWorth, hasInput);

  return (
    <div style={{ backgroundColor: C.bg, color: C.text, fontFamily: C.sans, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Nav />

      <main style={{ maxWidth: 1152, margin: "0 auto", padding: "5.5rem 1.5rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: `${C.green}18`, border: `1px solid ${C.green}30`, color: C.green, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", padding: "0.4rem 0.875rem", borderRadius: 9999, marginBottom: "0.5rem" }}>
            🧮 Tools
          </div>
          <h1 style={{ fontFamily: C.serif, fontSize: "1.75rem", fontWeight: 700, color: C.text, lineHeight: 1.1 }}>Net Worth Calculator</h1>
          <p style={{ fontSize: "0.875rem", color: C.muted, marginTop: "0.25rem" }}>Everything you own minus everything you owe — live as you type.</p>
        </div>

        {/* ── LIVE SUMMARY BAR ── */}
        <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1rem 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {/* Stats */}
            <div style={{ display: "flex", gap: "1.5rem", flexShrink: 0 }}>
              {[
                { label: "Total Assets",      value: fmt(totalAssets), color: C.green },
                { label: "Total Liabilities", value: fmt(totalLiabs),  color: C.red   },
                { label: "Net Worth",         value: fmt(netWorth),    color: netWorth >= 0 ? C.green : "#B45309" },
              ].map((s, i) => (
                <div key={s.label} style={{ textAlign: "center", paddingRight: i < 2 ? "1.5rem" : 0, borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <p style={{ ...lbl, marginBottom: "0.2rem" }}>{s.label}</p>
                  <p style={{ fontFamily: C.serif, fontSize: "1.3rem", fontWeight: 700, color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Bar */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontWeight: 600, color: C.muted, marginBottom: "0.4rem" }}>
                <span>Assets {hasInput ? `${assetPct}%` : ""}</span>
                <span>Debt {hasInput ? `${100 - assetPct}%` : ""}</span>
              </div>
              <div style={{ display: "flex", height: "0.625rem", borderRadius: 9999, overflow: "hidden", backgroundColor: C.card }}>
                <div style={{ width: `${hasInput ? assetPct : 50}%`, backgroundColor: C.green, transition: "width 0.4s ease" }} />
                <div style={{ width: `${hasInput ? 100 - assetPct : 50}%`, backgroundColor: C.red, transition: "width 0.4s ease" }} />
              </div>
            </div>

            {/* Message */}
            <p style={{ fontSize: "0.8rem", fontWeight: 500, color: msg.color, maxWidth: 200, flexShrink: 0, lineHeight: 1.5 }}>
              {msg.text}
            </p>
          </div>
        </div>

        {/* ── 2-COLUMN INPUTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", flex: 1, minHeight: 0 }}>

          {/* Assets */}
          <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1rem 1.25rem", display: "flex", flexDirection: "column" }}>
            <p style={{ ...lbl, marginBottom: "0.75rem" }}>💰 Assets — what you own</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
              {ASSET_FIELDS.map(f => (
                <MoneyInput key={f.id} field={f} value={assets[f.id] ?? ""} onChange={(id, v) => setAssets(p => ({ ...p, [id]: v }))} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={lbl}>Total Assets</p>
              <p style={{ fontFamily: C.serif, fontSize: "1.15rem", fontWeight: 700, color: C.green }}>{fmt(totalAssets)}</p>
            </div>
          </div>

          {/* Liabilities */}
          <div style={{ backgroundColor: "#fff", border: `1px solid ${C.border}`, borderRadius: "1rem", padding: "1rem 1.25rem", display: "flex", flexDirection: "column" }}>
            <p style={{ ...lbl, marginBottom: "0.75rem" }}>💳 Liabilities — what you owe</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1 }}>
              {LIABILITY_FIELDS.map(f => (
                <MoneyInput key={f.id} field={f} value={liabs[f.id] ?? ""} onChange={(id, v) => setLiabs(p => ({ ...p, [id]: v }))} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={lbl}>Total Liabilities</p>
              <p style={{ fontFamily: C.serif, fontSize: "1.15rem", fontWeight: 700, color: C.red }}>{fmt(totalLiabs)}</p>
            </div>
          </div>

        </div>

        {/* ── NET WORTH CONTEXT NOTE ── */}
        <div style={{ backgroundColor: `${C.green}0D`, border: `1px solid ${C.green}25`, borderRadius: "0.75rem", padding: "0.75rem 1.25rem", flexShrink: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1rem" }}>📌</span>
          <p style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.5, margin: 0 }}>
            Median net worth for Americans under 35 is ~<strong style={{ color: C.text }}>$13,900</strong>. Student loans making yours negative? Completely normal. Track the trend, not just the number.
          </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
