"use client";

const tools = [
  {
    href:        "/tools/net-worth",
    emoji:       "🧮",
    label:       "Live",
    title:       "Net Worth Calculator",
    description: "Add up everything you own and everything you owe. Your net worth updates live as you type — no account needed, no data stored.",
    cta:         "Calculate my net worth →",
    available:   true,
  },
  {
    href:        "#",
    emoji:       "📊",
    label:       "Coming Soon",
    title:       "Investment Growth Calculator",
    description: "See how your money grows over time with compound interest. Plug in your starting amount, monthly contribution, and time horizon.",
    cta:         "Notify me →",
    available:   false,
  },
  {
    href:        "#",
    emoji:       "🎓",
    label:       "Coming Soon",
    title:       "Student Loan Payoff Planner",
    description: "Compare payoff strategies side by side — avalanche vs. snowball — and see exactly how much interest you'll save.",
    cta:         "Notify me →",
    available:   false,
  },
  {
    href:        "#",
    emoji:       "🏠",
    label:       "Coming Soon",
    title:       "Rent vs. Buy Calculator",
    description: "Stop guessing. Enter your market, income, and savings to see whether buying or renting actually makes more financial sense for you.",
    cta:         "Notify me →",
    available:   false,
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#1a1a1a]/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight text-[#1a1a1a]">
            Rich <span className="text-emerald-600">with Sophia</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#1a1a1a]/50 font-medium">
            <a href="/"            className="hover:text-[#1a1a1a] transition-colors">Home</a>
            <a href="/daily-brief" className="hover:text-[#1a1a1a] transition-colors">Daily Brief</a>
            <a href="/tools"       className="text-emerald-600 font-semibold">Tools</a>
            <a href="/about"       className="hover:text-[#1a1a1a] transition-colors">About</a>
            <a href="/daily-brief"
              className="bg-[#1a1a1a] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-emerald-700 transition-colors"
            >
              Get the Brief →
            </a>
          </div>
          <button className="md:hidden text-[#1a1a1a]/50 hover:text-[#1a1a1a]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-36 pb-24">

        {/* ── HEADER ── */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            ⚡ Financial Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#1a1a1a]">
            Tools that do the{" "}
            <span className="text-emerald-600">math for you.</span>
          </h1>
          <p className="text-[#1a1a1a]/50 text-lg max-w-xl leading-relaxed">
            Free calculators built for high earners who are too busy to mess around with spreadsheets. No sign-up. No data stored. Just answers.
          </p>
        </div>

        {/* ── TOOL CARDS ── */}
        <div className="grid md:grid-cols-2 gap-5">
          {tools.map((tool) => (
            <a
              key={tool.title}
              href={tool.href}
              className={`group bg-white border rounded-2xl p-8 flex flex-col transition-all duration-300 ${
                tool.available
                  ? "border-[#1a1a1a]/5 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 cursor-pointer"
                  : "border-[#1a1a1a]/5 opacity-60 cursor-default pointer-events-none"
              }`}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl">
                  {tool.emoji}
                </div>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  tool.available
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-[#1a1a1a]/5 text-[#1a1a1a]/35"
                }`}>
                  {tool.label}
                </span>
              </div>

              <h2 className={`text-xl font-extrabold mb-3 transition-colors ${
                tool.available ? "text-[#1a1a1a] group-hover:text-emerald-700" : "text-[#1a1a1a]"
              }`}>
                {tool.title}
              </h2>

              <p className="text-[#1a1a1a]/50 text-sm leading-relaxed flex-1 mb-6">
                {tool.description}
              </p>

              <div className={`text-sm font-semibold transition-colors ${
                tool.available
                  ? "text-emerald-600 group-hover:text-emerald-700"
                  : "text-[#1a1a1a]/30"
              }`}>
                {tool.cta}
              </div>
            </a>
          ))}
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="mt-16 bg-emerald-50 border border-emerald-200 rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-extrabold text-[#1a1a1a] mb-1">Want the full picture?</p>
            <p className="text-[#1a1a1a]/50 text-sm leading-relaxed max-w-md">
              The Daily Brief puts all of this in context — market moves, rate changes, and what it actually means for your money.
            </p>
          </div>
          <a href="/daily-brief"
            className="flex-shrink-0 bg-[#1a1a1a] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            Get the Daily Brief →
          </a>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#1a1a1a]/30 text-sm border-t border-[#1a1a1a]/5">
        <span className="font-bold text-[#1a1a1a]/60">
          Rich <span className="text-emerald-600">with Sophia</span>
        </span>
        <div className="flex items-center gap-6">
          <a href="/"            className="hover:text-[#1a1a1a] transition-colors">Home</a>
          <a href="/daily-brief" className="hover:text-[#1a1a1a] transition-colors">Daily Brief</a>
          <a href="/tools"       className="hover:text-[#1a1a1a] transition-colors">Tools</a>
          <a href="/about"       className="hover:text-[#1a1a1a] transition-colors">About</a>
        </div>
        <a href="#" className="hover:text-[#1a1a1a] transition-colors underline underline-offset-2">
          Unsubscribe anytime
        </a>
      </footer>

    </div>
  );
}
