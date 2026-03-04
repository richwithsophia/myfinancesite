"use client";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#1a1a1a]/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight text-[#1a1a1a]">
            Rich <span className="text-emerald-600">with Sophia</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#1a1a1a]/50 font-medium">
            <a href="/"             className="hover:text-[#1a1a1a] transition-colors">Home</a>
            <a href="/daily-brief"  className="hover:text-[#1a1a1a] transition-colors">Daily Brief</a>
            <a href="/tools"        className="hover:text-[#1a1a1a] transition-colors">Tools</a>
            <a href="/about"        className="hover:text-[#1a1a1a] transition-colors">About</a>
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

      {/* ── HERO ── */}
      <section className="pt-40 pb-28 px-6 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Daily market intel for you
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight max-w-4xl mb-6 text-[#1a1a1a]">
          Markets explained{" "}
          <span className="text-emerald-600">for your</span>{" "}
          real life.
        </h1>

        <p className="text-lg md:text-xl text-[#1a1a1a]/50 max-w-xl leading-relaxed mb-10">
          I watch the markets so you don't have to — and I'll tell you exactly
          how it affects your complicated life.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a href="/daily-brief"
            className="bg-[#1a1a1a] text-white font-bold px-8 py-4 rounded-full text-base hover:bg-emerald-700 transition-colors"
          >
            Get the Daily Brief →
          </a>
          <span className="text-[#1a1a1a]/30 text-sm">Free. No spam. Unsubscribe anytime.</span>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-6 text-[#1a1a1a]/30 text-sm border-t border-[#1a1a1a]/5 pt-10">
          <span>📍 Built for anyone anywhere</span>
          <span className="hidden sm:block">·</span>
          <span>💼 Corporate, Tech, Finance, Law, Healthcare</span>
          <span className="hidden sm:block">·</span>
          <span>📊 Zero jargon, all signal</span>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="px-6 pb-28 max-w-6xl mx-auto">
        <p className="text-[#1a1a1a]/30 text-xs font-semibold uppercase tracking-widest mb-10">
          What you get
        </p>
        <div className="grid md:grid-cols-3 gap-5">

          <a href="/daily-brief" className="group bg-white border border-[#1a1a1a]/5 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
              <span className="text-lg">📰</span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#1a1a1a] group-hover:text-emerald-700 transition-colors">
              Translated Market News
            </h3>
            <p className="text-[#1a1a1a]/45 text-sm leading-relaxed">
              The Fed raised rates. Cool — but what does that actually mean for
              your mortgage, your 401(k), and your savings account? I break it
              down in plain English, every single day.
            </p>
            <div className="mt-6 text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Read today's brief →
            </div>
          </a>

          <a href="/tools/net-worth" className="group bg-white border border-[#1a1a1a]/5 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
              <span className="text-lg">📈</span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#1a1a1a] group-hover:text-emerald-700 transition-colors">
              Weekly Portfolio Check-ins
            </h3>
            <p className="text-[#1a1a1a]/45 text-sm leading-relaxed">
              A quick gut-check on your portfolio every week — what's moving,
              what it means, and whether you actually need to do anything.
              Spoiler: usually you don't.
            </p>
            <div className="mt-6 text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              See this week's check-in →
            </div>
          </a>

          <a href="/tools" className="group bg-white border border-[#1a1a1a]/5 rounded-2xl p-8 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
              <span className="text-lg">⚡</span>
            </div>
            <h3 className="text-lg font-bold mb-3 text-[#1a1a1a] group-hover:text-emerald-700 transition-colors">
              Zero Jargon, All Signal
            </h3>
            <p className="text-[#1a1a1a]/45 text-sm leading-relaxed">
              No "yield curve inversions" without a translation. No CNBC-speak.
              Just the information that matters for someone earning great money
              and trying to make it grow.
            </p>
            <div className="mt-6 text-emerald-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              See how it works →
            </div>
          </a>

        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="border-t border-b border-[#1a1a1a]/5 bg-emerald-50 px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-[#1a1a1a]">
            Stop skipping the financial news.{" "}
            <span className="text-emerald-600">Start understanding it.</span>
          </h2>
          <p className="text-[#1a1a1a]/45 mb-8 text-base leading-relaxed">
            Join thousands of high-earning people who get the markets decoded in
            their inbox — every weekday morning, in under 5 minutes.
          </p>
          <a href="/daily-brief"
            className="inline-block bg-[#1a1a1a] text-white font-bold px-10 py-4 rounded-full text-base hover:bg-emerald-700 transition-colors"
          >
            Get the Daily Brief →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-6 py-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#1a1a1a]/30 text-sm">
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