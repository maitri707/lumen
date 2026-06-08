import Hero from "@/components/landing/Hero";
import Pipeline from "@/components/landing/Pipeline";
import TheProblem from "@/components/landing/TheProblem";
import Challenges from "@/components/landing/Challenges";
import AgentsSection from "@/components/landing/AgentsSection";
import TechStack from "@/components/landing/TechStack";

export default function HomePage() {
  return (
    <main className="bg-zinc-50 min-h-screen">
      <Hero />
      <Pipeline />
      <TheProblem />
      <Challenges />
      <AgentsSection />
      <TechStack />

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-zinc-200 text-center">
        <p className="text-zinc-500 text-base font-medium">
          <span className="text-indigo-600 font-extrabold tracking-tight">LUMEN</span> — Conversational AI for the Surgical Suite
        </p>
        <p className="text-zinc-400 text-sm mt-3">
          Powered by Amazon Bedrock · FastAPI · Next.js · Three.js
        </p>
      </footer>
    </main>
  );
}
