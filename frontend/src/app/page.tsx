import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsAndImpact from "@/components/landing/StatsAndImpact";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import AgentsSection from "@/components/landing/AgentsSection";
import ArchitectureSection from "@/components/landing/ArchitectureSection";
import FAQSection from "@/components/landing/FAQSection";
import AgentInteractionSection from "@/components/landing/AgentInteractionSection";

export default function HomePage() {
  return (
    <main className="bg-white min-h-screen font-sans selection:bg-sky-100 selection:text-sky-900">
      <Navbar />
      <Hero />
      <StatsAndImpact />
      <HowItWorksSection />
      <UseCasesSection />
      <AgentsSection />
      <AgentInteractionSection />
      <ArchitectureSection />
      <FAQSection />

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-sky-100 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-16">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/logo.png"
                  alt="LUMEN Logo"
                  className="h-7 object-contain"
                />
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mb-6">
                Next-generation surgical intelligence system providing real-time
                analytics and AI-driven assistance for modern operating rooms.
              </p>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a
                    href="#agents"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Specialized Agents
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-sky-600 transition-colors"
                  >
                    How it works
                  </a>
                </li>
                <li>
                  <a
                    href="#architecture"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Cloud Architecture
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">Agents</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a
                    href="#agents"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Pre-Op Planner
                  </a>
                </li>
                <li>
                  <a
                    href="#agents"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Real-Time Assistant
                  </a>
                </li>
                <li>
                  <a
                    href="#agents"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Post-Op Analyst
                  </a>
                </li>
                <li>
                  <a
                    href="#agents"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Lead Orchestrator
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-slate-900 mb-4">Tech Stack</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a
                    href="https://aws.amazon.com/ec2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    AWS EC2
                  </a>
                </li>
                <li>
                  <a
                    href="https://aws.amazon.com/bedrock/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Amazon Bedrock
                  </a>
                </li>
                <li>
                  <a
                    href="https://groq.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Groq LPU
                  </a>
                </li>
                <li>
                  <a
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sky-600 transition-colors"
                  >
                    Next.js
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} LUMEN Intelligence. All rights
              reserved.
            </p>
            <div className="flex items-center gap-1.5 font-medium text-sm">
              <span className="text-slate-600">Made with</span>
              <span className="text-sky-500 animate-pulse text-lg">❤️</span>
              <span className="text-slate-600">by</span>
              <span className="font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-default">
                Team Kaizen
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
