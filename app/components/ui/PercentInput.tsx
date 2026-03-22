/**
 * app/components/ui/PercentInput.tsx
 * Controlled percentage input with label, optional hint, and focus styles.
 * Accepts values between 0 and 100. Sanitizes input automatically.
 *
 * Usage:
 *   <PercentInput label="Interest Rate" value={val} onChange={setVal} />
 *   <PercentInput label="Interest Rate" hint="Your annual rate" value={val} onChange={setVal} placeholder="6.8" />
 */

"use client";

import { useState, useId } from "react";
import { C } from "../../lib/brand";

type PercentInputProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function PercentInput({
  label,
  hint,
  value,
  onChange,
  placeholder = "0",
}: PercentInputProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();

  function sanitize(raw: string): string {
    const stripped = raw.replace(/[^0-9.]/g, "");
    if (!stripped || stripped === ".") return "";
    const n = parseFloat(stripped);
    if (isNaN(n)) return "";
    return n > 100 ? "100" : stripped;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>

      {/* Label */}
      <label htmlFor={id} style={{
  fontSize: "0.875rem",
  fontWeight: 600,
  color: C.text,
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
          backgroundColor: C.white,
          boxShadow: focused ? `0 0 0 3px ${C.green}18` : "none",
          transition: "border-color 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        <input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(sanitize(e.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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
        <span style={{
          color: C.muted,
          fontSize: "0.875rem",
          marginLeft: "0.25rem",
          flexShrink: 0,
          fontFamily: C.sans,
        }}>
          %
        </span>
      </div>

    </div>
  );
}