"use client";

import { usePathname } from "next/navigation";

const C = {
  bg:     "#FAFAF7",
  text:   "#1A1A1A",
  muted:  "#6B6760",
  green:  "#2D6A4F",
  coral:  "#E07A5F",
  border: "#E5E2DC",
  serif:  "'Playfair Display', serif",
  sans:   "'Inter', sans-serif",
};

const links = [
  { label: "Home",        href: "/" },
  { label: "Daily Brief", href: "/daily-brief" },
  { label: "Tools",       href: "/tools" },
  { label: "About",       href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: `${C.bg}ee`, backdropFilter: "blur(10px)",
      borderBottom: `1px solid ${C.border}`, fontFamily: C.sans,
    }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <a href="/" style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 700, color: C.text, textDecoration: "none" }}>
          Rich <span style={{ color: C.green }}>with Sophia</span>
        </a>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {links.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <a key={href} href={href} style={{
                fontSize: "0.875rem", fontWeight: active ? 600 : 500,
                color: active ? C.green : C.muted,
                textDecoration: "none", transition: "color 0.15s",
              }}>
                {label}
              </a>
            );
          })}
          <a href="/daily-brief" style={{
            backgroundColor: C.coral, color: "#fff",
            fontSize: "0.875rem", fontWeight: 600,
            padding: "0.5rem 1.25rem", borderRadius: 9999,
            textDecoration: "none",
          }}>
            Get the Brief →
          </a>
        </div>

      </div>
    </nav>
  );
}