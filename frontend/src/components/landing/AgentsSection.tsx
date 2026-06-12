"use client";
import { AGENT_LIST } from "@/types";

const categoryColors: Record<string, string> = {
  orchestrator: "border-zinc-300 bg-zinc-100",
  protocol: "border-indigo-200 bg-indigo-50/50",
  decision: "border-rose-200 bg-rose-50/50",
  visual: "border-fuchsia-200 bg-fuchsia-50/50",
};

const categoryTextColors: Record<string, string> = {
  orchestrator: "text-zinc-800",
  protocol: "text-indigo-700",
  decision: "text-rose-700",
  visual: "text-fuchsia-700",
};

const categoryLabels: Record<string, string> = {
  orchestrator: "CORE DISPATCHER",
  protocol: "SAFETY & PROTOCOL",
  decision: "CLINICAL INSIGHTS",
  visual: "SPATIAL ANALYSIS",
};

export default function AgentsSection() {
  return (
    <section className="py-32 bg-zinc-50 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mb-20">
          <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-4">
            Specialized Modules
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 leading-tight">
            A Singular Brain.
            <br />
            <span className="text-zinc-400 font-medium">Six Dedicated Experts.</span>
          </h2>
          <p className="mt-8 text-xl text-zinc-600 leading-relaxed font-light">
            The central intelligence engine instantly parses verbal requests and delegates them to the appropriate domain expert—be it for compliance tracking, vital cross-checks, procedural scribing, or imaging manipulation—with zero manual input required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AGENT_LIST.map((agent, i) => (
            <div
              key={agent.id}
              className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-lg ${agent.id === "orchestrator"
                  ? "md:col-span-2 lg:col-span-3 border-indigo-300 bg-indigo-50 shadow-sm"
                  : `${categoryColors[agent.category]} bg-white hover:-translate-y-1`
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={`text-[11px] font-bold tracking-widest uppercase px-2 py-1 rounded-md bg-white/60 border border-white/50 shadow-sm ${categoryTextColors[agent.category]}`}
                  >
                    {categoryLabels[agent.category]}
                  </span>
                  <p className="text-xs font-mono text-zinc-400 mt-2">
                    MOD-{String(i).padStart(3, "0")}
                  </p>
                </div>
              </div>

              <h4 className="text-xl font-bold text-zinc-900 mb-2">
                {agent.name}
              </h4>
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">{agent.description}</p>

              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${agent.id === "orchestrator"
                        ? "bg-indigo-100 border-indigo-200 text-indigo-800"
                        : "bg-white border-zinc-200 text-zinc-600 shadow-sm"
                      }`}
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
