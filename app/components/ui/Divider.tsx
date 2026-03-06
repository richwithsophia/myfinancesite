/**
 * ui/Divider.tsx
 * Horizontal rule with brand border color.
 *
 * Usage:
 *   <Divider />
 *   <Divider my="1.5rem" />
 */
export function Divider({ my = "2.5rem" }: { my?: string }) {
  return <hr className="rws-divider" style={{ margin: `${my} 0` }} />;
}