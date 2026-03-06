/**
 * ui/SectionLabel.tsx
 * Green pill badge used as section overlines.
 *
 * Usage:
 *   <SectionLabel>📊 Market Intel</SectionLabel>
 *   <SectionLabel pulse>● Daily Brief</SectionLabel>
 *
 * File lives at: app/components/ui/SectionLabel.tsx
 */
export function SectionLabel({ children, pulse = false }: { children: React.ReactNode; pulse?: boolean }) {
  return (
    <div className="rws-badge">
      {pulse && (
        <span className="animate-pulse" style={{
          width: 6, height: 6, borderRadius: "50%",
          backgroundColor: "#2D6A4F", display: "inline-block", flexShrink: 0,
        }} />
      )}
      {children}
    </div>
  );
}