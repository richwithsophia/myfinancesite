/**
 * app/components/ui/index.ts
 * Barrel file — re-exports all UI components in one place.
 *
 * Usage in any page or component:
 *   import { MoneyInput, StatCard, PieChart } from "../../components/ui";
 *
 * To add a new UI component:
 *   1. Create the file in app/components/ui/
 *   2. Add its export here
 *   Done — all pages that import from this index get it automatically.
 */

// ─── EXISTING ──────────────────────────────────────────────────────────────────
export { SectionLabel }  from "./SectionLabel";
export { Divider }       from "./Divider";
export { PageCard }      from "./PageCard";
export { CtaBand }       from "./CtaBand";
export { SubscribeForm } from "./SubscribeForm";

// ─── INPUTS ────────────────────────────────────────────────────────────────────
export { MoneyInput }    from "./MoneyInput";
export { PercentInput }  from "./PercentInput";
export { SelectInput }   from "./SelectInput";
export { ToggleInput }   from "./ToggleInput";

// ─── DISPLAY ───────────────────────────────────────────────────────────────────
export { StatCard }        from "./StatCard";
export { PieChart }        from "./PieChart";
export { BreakdownTable }  from "./BreakdownTable";
export { InsightCallout }  from "./InsightCallout";
export { ResultsPanel }    from "./ResultsPanel";
export { DynamicList }     from "./DynamicList";