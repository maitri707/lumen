"use client";
import { useState } from "react";

const STEPS = [
  {
    id: "Step 1",
    tag: "Voice Capture",
    title: "Audio Ingestion",
    description: "The clinician issues a command. High-fidelity 16kHz audio is streamed instantly. Intelligent noise-cancellation isolates the command from ambient surgical chatter.",
    badges: ["16kHz Audio", "Noise-Filtering"],
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    id: "Step 2",
    tag: "AI Analysis",
    title: "Bedrock & Claude Integration",
    description: "Amazon Transcribe converts speech to text. Claude processes the request with deep multimodal awareness, understanding the surgical context seamlessly.",
    badges: ["Multimodal", "Real-Time Context"],
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
  },
  {
    id: "Step 3",
    tag: "Dispatch",
    title: "Dynamic Agent Orchestration",
    description: "The core orchestrator seamlessly delegates the task to the appropriate specialized agent—whether it's retrieving imaging, analyzing stats, or logging notes.",
    badges: ["Smart Routing", "Specialized Agents"],
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
  {
    id: "Step 4",
    tag: "Display",
    title: "Heads-Up Rendering",
    description: "Pertinent information is projected directly onto the surgical display. An audio cue confirms success, all while the surgeon's hands remain firmly on the console.",
    badges: ["Visual Overlay", "Zero Contact"],
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
];

export default function Pipeline() {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <section id="how-it-works" className="py-32 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-4">
            System Architecture
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Vocalize. Analyze. Visualize.
          </h2>
          <p className="mt-6 text-zinc-500 text-lg max-w-2xl mx-auto">
            A frictionless journey from spoken word to actionable data, ensuring continuous operation without breaking the sterile field.
          </p>
        </div>

        {/* Steps sequence */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`relative p-8 rounded-3xl transition-all duration-300 border ${activeStep === step.id
                ? "border-indigo-300 bg-white shadow-2xl -translate-y-1"
                : "border-zinc-200 bg-zinc-50 hover:bg-white hover:border-indigo-200"
                }`}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step indicator */}
              <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold mb-6 border ${step.color}`}>
                {step.id}
              </div>

              <h4 className="text-xl font-bold text-zinc-900 mb-4">{step.title}</h4>
              <p className="text-sm text-zinc-600 leading-relaxed mb-8">
                {step.description}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {step.badges.map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1 bg-white border border-zinc-200 text-zinc-600 text-[11px] font-semibold rounded-md shadow-sm"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {/* Connecting line for desktop */}
              {index !== STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-14 -right-4 w-8 h-px border-t-2 border-dashed border-zinc-300 z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
