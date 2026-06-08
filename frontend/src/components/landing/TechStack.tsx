"use client";

const TECH = [
  { name: "Amazon Bedrock", desc: "Native audio & vision models, real-time reasoning", icon: "🧠" },
  { name: "Amazon Transcribe", desc: "Continuous high-fidelity speech recognition", icon: "🎙️" },
  { name: "Amazon Polly", desc: "Dynamic neural text-to-speech feedback", icon: "🔊" },
  { name: "FastAPI + WebSockets", desc: "Ultra-low-latency bidirectional streaming", icon: "⚡" },
  { name: "Three.js", desc: "Interactive 3D anatomical visualization", icon: "🫀" },
  { name: "AudioWorklet API", desc: "Precision audio capture & playback", icon: "🎛️" },
  { name: "LIDC-IDRI Dataset", desc: "High-resolution DICOM integration", icon: "🩻" },
  { name: "Python 3.11", desc: "Asynchronous backend orchestration", icon: "🐍" },
];

export default function TechStack() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-4">
            Core Infrastructure
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Powered by Next-Gen AI
          </h2>
          <p className="mt-6 text-lg text-zinc-500 max-w-2xl mx-auto font-light">
            An enterprise-ready foundation leveraging advanced multimodal reasoning, highly specialized agents, and ultra-low-latency bidirectional streaming.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECH.map((t) => (
            <div
              key={t.name}
              className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50 hover:bg-indigo-50 hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 text-center group"
            >
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{t.icon}</span>
              </div>
              <h4 className="text-lg font-bold text-zinc-900 mb-2">{t.name}</h4>
              <p className="text-sm text-zinc-600 font-light leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
