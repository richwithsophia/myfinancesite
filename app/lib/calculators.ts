/**
 * app/lib/calculators.ts
 * Shared calculator utilities for Rich with Sophia tools.
 * Single source of truth — do not duplicate these in individual tool pages.
 */

// ─── TYPES ─────────────────────────────────────────────────────────────────────

export interface AmortizationRow {
  month: number;
  beginningBalance: number;
  interestPaid: number;
  principalPaid: number;
  endingBalance: number;
}

// ─── FORMATTING ────────────────────────────────────────────────────────────────

/**
 * Formats a number as USD with no decimal places.
 * e.g. 1234 → "$1,234"
 */
export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Formats a number as compact USD.
 * e.g. 1_200_000 → "$1.2M", 234_000 → "$234K"
 * Numbers below $10,000 fall back to full formatCurrency.
 * Threshold for "M": exactly $1,000,000.
 * e.g. $999,999 → "$999K", $1,000,000 → "$1.0M"
 */
export function formatCurrencyCompact(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 999_500)  return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000)   return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return formatCurrency(n);
}

// ─── PARSING & SANITIZATION ────────────────────────────────────────────────────

const MAX_INPUT = 999_999_999;

/**
 * Strips non-numeric characters and parses to a number.
 * Returns 0 if the result is invalid or empty.
 * Clamps to MAX_INPUT.
 */
export function parseCurrencyInput(s: string): number {
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : Math.min(n, MAX_INPUT);
}

/**
 * Sanitizes a raw currency input string for controlled inputs.
 * Strips non-numeric characters, enforces an optional max (default MAX_INPUT).
 * Returns "" for empty/invalid input so the field can be blank.
 */
export function sanitizeCurrencyInput(raw: string, max: number = MAX_INPUT): string {
  const stripped = raw.replace(/[^0-9.]/g, "");
  if (!stripped || stripped === ".") return "";
  const n = parseFloat(stripped);
  if (isNaN(n)) return "";
  return n > max ? String(max) : stripped;
}

// ─── AMORTIZATION ──────────────────────────────────────────────────────────────

/**
 * Builds a full amortization schedule.
 * - Final row ending balance is clamped to $0 (overpayment adjustment).
 * - Final row principal paid is adjusted accordingly.
 * - Stops when balance reaches $0.
 */
export function calculateAmortization(
  balance: number,
  annualRate: number,
  monthlyPayment: number,
): AmortizationRow[] {
  const rows: AmortizationRow[] = [];
  const monthlyRate = annualRate / 100 / 12;
  let remaining = balance;
  let month = 1;

  // Safety cap: no loan should exceed 600 months (50 years)
  while (remaining > 0 && month <= 600) {
    const interestPaid = remaining * monthlyRate;
    let principalPaid = monthlyPayment - interestPaid;

    // Final payment: don't overpay
    if (principalPaid > remaining) {
      principalPaid = remaining;
    }

    const endingBalance = Math.max(0, remaining - principalPaid);

    rows.push({
      month,
      beginningBalance: remaining,
      interestPaid,
      principalPaid,
      endingBalance,
    });

    remaining = endingBalance;
    month++;

    if (remaining <= 0) break;
  }

  return rows;
}

// ─── PAYOFF DATE & DURATION ────────────────────────────────────────────────────

/**
 * Calculates the payoff date given a start date and total months.
 * Returns a string like "June 2031".
 * startDate defaults to today if not provided.
 */
export function calculatePayoffDate(
  totalMonths: number,
  startDate: Date = new Date(),
): string {
  const d = new Date(startDate);
  d.setMonth(d.getMonth() + totalMonths);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

/**
 * Converts a total number of months to a human-readable string.
 * e.g. 25 → "2 years and 1 month"
 * e.g. 12 → "1 year and 0 months"
 */
export function formatYearsMonths(totalMonths: number): string {
  const years  = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  const yStr   = years  === 1 ? "1 year"   : `${years} years`;
  const mStr   = months === 1 ? "1 month"  : `${months} months`;
  return `${yStr} and ${mStr}`;
}

/**
 * Sums all interest paid across an amortization schedule.
 */
export function calculateTotalInterest(schedule: AmortizationRow[]): number {
  return schedule.reduce((sum, row) => sum + row.interestPaid, 0);
}