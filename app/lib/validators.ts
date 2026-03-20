/**
 * app/lib/validators.ts
 * Input validation utilities for Rich with Sophia calculator tools.
 * Single source of truth — do not duplicate these in individual tool pages.
 */

/**
 * Returns true if the string is a valid interest rate between 0 and 100 (inclusive).
 * Accepts 0% — callers should warn the user that a 0% rate means $0 monthly interest,
 * so any positive payment will pay off the loan (no mathematical issue, but unusual).
 */
export function isValidRate(value: string): boolean {
  const n = parseFloat(value);
  return !isNaN(n) && n >= 0 && n <= 100;
}

/**
 * Returns true if the string represents a positive number (> 0).
 * Used for balances that must be greater than zero.
 */
export function isValidBalance(value: string): boolean {
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  return !isNaN(n) && n > 0;
}

/**
 * Returns true if the string represents any positive number (> 0).
 * General-purpose check used across inputs.
 */
export function isPositiveNumber(value: string): boolean {
  const n = parseFloat(value.replace(/[^0-9.]/g, ""));
  return !isNaN(n) && n > 0;
}

/**
 * Returns true if the monthly payment is high enough to cover monthly interest.
 * If annualRate is 0%, monthly interest is $0, so any payment > 0 is valid.
 *
 * ⚠️ Callers should surface a warning when annualRate is 0:
 *   "A 0% interest rate means $0 monthly interest — the full payment goes to principal."
 *
 * ⚠️ Callers should surface an error when this returns false:
 *   "Your payment doesn't cover the monthly interest. The loan will never be paid off."
 */
export function isValidPayment(
  monthlyPayment: number,
  balance: number,
  annualRate: number,
): boolean {
  if (annualRate === 0) return monthlyPayment > 0;
  const monthlyInterest = (balance * (annualRate / 100)) / 12;
  return monthlyPayment > monthlyInterest;
}