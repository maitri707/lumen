"use client";

import { useState } from "react";

const FAQ_DATA = [
  {
    question: "How does LUMEN achieve sub-500ms audio latency?",
    answer: "We utilize an optimized WebRTC pipeline routing directly to an AWS EC2 cluster, bypassing traditional HTTP overhead. Combined with Groq LPUs for Whisper Large V3 inference, we achieve near-instant speech-to-text processing."
  },
  {
    question: "Is patient data secure and HIPAA compliant?",
    answer: "Yes. LUMEN operates within a secure VPC with isolated subnets and strict zero-trust principles. All data is processed ephemerally in-memory and never stored, ensuring full HIPAA compliance."
  },
  {
    question: "Can LUMEN integrate with existing hospital systems like Epic or Cerner?",
    answer: "Absolutely. Our architecture is designed to interface with major EHR and PACS systems via HL7 and FHIR standards, allowing real-time data retrieval during procedures without breaking sterility."
  },
  {
    question: "What happens if the internet connection drops during surgery?",
    answer: "LUMEN is designed as an assistive tool, not a critical life-support system. In the event of a disconnect, the surgical team simply reverts to standard manual protocols. The system auto-recovers gracefully once connection is restored."
  },
  {
    question: "How does the system optimally route commands to the right agent?",
    answer: "To ensure blazing fast response times, LUMEN uses a lightweight, highly-optimized Intent Classifier (built with Scikit-learn and TF-IDF). This classifier instantly analyzes the surgeon's voice command and routes it directly to the correct specialized agent, completely avoiding the high latency of using a large language model just for routing."
  },
  {
    question: "Why use specialized agents instead of a single LLM?",
    answer: "Surgical workflows are highly complex. By routing intents to specialized agents (e.g., an Anatomy Spotter vs a Drug Checker), we ensure higher accuracy, lower hallucination rates, and faster execution for specific clinical tasks."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold tracking-widest mb-6 shadow-sm uppercase">
            FAQs
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Find quick answers to the most common questions about our platform's architecture, security, and integration capabilities.
          </p>
        </div>

        <div className="flex flex-col border-t border-slate-200 pt-2">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className="border-b border-slate-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between py-6 text-left group focus:outline-none"
                >
                  <span className="text-[17px] md:text-lg font-medium text-slate-800 group-hover:text-sky-600 transition-colors pr-8">
                    {faq.question}
                  </span>
                  <span className="text-slate-400 text-2xl group-hover:text-sky-600 transition-colors shrink-0 font-light">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-slate-500 leading-relaxed text-sm md:text-base pr-8">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
