/**
 * app/components/ui/MoneyInput.tsx
 * Controlled dollar amount input with label, optional hint, and focus styles.
 * Sanitizes input automatically — strips non-numeric characters and enforces max.
 *
 * Usage:
 *   <MoneyInput label="Remaining Balance" value={val} onChange={setVal} />
 *   <MoneyInput label="Balance" hint="Enter your current balance" value={val} onChange={setVal} placeholder="50000" />
 *   <MoneyInput label="Balance" value={val} onChange={setVal} disabled />
 */

"use client";

import { useState, useId } from "react";
import { C } from "../../lib/brand";
import { sanitizeCurrencyInput } from "../../lib/calculators";

type MoneyInputProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MoneyInput({
  label,
  hint,
  value,
  onChange,
  placeholder = "0",
  disabled = false,
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>

      {/* Label */}
      <label htmlFor={id} style={{
  fontSize: "0.875rem",
  fontWeight: 600,
  color: disabled ? C.muted : C.text,
  fontFamily: C.sans,
  lineHeight: 1.2,
}}>
  {label}
</label>

      {/* Hint */}
      {hint && (
        <p style={{
          fontSize: "0.75rem",
          color: C.muted,
          margin: 0,
          lineHeight: 1.4,
          fontFamily: C.sans,
        }}>
          {hint}
        </p>
      )}

      {/* Input box */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          border: `2px solid ${focused ? C.green : C.border}`,
          borderRadius: "0.625rem",
          padding: "0.55rem 0.75rem",
          backgroundColor: disabled ? C.card : C.white,
          boxShadow: focused ? `0 0 0 3px ${C.green}18` : "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{
          color: C.muted,
          fontSize: "0.875rem",
          marginRight: "0.25rem",
          flexShrink: 0,
          fontFamily: C.sans,
        }}>
          $
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={e => onChange(sanitizeCurrencyInput(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (value) {
              const n = parseFloat(value);
              if (!isNaN(n)) onChange(String(Math.floor(n)));
            }
          }}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: C.text,
            fontFamily: C.sans,
            width: "100%",
            minWidth: 0,
          }}
        />
      </div>

    </div>
  );
}