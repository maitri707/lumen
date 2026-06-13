"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side: Large Image with Overlays */}
        <div className="relative w-full h-[600px] lg:h-[700px] rounded-[3rem] overflow-hidden bg-slate-100">
          {/* Main Image */}
          <img
            src="/assets/landing.jpg"
            alt="Medical Professional"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Top Right Floating Badge - 'Explore Services' */}
          <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md rounded-full p-2 pr-6 shadow-xl border border-white/50">
            <a
              href="#agents"
              className="group flex items-center gap-4 transition-transform hover:scale-105"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-sky-50 text-sky-600 group-hover:bg-sky-100 transition-colors">
                <svg
                  className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </div>
              <span className="font-bold text-slate-900 text-sm leading-tight">
                Explore Services
              </span>
            </a>
          </div>

          {/* Bottom Left Floating Badge - 'System Status' */}
          <div className="absolute bottom-8 left-8 right-8 lg:right-auto bg-white/30 backdrop-blur-md border border-white/40 p-4 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border border-white/50 relative shrink-0">
                <div className="w-3.5 h-3.5 bg-sky-400 rounded-full animate-ping absolute" />
                <div className="w-3.5 h-3.5 bg-sky-500 rounded-full relative z-10 border-2 border-white/80" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-white font-bold text-sm leading-tight">
                  System Active
                </p>
                <p className="text-white/90 text-xs font-medium">
                  Real-time intelligence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/console"
                className="h-10 px-6 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Copy & Features */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6 max-w-xl">
            Voice-first AI for the{" "}
            <span className="text-sky-600">modern operating room</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-lg mb-8">
            LUMEN provides real-time surgical intelligence through an ultra-low
            latency voice interface. Powered by advanced LPUs, it acts as a
            seamless extension of your surgical team.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href="/console"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-sky-600 text-white font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/20"
            >
              Access Console{" "}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              How It Works
            </a>
          </div>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Example Voice Command
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="w-10 h-10 rounded-full bg-white border border-sky-100 shadow-sm flex items-center justify-center shrink-0 relative z-10">
                <svg
                  className="w-5 h-5 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                  />
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-slate-700 font-medium leading-relaxed italic text-lg">
                  "Lumen, pull up the patient's pre-op MRI and calculate the
                  optimal incision margins."
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex gap-1 items-center h-3">
                    {[8, 12, 6, 10, 7].map((h, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full bg-sky-400 animate-pulse`}
                        style={{
                          height: `${h}px`,
                          animationDelay: `${(i + 1) * 100}ms`,
                        }}
                      />
                    ))}
                  </span>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                    Processing...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
