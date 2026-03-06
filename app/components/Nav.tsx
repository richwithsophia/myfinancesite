"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { C } from "../lib/brand";

const links = [
  { label: "Home",        href: "/" },
  { label: "Daily Brief", href: "/daily-brief" },
  { label: "Tools",       href: "/tools" },
  { label: "About",       href: "/about" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Inject responsive CSS directly — zero dependency on Tailwind processing */}
      <style>{`
        .nav-desktop { display: none; }
        .nav-hamburger { display: flex; }
        .nav-drawer { display: none; }
        .nav-drawer.is-open { display: flex; }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
          .nav-hamburger { display: none; }
          .nav-drawer { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: `${C.bg}f2`, backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${C.border}`, fontFamily: C.sans,
      }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Logo */}
          <a href="/" style={{ fontFamily: C.serif, fontSize: "1.2rem", fontWeight: 700, color: C.text, textDecoration: "none" }}>
            <span style={{ color: C.green }}>Rich&nbsp;</span>with Sophia
          </a>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ alignItems: "center", gap: "2rem" }}>
            {links.map(({ label, href }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <a key={href} href={href} style={{
                  fontSize: "0.875rem", fontWeight: active ? 600 : 500,
                  color: active ? C.green : C.muted, textDecoration: "none", transition: "color 0.15s",
                }}>
                  {label}
                </a>
              );
            })}
            <a href="/daily-brief" style={{
              backgroundColor: C.coral, color: "#fff", fontSize: "0.875rem",
              fontWeight: 600, padding: "0.5rem 1.25rem", borderRadius: 9999, textDecoration: "none",
            }}>
              Get the Brief →
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(prev => !prev)}
            aria-label="Toggle menu"
            style={{ flexDirection: "column", gap: 5, padding: 8, background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{
              display: "block", width: 22, height: 2, backgroundColor: C.text, borderRadius: 2,
              transition: "transform 0.2s", transformOrigin: "center",
              transform: open ? "rotate(45deg) translate(0px, 7px)" : "none",
            }} />
            <span style={{
              display: "block", width: 22, height: 2, backgroundColor: C.text, borderRadius: 2,
              transition: "opacity 0.2s", opacity: open ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 22, height: 2, backgroundColor: C.text, borderRadius: 2,
              transition: "transform 0.2s", transformOrigin: "center",
              transform: open ? "rotate(-45deg) translate(0px, -7px)" : "none",
            }} />
          </button>

        </div>

        {/* Mobile drawer */}
        <div
          className={`nav-drawer${open ? " is-open" : ""}`}
          style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.bg, padding: "1rem 1.5rem", flexDirection: "column", gap: "1rem" }}
        >
          {links.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <a key={href} href={href} style={{
                fontSize: "0.875rem", padding: "0.25rem 0",
                fontWeight: active ? 600 : 500,
                color: active ? C.green : C.muted, textDecoration: "none",
              }}>
                {label}
              </a>
            );
          })}
          <a href="/daily-brief" style={{
            backgroundColor: C.coral, color: "#fff", fontSize: "0.875rem",
            fontWeight: 600, padding: "0.625rem 1.25rem", borderRadius: 9999,
            textDecoration: "none", textAlign: "center", marginTop: "0.25rem",
          }}>
            Get the Brief →
          </a>
        </div>

      </nav>
    </>
  );
}