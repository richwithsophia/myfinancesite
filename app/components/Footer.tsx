"use client";

export default function Footer() {
  return (
    <footer className="border-t border-border font-sans">
      <div className="max-w-site mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* Logo */}
        <span className="font-serif font-bold text-muted text-base">
          <span className="text-green">Rich</span> with Sophia
        </span>

        {/* Nav links */}
        <div className="flex flex-wrap gap-6">
          {[["Home", "/"], ["Daily Brief", "/daily-brief"], ["Tools", "/tools"], ["About", "/about"]].map(([l, h]) => (
            <a key={l} href={h} className="text-muted text-sm hover:text-ink transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Unsubscribe */}
        <a href="#" className="text-muted text-xs underline hover:text-ink transition-colors">
          Unsubscribe anytime
        </a>

      </div>
    </footer>
  );
}