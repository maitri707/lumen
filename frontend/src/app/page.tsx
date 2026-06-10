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
      <footer className="max-w-7xl mx-auto px-6 py-10 border-t border-zinc-200/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-400 text-xs mt-12">
        <div className="flex items-center gap-2 font-mono">
          <span className="font-bold text-zinc-700">LUMEN</span>
          <span className="text-zinc-300">|</span>
          <span>Surgical Intelligence System</span>
        </div>
        <div className="flex items-center gap-1">
          <span>Made with</span>
          <span className="text-rose-500 animate-pulse">❤️</span>
          <span>by</span>
          <span className="font-semibold text-zinc-800 hover:text-zinc-950 transition-colors cursor-default">Team Kaizen</span>
        </div>
      </footer>
    </main>
  );
}
