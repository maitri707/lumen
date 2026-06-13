"use client";

import { useEffect, useState } from "react";

const scenarios = [
  {
    id: "who-timeout",
    name: "Scenario 1: WHO Timeout",
    description: "Demonstrates mandatory safety compliance before incision.",
    steps: [
      {
        title: "Initiation",
        desc: "Surgeon says 'Lumen, initiate WHO Timeout.'",
        activeNodes: ["orchestrator"],
        connections: []
      },
      {
        title: "Patient Verification",
        desc: "Orchestrator tasks the Pre-Op Briefing Agent to verify patient identity and procedure from the EHR.",
        activeNodes: ["orchestrator", "briefing"],
        connections: ["briefing"]
      },
      {
        title: "Checklist Execution",
        desc: "Orchestrator tasks the WHO Timeout Agent to verbally run through the required checklist.",
        activeNodes: ["orchestrator", "timeout"],
        connections: ["timeout"]
      },
      {
        title: "Final Sign-off",
        desc: "Orchestrator logs the successful timeout completion timestamp with the Op Report Agent.",
        activeNodes: ["orchestrator", "report"],
        connections: ["report"]
      }
    ]
  },
  {
    id: "critical-event",
    name: "Scenario 2: Critical Vitals Drop",
    description: "Demonstrates real-time crisis management.",
    steps: [
      {
        title: "Incoming Command",
        desc: "Surgeon: 'BP dropping, administering 5mg Epinephrine.'",
        activeNodes: ["orchestrator"],
        connections: []
      },
      {
        title: "Parallel Delegation",
        desc: "Orchestrator tasks Briefing Agent (check EHR for contraindications) and Op Report Agent (log event).",
        activeNodes: ["orchestrator", "briefing", "report"],
        connections: ["briefing", "report"]
      },
      {
        title: "Real-Time Verification",
        desc: "Briefing Agent returns 'SAFE TO ADMINISTER. No contraindications.'",
        activeNodes: ["briefing", "orchestrator"],
        connections: ["briefing"]
      },
      {
        title: "Event Logging",
        desc: "Op Report Agent timestamps and appends the 5mg push to the final draft.",
        activeNodes: ["report"],
        connections: []
      }
    ]
  },
  {
    id: "post-op",
    name: "Scenario 3: Post-Op Documentation",
    description: "Demonstrates administrative automation.",
    steps: [
      {
        title: "Completion",
        desc: "Surgeon says 'Lumen, surgery complete. Generate report.'",
        activeNodes: ["orchestrator"],
        connections: []
      },
      {
        title: "Data Aggregation",
        desc: "Orchestrator signals the Op Report Agent.",
        activeNodes: ["orchestrator", "report"],
        connections: ["report"]
      },
      {
        title: "Drafting",
        desc: "Op Report Agent compiles the WHO Timeout logs, all vital events, and surgical notes into a standard SBAR format.",
        activeNodes: ["report"],
        connections: []
      },
      {
        title: "EMR Sync",
        desc: "The finalized report is pushed directly into the hospital EMR system.",
        activeNodes: ["report"],
        connections: []
      }
    ]
  }
];

export default function AgentInteractionSection() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  const currentScenario = scenarios[activeScenario];
  const currentStep = currentScenario.steps[activeStep];

  // Automatically cycle through steps every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => {
        if (prevStep + 1 >= currentScenario.steps.length) {
          // Move to next scenario
          setActiveScenario((prevScen) => (prevScen + 1) % scenarios.length);
          return 0;
        }
        return prevStep + 1;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [activeScenario, currentScenario.steps.length]);

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden text-white">
      {/* Dark background mesh */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-widest mb-6">
            Multi-Agent Swarm
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            How the <span className="text-sky-400">Agents</span> Collaborate
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            LUMEN isn't a single monolithic AI. It is a swarm of specialized
            agents orchestrated by a master node, allowing for parallel
            execution and zero-hallucination verification.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: The Visualizer */}
          <div className="relative w-full h-[500px] bg-slate-950/50 rounded-3xl border border-slate-800 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Glow effect behind center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-500/20 blur-[80px] rounded-full" />

            {/* SVG Connecting Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Orchestrator to Briefing (Top Left) */}
              <line
                x1="50%" y1="50%" x2="25%" y2="25%"
                stroke={currentStep.connections?.includes("briefing") ? "#8b5cf6" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("briefing") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
              {/* Orchestrator to Anatomy (Bottom Left) */}
              <line
                x1="50%" y1="50%" x2="25%" y2="75%"
                stroke={currentStep.connections?.includes("anatomy") ? "#f59e0b" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("anatomy") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
              {/* Orchestrator to Timeout (Top Right) */}
              <line
                x1="50%" y1="50%" x2="75%" y2="25%"
                stroke={currentStep.connections?.includes("timeout") ? "#0ea5e9" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("timeout") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
              {/* Orchestrator to Report (Bottom Right) */}
              <line
                x1="50%" y1="50%" x2="75%" y2="75%"
                stroke={currentStep.connections?.includes("report") ? "#10b981" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("report") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
            </svg>

            {/* Center Node: Orchestrator */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("orchestrator") ? "scale-110" : "scale-100 opacity-80"}`}
            >
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("orchestrator") ? "bg-sky-600 border-sky-400 shadow-sky-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("orchestrator") && (
                  <div className="absolute inset-0 rounded-2xl bg-sky-400 animate-ping opacity-20" />
                )}
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div className="mt-3 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                Orchestrator
              </div>
            </div>

            {/* Top Right: WHO Timeout Agent */}
            <div
              className={`absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("timeout") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("timeout") ? "bg-indigo-600 border-indigo-400 shadow-indigo-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("timeout") && (
                  <div className="absolute inset-0 rounded-2xl bg-indigo-400 animate-ping opacity-20" />
                )}
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <div className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                WHO Timeout<br />Agent
              </div>
            </div>

            {/* Bottom Right: Op Report Agent */}
            <div
              className={`absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("report") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("report") ? "bg-teal-600 border-teal-400 shadow-teal-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("report") && (
                  <div className="absolute inset-0 rounded-2xl bg-teal-400 animate-ping opacity-20" />
                )}
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                Op. Report<br />Agent
              </div>
            </div>

            {/* Top Left: Pre-Op Briefing Agent */}
            <div
              className={`absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("briefing") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("briefing") ? "bg-purple-600 border-purple-400 shadow-purple-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("briefing") && (
                  <div className="absolute inset-0 rounded-2xl bg-purple-400 animate-ping opacity-20" />
                )}
                <svg
                  className={`w-7 h-7 ${currentStep.activeNodes.includes("briefing") ? "text-white" : "text-slate-400"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                Pre-Op Briefing<br />Agent
              </div>
            </div>

            {/* Bottom Left: Anatomy Spotter */}
            <div
              className={`absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("anatomy") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("anatomy") ? "bg-amber-600 border-amber-400 shadow-amber-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("anatomy") && (
                  <div className="absolute inset-0 rounded-2xl bg-amber-400 animate-ping opacity-20" />
                )}
                <svg
                  className={`w-7 h-7 ${currentStep.activeNodes.includes("anatomy") ? "text-white" : "text-slate-400"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <div className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                Anatomy<br />Spotter
              </div>
            </div>
          </div>

          {/* Right: The Breakdown */}
          <div className="flex flex-col justify-center">
            
            {/* Scenario Toggles */}
            <div className="flex gap-2 mb-6">
              {scenarios.map((scen, idx) => (
                <button
                  key={scen.id}
                  onClick={() => {
                    setActiveScenario(idx);
                    setActiveStep(0);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeScenario === idx
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700 hover:text-slate-300"
                  }`}
                >
                  Scenario {idx + 1}
                </button>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2 text-white">{currentScenario.name}</h3>
              <p className="text-slate-400">
                {currentScenario.description}
              </p>
            </div>

            <div className="space-y-4">
              {currentScenario.steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeStep === idx
                      ? "bg-slate-800 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-colors ${
                        activeStep === idx
                          ? "bg-sky-500 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4
                        className={`font-bold mb-1 transition-colors ${activeStep === idx ? "text-white" : "text-slate-300"}`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Dash Animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -12;
          }
        }
      `,
        }}
      />
    </section>
  );
}
