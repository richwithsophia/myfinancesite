"use client";

import { useState, useMemo } from "react";
import Nav from "../../components/Nav";

type Field = { id: string; label: string; hint: string };

const ASSET_FIELDS: Field[] = [
  { id: "checking",    label: "Checking & Savings",    hint: "All cash in bank accounts — checking, savings, money market, and CDs." },
  { id: "investments", label: "Investment Accounts",   hint: "Brokerage accounts, stocks, ETFs, mutual funds outside of retirement." },
  { id: "retirement",  label: "Retirement (401k/IRA)", hint: "Your 401(k), Roth IRA, Traditional IRA, or any pension balance." },
  { id: "home",        label: "Home Value",            hint: "Estimated market value — check Zillow or Redfin for a ballpark." },
  { id: "car",         label: "Car Value",             hint: "Current resale value of your car(s). Use Kelley Blue Book (kbb.com)." },
  { id: "otherAssets", label: "Other Assets",          hint: "Crypto, jewelry, business ownership, or anything else of value." },
];

const LIABILITY_FIELDS: Field[] = [
  { id: "studentLoans", label: "Student Loans",    hint: "Total remaining balance across all federal and private student loans." },
  { id: "creditCards",  label: "Credit Card Debt", hint: "Total outstanding balances across all cards — not your limit, your balance." },
  { id: "mortgage",     label: "Mortgage",         hint: "Remaining balance on your home loan — check your latest statement." },
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
function getMessage(netWorth: number, hasInput: boolean): { text: string; color: string } {
  if (!hasInput) return { text: "Fill in your numbers — no judgment, just math. 💛", color: "text-[#1a1a1a]/50" };
  if (netWorth >= 500_000) return { text: "You're building serious wealth. Keep compounding. 🚀", color: "text-emerald-700" };
  if (netWorth >= 100_000) return { text: "Six figures — a real milestone. Keep investing. 💪", color: "text-emerald-700" };
  if (netWorth >= 0)       return { text: "Positive territory. Every dollar invested compounds from here. 🌱", color: "text-emerald-700" };
  if (netWorth >= -50_000) return { text: "Negative net worth is common with student loans. Track monthly and watch it climb. 📈", color: "text-amber-700" };
  return { text: "Awareness is step one. Focus on high-interest debt first. You've got this. 🧡", color: "text-amber-700" };
}

function MoneyInput({ field, value, onChange }: { field: Field; value: string; onChange: (id: string, val: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <label className="text-sm font-semibold text-[#1a1a1a]">{field.label}</label>
        <p className="text-xs text-[#1a1a1a]/50 leading-snug mt-0.5">{field.hint}</p>
      </div>
      <div className={`flex items-center border-2 rounded-xl px-3 py-2 w-36 flex-shrink-0 transition-all ${focused ? "border-emerald-500 ring-2 ring-emerald-100 bg-white" : "border-[#1a1a1a]/15 bg-white"}`}>
        <span className="text-[#1a1a1a]/40 text-sm mr-1 font-medium">$</span>
        <input
          type="number"
          min="0"
          placeholder="0"
          value={value}
          onChange={e => onChange(field.id, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-sm font-semibold text-[#1a1a1a] placeholder-[#1a1a1a]/25 outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

export default function NetWorthCalculator() {
  const [assets, setAssets]     = useState<Record<string, string>>({});
  const [liabilities, setLiabs] = useState<Record<string, string>>({});

  const totalAssets = useMemo(() => ASSET_FIELDS.reduce((s, f) => s + parseVal(assets[f.id] ?? ""), 0), [assets]);
  const totalLiabs  = useMemo(() => LIABILITY_FIELDS.reduce((s, f) => s + parseVal(liabilities[f.id] ?? ""), 0), [liabilities]);
  const netWorth    = totalAssets - totalLiabs;

  const hasInput = totalAssets > 0 || totalLiabs > 0;
  const assetPct = hasInput ? Math.round((totalAssets / (totalAssets + totalLiabs || 1)) * 100) : 50;
  const message  = getMessage(netWorth, hasInput);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans">

      <Nav />

      <main className="max-w-6xl mx-auto px-6 pt-24 pb-6 h-screen flex flex-col gap-4">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">Net Worth Calculator</h1>
            <p className="text-[#1a1a1a]/50 text-sm mt-0.5">Everything you own minus everything you owe — live as you type.</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
            🧮 Tools
          </div>
        </div>

        {/* ── TOP: LIVE SUMMARY BAR ── */}
        <div className="bg-white border border-[#1a1a1a]/8 rounded-2xl px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex gap-4 flex-shrink-0">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/35 mb-0.5">Total Assets</p>
                <p className="text-xl font-extrabold text-emerald-600">{fmt(totalAssets)}</p>
              </div>
              <div className="w-px bg-[#1a1a1a]/8 self-stretch" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/35 mb-0.5">Total Liabilities</p>
                <p className="text-xl font-extrabold text-red-500">{fmt(totalLiabs)}</p>
              </div>
              <div className="w-px bg-[#1a1a1a]/8 self-stretch" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/35 mb-0.5">Net Worth</p>
                <p className={`text-xl font-extrabold ${netWorth >= 0 ? "text-emerald-700" : "text-amber-600"}`}>{fmt(netWorth)}</p>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-xs font-semibold text-[#1a1a1a]/40 mb-1.5">
                <span>Assets {hasInput ? `${assetPct}%` : ""}</span>
                <span>Debt {hasInput ? `${100 - assetPct}%` : ""}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-[#f0ede9]">
                <div className="bg-emerald-400 transition-all duration-500 ease-out" style={{ width: `${hasInput ? assetPct : 50}%` }} />
                <div className="bg-red-400   transition-all duration-500 ease-out" style={{ width: `${hasInput ? 100 - assetPct : 50}%` }} />
              </div>
            </div>

            <p className={`text-xs font-medium leading-snug max-w-[180px] flex-shrink-0 ${message.color}`}>
              {message.text}
            </p>
          </div>
        </div>

        {/* ── BOTTOM: 2-COLUMN INPUTS ── */}
        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">

          {/* Assets */}
          <div className="bg-white border border-[#1a1a1a]/8 rounded-2xl p-5 flex flex-col min-h-0">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4">💰 Assets — what you own</p>
            <div className="flex flex-col gap-4 flex-1">
              {ASSET_FIELDS.map(f => (
                <MoneyInput key={f.id} field={f} value={assets[f.id] ?? ""} onChange={(id, v) => setAssets(p => ({ ...p, [id]: v }))} />
              ))}
            </div>
            <div className="border-t border-[#1a1a1a]/8 mt-4 pt-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">Total Assets</span>
              <span className="text-lg font-extrabold text-emerald-600">{fmt(totalAssets)}</span>
            </div>
          </div>

          {/* Liabilities */}
          <div className="bg-white border border-[#1a1a1a]/8 rounded-2xl p-5 flex flex-col min-h-0">
            <p className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4">💳 Liabilities — what you owe</p>
            <div className="flex flex-col gap-4 flex-1">
              {LIABILITY_FIELDS.map(f => (
                <MoneyInput key={f.id} field={f} value={liabilities[f.id] ?? ""} onChange={(id, v) => setLiabs(p => ({ ...p, [id]: v }))} />
              ))}
            </div>
            <div className="border-t border-[#1a1a1a]/8 mt-4 pt-3 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">Total Liabilities</span>
              <span className="text-lg font-extrabold text-red-500">{fmt(totalLiabs)}</span>
            </div>
          </div>

        </div>

        {/* ── FOOTER STRIP ── */}
        <div className="flex items-center justify-between flex-shrink-0 pb-1">
          <p className="text-xs text-[#1a1a1a]/35 leading-relaxed">
            📌 Median net worth for Americans under 35 is ~<strong className="text-[#1a1a1a]/55">$13,900</strong>. Student loans making yours negative? Completely normal. Track the trend, not just the number.
          </p>
          <a href="/daily-brief" className="flex-shrink-0 ml-6 bg-[#1a1a1a] text-white font-bold px-5 py-2 rounded-full text-xs hover:bg-emerald-700 transition-colors whitespace-nowrap">
            Get the Daily Brief →
          </a>
        </div>

      </main>
    </div>
  );
}