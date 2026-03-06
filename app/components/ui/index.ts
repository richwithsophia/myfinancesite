/**
 * app/components/ui/index.ts
 * Barrel file — re-exports all UI components in one place.
 *
 * Usage in any page or component:
 *   import { SectionLabel, Divider, PageCard, CtaBand, SubscribeForm } from "../components/ui";
 *
 * To add a new UI component:
 *   1. Create the file in app/components/ui/
 *   2. Add its export here
 *   Done — all pages that import from this index get it automatically.
 */

export { SectionLabel } from "./SectionLabel";
export { Divider }      from "./Divider";
export { PageCard }     from "./PageCard";
export { CtaBand }      from "./CtaBand";
export { SubscribeForm } from "./SubscribeForm";