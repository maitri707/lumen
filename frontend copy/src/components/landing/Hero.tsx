"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-zinc-50 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-300/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-rose-200/20 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left — Copy */}
        <div className="animate-fade-in-up">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide border border-indigo-200 shadow-sm">
            INTRODUCING LUMEN
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
            Conversational AI for the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Surgical Suite</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-zinc-600 max-w-xl leading-relaxed">
            LUMEN empowers surgeons with <strong className="text-zinc-800">frictionless, hands-free access</strong> to vital information—patient histories, CT scans, 3D models, and procedural checklists—using simple voice commands, preserving total focus and sterility.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/console"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Access Console
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-indigo-200 text-indigo-700 font-semibold rounded-2xl hover:bg-indigo-50 transition-all duration-300 bg-white"
            >
              Explore Capabilities
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>

          {/* Voice example */}
          <div className="mt-12 flex items-center gap-4 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-zinc-200/50 shadow-sm w-fit">
            <div className="flex items-end gap-1 h-5">
              {[12, 8, 16, 6, 14].map((h, index) => (
                <div
                  key={index}
                  className="w-1 bg-indigo-500/80 rounded-full animate-pulse"
                  style={{ height: `${h}px`, animationDelay: `${(index + 1) * 150}ms` }}
                />
              ))}
            </div>
            <span className="text-sm font-mono text-zinc-500">
              "LUMEN, pull up the hemoglobin trends."
            </span>
          </div>
        </div>

        {/* Right — Image */}
        <div className="relative animate-fade-in-up animation-delay-200">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 bg-white p-2">
            <div className="aspect-[4/3] rounded-[1.5rem] bg-zinc-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-zinc-200 opacity-50" />
              <div className="text-center p-8 relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white shadow-md flex items-center justify-center border border-zinc-200/50">
                  <svg className="w-12 h-12 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                  </svg>
                </div>
                <p className="text-zinc-800 font-bold text-xl tracking-tight">SURGICAL CONSOLE</p>
                <p className="text-zinc-500 text-sm mt-2 font-medium">Next-Gen Interface</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
