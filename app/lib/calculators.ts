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

    if (remaining < 0.01) break;
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

// ─── AVALANCHE PAYOFF SIMULATION ───────────────────────────────────────────────

export interface AvalancheLoan {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
}

/**
 * Correct avalanche simulation with rollover across multiple loans.
 * Runs a unified month-by-month simulation simultaneously across all loans.
 * When a loan pays off, its freed minimum payment rolls immediately into
 * the extra pool the following month, applied to the next highest-rate loan.
 *
 * Returns baseline vs extra-payment comparison:
 * - monthsSaved: how many months sooner all loans are paid off
 * - interestSaved: total interest saved across all loans
 * - newPayoffDate: new debt-free date with extra payment
 */
export function computeAvalancheImpact(
  loans: AvalancheLoan[],
  extraMonthly: number,
  baselineMaxMonths: number,
  baselineTotalInterest: number,
): { monthsSaved: number; interestSaved: number; newPayoffDate: string } | null {
  if (extraMonthly < 25 || loans.length === 0) return null;

  type LoanState = {
    balance: number;
    monthlyRate: number;
    minPayment: number;
    paid: boolean;
  };

  const loanStates: LoanState[] = loans
    .slice()
    .sort((a, b) => b.annualRate - a.annualRate)
    .map(r => ({
      balance:     r.balance,
      monthlyRate: r.annualRate / 100 / 12,
      minPayment:  r.monthlyPayment,
      paid:        false,
    }));

  let totalInterestPaid = 0;
  let month             = 0;
  let extraPool         = extraMonthly;
  const MAX_MONTHS      = 600;

  while (month < MAX_MONTHS) {
    const allPaid = loanStates.every(l => l.paid);
    if (allPaid) break;

    month++;

    const targetIdx = loanStates.findIndex(l => !l.paid);

    loanStates.forEach((loan, idx) => {
      if (loan.paid) return;

      const interest  = loan.balance * loan.monthlyRate;
      totalInterestPaid += interest;

      const payment   = idx === targetIdx
        ? loan.minPayment + extraPool
        : loan.minPayment;

      const principal = Math.min(payment - interest, loan.balance);
      loan.balance    = Math.max(0, loan.balance - principal);

      if (loan.balance <= 0) {
        loan.paid  = true;
        extraPool += loan.minPayment;
      }
    });
  }

  const monthsSaved   = baselineMaxMonths - month;
  const interestSaved = baselineTotalInterest - totalInterestPaid;
  const newPayoffDate = calculatePayoffDate(month);

  if (monthsSaved <= 0 && interestSaved < 1) return null;

  return {
    monthsSaved:   Math.max(0, monthsSaved),
    interestSaved: Math.max(0, interestSaved),
    newPayoffDate,
  };
}

// ─── DEBT PAYOFF CALCULATOR ────────────────────────────────────────────────────

export type DebtStrategy = "snowball" | "avalanche";

export interface DebtInput {
  name: string;
  balance: string;
  rate: string;
  payment: string;
}

export interface DebtResult {
  name: string;
  balance: number;
  rate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  months: number;
  payoffDate: string;
}

export interface DebtScheduleResult {
  strategy: DebtStrategy;
  debts: DebtResult[];
  totalInterest: number;
  totalPaid: number;
  totalMonths: number;
  debtFreeDate: string;
  firstPayoffMonths: number;   // months until first debt is eliminated
  firstPayoffName: string;     // name of first debt eliminated
}

export interface DebtComparisonResult {
  avalanche: DebtScheduleResult;
  snowball: DebtScheduleResult;
  interestDelta: number;       // avalanche total interest - snowball total interest (always >= 0... usually)
  firstWinDelta: number;       // snowball firstPayoffMonths - avalanche firstPayoffMonths
  identicalRates: boolean;     // true if all debts have the same rate
}

/**
 * Runs a month-by-month debt payoff simulation for a given strategy.
 * Snowball: sorts smallest balance first, rolls freed payments into next smallest.
 * Avalanche: sorts highest rate first, rolls freed payments into next highest rate.
 *
 * Returns a full DebtScheduleResult including per-debt totals, payoff dates,
 * and first-payoff metadata for the winner banner.
 */
export function computeDebtSchedule(
  debts: DebtInput[],
  strategy: DebtStrategy,
): DebtScheduleResult | null {
  // Parse and validate inputs
  type ParsedDebt = {
    name: string;
    balance: number;
    rate: number;
    monthlyPayment: number;
  };

  const parsed: ParsedDebt[] = [];
  for (const d of debts) {
    const balance = parseCurrencyInput(d.balance);
    const rate = parseFloat(d.rate);
    const payment = parseCurrencyInput(d.payment);
    if (!balance || isNaN(rate) || rate < 0 || !payment) continue;
    const monthlyInterest = (balance * (rate / 100)) / 12;
    if (payment <= monthlyInterest && rate > 0) continue; // payment doesn't cover interest
    parsed.push({ name: d.name || "Debt", balance, rate, monthlyPayment: payment });
  }

  if (parsed.length === 0) return null;

  // Sort by strategy
  const sorted = [...parsed].sort((a, b) =>
    strategy === "snowball"
      ? a.balance - b.balance          // smallest balance first
      : b.rate - a.rate                // highest rate first
  );

  // Simulation state
  type LoanState = {
    name: string;
    originalBalance: number;
    rate: number;
    minPayment: number;
    balance: number;
    monthlyRate: number;
    interestAccrued: number;
    monthsPaidOff: number | null;
    paid: boolean;
  };

  const states: LoanState[] = sorted.map(d => ({
    name: d.name,
    originalBalance: d.balance,
    rate: d.rate,
    minPayment: d.monthlyPayment,
    balance: d.balance,
    monthlyRate: d.rate / 100 / 12,
    interestAccrued: 0,
    monthsPaidOff: null,
    paid: false,
  }));

  let month = 0;
  let extraPool = 0;
  let firstPayoffMonths: number | null = null;
  let firstPayoffName = "";
  const MAX_MONTHS = 600;

  while (month < MAX_MONTHS) {
    if (states.every(s => s.paid)) break;
    month++;

    // Target: first unpaid debt in sorted order
    const targetIdx = states.findIndex(s => !s.paid);

    states.forEach((loan, idx) => {
      if (loan.paid) return;

      const interest = loan.balance * loan.monthlyRate;
      loan.interestAccrued += interest;

      const payment = idx === targetIdx
        ? loan.minPayment + extraPool
        : loan.minPayment;

      const principal = Math.min(payment - interest, loan.balance);
      loan.balance = Math.max(0, loan.balance - principal);

      if (loan.balance <= 0.01) {
        loan.paid = true;
        loan.balance = 0;
        loan.monthsPaidOff = month;
        extraPool += loan.minPayment;

        if (firstPayoffMonths === null) {
          firstPayoffMonths = month;
          firstPayoffName = loan.name;
        }
      }
    });
  }

  // Build per-debt results
  const debtResults: DebtResult[] = states.map(s => ({
    name: s.name,
    balance: s.originalBalance,
    rate: s.rate,
    monthlyPayment: s.minPayment,
    totalInterest: s.interestAccrued,
    totalPaid: s.originalBalance + s.interestAccrued,
    months: s.monthsPaidOff ?? month,
    payoffDate: calculatePayoffDate(s.monthsPaidOff ?? month),
  }));

  const totalInterest = debtResults.reduce((sum, d) => sum + d.totalInterest, 0);
  const totalPrincipal = debtResults.reduce((sum, d) => sum + d.balance, 0);

  return {
    strategy,
    debts: debtResults,
    totalInterest,
    totalPaid: totalPrincipal + totalInterest,
    totalMonths: month,
    debtFreeDate: calculatePayoffDate(month),
    firstPayoffMonths: firstPayoffMonths ?? month,
    firstPayoffName,
  };
}

/**
 * Runs both simulations and returns a unified comparison result.
 * Handles the edge case where all debts have identical rates.
 */
export function computeDebtComparison(
  debts: DebtInput[],
): DebtComparisonResult | null {
  const avalanche = computeDebtSchedule(debts, "avalanche");
  const snowball = computeDebtSchedule(debts, "snowball");

  if (!avalanche || !snowball) return null;

  const rates = debts
    .map(d => parseFloat(d.rate))
    .filter(r => !isNaN(r) && r >= 0);

  const identicalRates = rates.length > 0 && rates.every(r => r === rates[0]);

  return {
    avalanche,
    snowball,
    interestDelta: snowball.totalInterest - avalanche.totalInterest,
    firstWinDelta: avalanche.firstPayoffMonths - snowball.firstPayoffMonths,
    identicalRates,
  };
}