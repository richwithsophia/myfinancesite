"use client";

import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { label: "Home",        href: "/" },
    { label: "Daily Brief", href: "/daily-brief" },
    { label: "Tools",       href: "/tools" },
    { label: "About",       href: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#1a1a1a]/5">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold tracking-tight text-[#1a1a1a]">
          Rich <span className="text-emerald-600">with Sophia</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <a
                key={href}
                href={href}
                className={`transition-colors ${
                  active
                    ? "text-emerald-600 font-semibold"
                    : "text-[#1a1a1a]/50 hover:text-[#1a1a1a]"
                }`}
              >
                {label}
              </a>
            );
          })}
          <a
            href="/daily-brief"
            className="bg-[#1a1a1a] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
          >
            Get the Brief →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-[#1a1a1a]/50 hover:text-[#1a1a1a]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}