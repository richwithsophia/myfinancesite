/**
 * app/components/ui/SelectInput.tsx
 * Styled dropdown matching the MoneyInput and PercentInput visual style.
 * Label on top, optional hint below, select box below that.
 *
 * Usage:
 *   <SelectInput
 *     label="Loan Type"
 *     value={val}
 *     onChange={setVal}
 *     options={[{ label: "30Y Fixed", value: "30" }, { label: "15Y Fixed", value: "15" }]}
 *   />
 *   <SelectInput label="Frequency" hint="How often to apply extra payment" value={val} onChange={setVal} options={[...]} />
 */

"use client";

import { useState, useId } from "react";
import { C } from "../../lib/brand";

type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
};

export function SelectInput({
  label,
  hint,
  value,
  onChange,
  options,
}: SelectInputProps) {
  const [focused, setFocused] = useState(false);
  const id = useId();

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

      {/* Select box */}
      <div style={{
        position: "relative",
        width: "100%",
      }}>
        <select
  id={id}
  value={value}
  onChange={e => onChange(e.target.value)}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            appearance: "none",
            WebkitAppearance: "none",
            border: `2px solid ${focused ? C.green : C.border}`,
            borderRadius: "0.625rem",
            padding: "0.55rem 2.25rem 0.55rem 0.75rem",
            backgroundColor: C.white,
            boxShadow: focused ? `0 0 0 3px ${C.green}18` : "none",
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: C.text,
            fontFamily: C.sans,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <span style={{
          position: "absolute",
          right: "0.75rem",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          color: C.muted,
          fontSize: "0.75rem",
        }}>
          ▾
        </span>
      </div>

    </div>
  );
}