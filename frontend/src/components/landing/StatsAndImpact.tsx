export default function StatsAndImpact() {
  return (
    <section className="py-20 bg-slate-900 border-t border-slate-800 relative overflow-hidden text-white">
      {/* Dark background mesh */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-slate-800 py-12">
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">
              &lt;500ms
            </p>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Voice Latency
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">
              100%
            </p>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Hands-Free
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">
              Zero
            </p>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Screen Touches
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl lg:text-5xl font-bold text-white mb-2">6+</p>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
              Specialist Models
            </p>
          </div>
        </div>

        {/* Impact Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Large Card */}
          <div className="lg:col-span-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-700 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/20 rounded-full blur-[80px] -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="inline-flex px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-xs font-bold text-sky-400 uppercase tracking-wide mb-6 shadow-sm">
                Voice-First
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-lg">
                Our team of <span className="text-sky-400">AI Agents</span> is
                here to provide the best possible support.
              </h3>
              <p className="text-slate-400 max-w-md mb-8 text-lg">
                Navigate complex 3D scans, retrieve patient history, and log
                critical events—all without breaking scrub.
              </p>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group"
              >
                Explore Tech{" "}
                <span className="w-8 h-8 rounded-full bg-sky-600 border border-sky-400 shadow-sky-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  →
                </span>
              </a>
            </div>
            {/* Decorative background visual */}
            <div className="absolute bottom-[-30%] right-[-20%] w-[60%] h-[80%] bg-gradient-to-tl from-slate-700/50 to-transparent rounded-tl-[4rem] border-t border-l border-slate-600 pointer-events-none hidden md:block">
              {/* <div className="absolute top-8 left-8 w-24 h-24 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-600 shadow-xl flex items-center justify-center animate-[bounce_5s_infinite]">
                <div className="w-12 h-2 bg-slate-600 rounded-full mb-2"></div>
                <div className="w-16 h-2 bg-sky-500 rounded-full"></div>
              </div> */}
            </div>
          </div>

          {/* Small Card 1 */}
          <div className="lg:col-span-4 bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="inline-flex px-3 py-1 bg-sky-500/10 border border-sky-500/30 rounded-full text-xs font-bold text-sky-400 uppercase tracking-wide mb-6 shadow-sm">
                Integrations
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Connect to your existing EMR.
              </h3>
              <p className="text-slate-400 text-sm">
                Seamlessly pull data from Epic, Cerner, or custom hospital APIs.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {["epic", "cerner", "pacs"].map((sys, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-slate-700 shadow-sm flex items-center justify-center border border-slate-600"
                >
                  <div className="w-4 h-4 bg-slate-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Small Card 2 */}
          <div className="lg:col-span-6 bg-slate-800/50 border border-slate-700 backdrop-blur-sm rounded-3xl p-8 relative overflow-hidden text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-900/40 to-transparent opacity-50" />
            <div className="relative z-10">
              <div className="inline-flex px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wide mb-6">
                Security
              </div>
              <h3 className="text-2xl font-bold mb-2">HIPAA Compliant.</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Enterprise-grade security ensuring all voice transcripts and
                patient records are fully encrypted and anonymized.
              </p>
            </div>
          </div>

          {/* Small Card 3 */}
          <div className="lg:col-span-6 bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Expert Protocols.
              </h3>
              <p className="text-slate-400 text-sm">
                Trained on the latest medical guidelines.
              </p>
            </div>
            <div className="w-16 h-16 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-400 border border-sky-500/30">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
