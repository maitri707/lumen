"use client";

import { useEffect, useState } from "react";

const scenarios = [
  {
    id: "critical-event",
    name: "Scenario 1: Critical Event",
    description: "Watch how the swarm handles a critical event without blocking the surgeon.",
    steps: [
      {
        title: "Incoming Command",
        desc: "Lead Orchestrator receives: 'BP dropping, administering 5mg Epinephrine.'",
        activeNodes: ["orchestrator"],
        connections: []
      },
      {
        title: "Parallel Delegation",
        desc: "Orchestrator immediately passes context to the Real-Time Assistant and Post-Op Analyst.",
        activeNodes: ["orchestrator", "assistant", "analyst"],
        connections: ["assistant", "analyst"]
      },
      {
        title: "Real-Time Verification",
        desc: "Assistant checks EHR for contraindications and returns 'SAFE TO ADMINISTER'.",
        activeNodes: ["assistant", "orchestrator"],
        connections: ["assistant"]
      },
      {
        title: "Event Logging",
        desc: "Analyst successfully appends the administration event to the operative report.",
        activeNodes: ["analyst"],
        connections: []
      }
    ]
  },
  {
    id: "pre-op",
    name: "Scenario 2: Pre-Op Planning",
    description: "Surgeon asks to review the 3D surgical plan and patient anatomy before incision.",
    steps: [
      {
        title: "Surgeon Request",
        desc: "'Lumen, pull up the 3D resection plan for this patient.'",
        activeNodes: ["orchestrator"],
        connections: []
      },
      {
        title: "Data Retrieval",
        desc: "Orchestrator tasks the Pre-Op Planner to fetch the patient's MRI data.",
        activeNodes: ["orchestrator", "planner"],
        connections: ["planner"]
      },
      {
        title: "Anatomy Analysis",
        desc: "Anatomy Spotter highlights the tumor margins on the 3D model.",
        activeNodes: ["orchestrator", "anatomy"],
        connections: ["anatomy"]
      },
      {
        title: "Visual Delivery",
        desc: "Both agents return the data to the Orchestrator, which displays it on the OR monitors.",
        activeNodes: ["orchestrator"],
        connections: ["planner", "anatomy"]
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
              {/* Orchestrator to Planner (Top Left) */}
              <line
                x1="50%" y1="50%" x2="25%" y2="25%"
                stroke={currentStep.connections?.includes("planner") ? "#8b5cf6" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("planner") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
              {/* Orchestrator to Anatomy (Bottom Left) */}
              <line
                x1="50%" y1="50%" x2="25%" y2="75%"
                stroke={currentStep.connections?.includes("anatomy") ? "#f59e0b" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("anatomy") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
              {/* Orchestrator to Assistant (Top Right) */}
              <line
                x1="50%" y1="50%" x2="75%" y2="25%"
                stroke={currentStep.connections?.includes("assistant") ? "#0ea5e9" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("assistant") ? "animate-[dash_1s_linear_infinite]" : ""}`}
              />
              {/* Orchestrator to Analyst (Bottom Right) */}
              <line
                x1="50%" y1="50%" x2="75%" y2="75%"
                stroke={currentStep.connections?.includes("analyst") ? "#10b981" : "#1e293b"}
                strokeWidth="2"
                strokeDasharray="6 6"
                className={`transition-colors duration-500 ${currentStep.connections?.includes("analyst") ? "animate-[dash_1s_linear_infinite]" : ""}`}
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

            {/* Top Right: Real-Time Assistant */}
            <div
              className={`absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("assistant") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("assistant") ? "bg-indigo-600 border-indigo-400 shadow-indigo-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("assistant") && (
                  <div className="absolute inset-0 rounded-2xl bg-indigo-400 animate-ping opacity-20" />
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
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <div className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                Real-Time<br />Assistant
              </div>
            </div>

            {/* Bottom Right: Post-Op Analyst */}
            <div
              className={`absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("analyst") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("analyst") ? "bg-teal-600 border-teal-400 shadow-teal-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("analyst") && (
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
                Post-Op<br />Analyst
              </div>
            </div>

            {/* Top Left: Pre-Op Planner */}
            <div
              className={`absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-all duration-500 ${currentStep.activeNodes.includes("planner") ? "scale-110" : "scale-100 opacity-60"}`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative ${currentStep.activeNodes.includes("planner") ? "bg-purple-600 border-purple-400 shadow-purple-500/50" : "bg-slate-800 border-slate-700"}`}
              >
                {currentStep.activeNodes.includes("planner") && (
                  <div className="absolute inset-0 rounded-2xl bg-purple-400 animate-ping opacity-20" />
                )}
                <svg
                  className={`w-7 h-7 ${currentStep.activeNodes.includes("planner") ? "text-white" : "text-slate-400"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                  />
                </svg>
              </div>
              <div className="mt-2 text-[10px] text-slate-300 font-bold uppercase tracking-widest text-center">
                Pre-Op<br />Planner
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
