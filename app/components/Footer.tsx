"use client";

const C = {
  muted:  "#6B6760",
  green:  "#2D6A4F",
  border: "#E5E2DC",
  serif:  "'Playfair Display', serif",
  sans:   "'Inter', sans-serif",
};

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "2.5rem 1.5rem", fontFamily: C.sans }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <span style={{ fontFamily: C.serif, fontWeight: 700, color: C.muted }}>
          <span style={{ color: C.green }}>Rich</span> with Sophia
        </span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {[["Home", "/"], ["Daily Brief", "/daily-brief"], ["Tools", "/tools"], ["About", "/about"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: C.muted, fontSize: "0.875rem", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <a href="#" style={{ color: C.muted, fontSize: "0.82rem", textDecoration: "underline" }}>
          Unsubscribe anytime
        </a>
      </div>
    </footer>
  );
}