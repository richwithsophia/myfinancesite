/**
 * app/lib/useSessionState.ts
 * Drop-in replacement for useState that persists to sessionStorage.
 * Data clears automatically when the browser tab is closed.
 * Safe for SSR — reads sessionStorage only on the client.
 *
 * Usage:
 *   // Instead of:
 *   const [value, setValue] = useState("default");
 *
 *   // Use:
 *   const [value, setValue] = useSessionState("unique-key", "default");
 *
 * Key naming convention: "page-name:field-name"
 *   e.g. "mortgage:homeValue", "student-loan:loans"
 *
 * Notes:
 *   - Values are JSON serialized — works with strings, numbers, arrays, objects
 *   - If sessionStorage is unavailable (SSR, private mode), falls back to useState
 *   - Each key must be unique across the entire app
 */

"use client";

import { useState, useEffect } from "react";

export function useSessionState<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize from sessionStorage if available, otherwise use initialValue
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Persist to sessionStorage whenever state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // sessionStorage unavailable (private mode, quota exceeded) — fail silently
    }
  }, [key, state]);

  return [state, setState];
}