/**
 * brand.ts
 * Single source of truth for all design tokens.
 * Import { C } or { labelStyle } into any component or page.
 * To rebrand: change values here only. Nothing else needs to touch.
 *
 * File lives at: app/lib/brand.ts
 */

export const C = {
  // Backgrounds
  bg:     "#FAFAF7",   // page background
  card:   "#F2F0EB",   // card background
  white:  "#FFFFFF",

  // Text
  text:   "#1A1A1A",   // primary text
  muted:  "#6B6760",   // secondary / label text

  // Brand
  green:  "#2D6A4F",   // primary brand — headers, CTAs, links
  coral:  "#E07A5F",   // accent — buttons, highlights

  // Semantic
  border: "#E5E2DC",   // all borders
  red:    "#C1440E",   // unfavorable market move
  amber:  "#B45309",   // warning / neutral negative

  // Typography
  serif: "'Playfair Display', serif",
  sans:  "'Inter', sans-serif",
} as const;

/** Reusable overline / section label style object */
export const labelStyle = {
  fontFamily: C.sans,
  fontSize: "0.7rem",
  fontWeight: 600 as const,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: C.muted,
};