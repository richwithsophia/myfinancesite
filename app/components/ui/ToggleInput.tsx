/**
 * app/components/ui/ToggleInput.tsx
 * Dollar/percent input with a segmented control toggle.
 * Active mode fills with C.green. Switching modes clears the value.
 *
 * Usage:
 *   <ToggleInput
 *     label="Down Payment"
 *     value={val}
 *     onChange={setVal}
 *     mode="percent"
 *     onModeChange={setMode}
 *   />
 *   <ToggleInput
 *     label="Property Tax"
 *     hint="Annual amount or rate"
 *     value={val}
 *     onChange={setVal}
 *     mode="dollar"
 *     onModeChange={setMode}
 *   />
 */

"use client";

import { useState } from "react";
import { C } from "../../lib/brand";
import { sanitizeCurrencyInput } from "../../lib/calculators";

type ToggleInputProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  mode: "dollar" | "percent";
  onModeChange: (mode: "dollar" | "percent") => void;
};

export function ToggleInput({
  label,
  hint,
  value,
  onChange,
  mode,
  onModeChange,
}: ToggleInputProps) {
  const [focused, setFocused] = useState(false);

  function handleModeChange(next: "dollar" | "percent") {
    if (next === mode) return;
    onChange(""); // clear value on mode switch
    onModeChange(next);
  }

  function sanitize(raw: string): string {
    if (mode === "dollar") return sanitizeCurrencyInput(raw);
    // percent: strip non-numeric, cap at 100
    const stripped = raw.replace(/[^0-9.]/g, "");
    if (!stripped || stripped === ".") return "";
    const n = parseFloat(stripped);
    if (isNaN(n)) return "";
    return n > 100 ? "100" : stripped;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>

      {/* Label row with segmented toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{
          fontSize: "0.875rem",
          fontWeight: 600,
          color: C.text,
          fontFamily: C.sans,
          lineHeight: 1.2,
        }}>
          {label}
        </label>

        {/* Segmented control */}
        <div style={{
          display: "flex",
          border: `1.5px solid ${C.border}`,
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}>
          {(["dollar", "percent"] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              style={{
                padding: "0.2rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                fontFamily: C.sans,
                border: "none",
                cursor: "pointer",
                backgroundColor: mode === m ? C.green : C.white,
                color: mode === m ? "#fff" : C.muted,
                transition: "background-color 0.15s ease, color 0.15s ease",
                minHeight: "unset",
              }}
            >
              {m === "dollar" ? "$" : "%"}
            </button>
          ))}
        </div>
      </div>

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
      <div style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        border: `2px solid ${focused ? C.green : C.border}`,
        borderRadius: "0.625rem",
        padding: "0.55rem 0.75rem",
        backgroundColor: C.white,
        boxShadow: focused ? `0 0 0 3px ${C.green}18` : "none",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      }}>
        {mode === "dollar" && (
          <span style={{
            color: C.muted,
            fontSize: "0.875rem",
            marginRight: "0.25rem",
            flexShrink: 0,
            fontFamily: C.sans,
          }}>
            $
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          placeholder="0"
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
        {mode === "percent" && (
          <span style={{
            color: C.muted,
            fontSize: "0.875rem",
            marginLeft: "0.25rem",
            flexShrink: 0,
            fontFamily: C.sans,
          }}>
            %
          </span>
        )}
      </div>

    </div>
  );
}