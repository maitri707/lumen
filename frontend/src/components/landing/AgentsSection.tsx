"use client";
import React from "react";
import { AGENT_LIST } from "@/types";
import AgentIcon from "@/components/common/AgentIcon";

export default function AgentsSection() {
  return (
    <section id="agents" className="py-24 bg-white relative">
      {/* Background visual cue */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            What specialized <span className="text-sky-600">agents</span> we
            offer
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            These specialized modules represent a diverse range of surgical
            intelligence capabilities, designed to integrate seamlessly into
            active clinical workflows.
          </p>
        </div>

        {/* 4-Column Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AGENT_LIST.map((agent, index) => {
            const num = String(index + 1).padStart(3, '0');
            const isOrchestrator = agent.id === "orchestrator";

            return (
              <div
                key={agent.id}
                className={`flex flex-col group p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 border ${
                  isOrchestrator ? "bg-sky-50/50 border-sky-200 hover:border-sky-300" : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-start justify-between mb-12">
                  <span className="text-slate-400 font-bold text-sm tracking-widest mt-1">
                    {num}
                  </span>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 border ${
                      isOrchestrator
                        ? "bg-sky-600 border-sky-500 text-white shadow-sky-200"
                        : "bg-white border-slate-100 text-slate-700 group-hover:text-sky-600 group-hover:bg-sky-50 group-hover:border-sky-100"
                    }`}
                  >
                    <AgentIcon agentId={agent.id} className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">
                    {agent.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {agent.description}. Integrates directly with your workflow to provide{" "}
                    <span className="font-semibold text-slate-600">{agent.category}</span>-specific assistance.
                  </p>

                  {/* Capabilities pills */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <span
                        key={cap}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${
                          isOrchestrator 
                            ? "bg-sky-100/50 text-sky-700 border-sky-200/60" 
                            : "text-slate-500 bg-slate-50 border-slate-200/80"
                        }`}
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
