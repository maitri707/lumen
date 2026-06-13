export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-white border-t border-slate-100"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            How It Works in <span className="text-sky-600">3 Steps</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            LUMEN operates entirely hands-free. From the moment the surgeon
            speaks, it takes less than 500 milliseconds for our cloud
            architecture to process the command and execute it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-slate-100 -translate-y-1/2 z-0" />

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-white border-[8px] border-slate-50 rounded-full flex items-center justify-center shadow-lg group-hover:border-sky-50 group-hover:scale-110 transition-all duration-300 mb-8">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                <span className="text-xl font-bold">1</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              Voice Command
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              The surgeon issues a natural language command hands-free, captured
              by standard OR microphones.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-white border-[8px] border-slate-50 rounded-full flex items-center justify-center shadow-lg group-hover:border-sky-50 group-hover:scale-110 transition-all duration-300 mb-8">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-sky-600/30">
                <span className="text-xl font-bold">2</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              Sub-second Routing
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Our lightweight Intent Classifier analyzes the audio in real-time,
              routing the request to the correct specialized agent.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-24 h-24 bg-white border-[8px] border-slate-50 rounded-full flex items-center justify-center shadow-lg group-hover:border-sky-50 group-hover:scale-110 transition-all duration-300 mb-8">
              <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                <span className="text-xl font-bold">3</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
              Action Execution
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              The agent retrieves EHR data, manipulates 3D models, or logs
              events, displaying the result on the console screen instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
