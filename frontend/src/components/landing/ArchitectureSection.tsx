export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="py-24 bg-white border-t border-slate-100 relative overflow-hidden"
    >
      {/* Background Mesh */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            Built for Scale on <span className="text-sky-600">AWS</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            LUMEN utilizes a highly optimized VPC architecture with isolated
            subnets to ensure sub-millisecond audio streaming and AI processing
            securely across the cloud.
          </p>
        </div>

        {/* Architecture Diagram Container */}
        <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
          <div className="min-w-[900px] xl:min-w-0 w-full flex flex-col xl:flex-row justify-center items-center gap-6 xl:gap-0 mt-8">
            {/* =========================================
                TIER 1: EDGE / CLIENT NETWORK
                ========================================= */}
            <div className="w-full xl:w-[200px] shrink-0 flex flex-col justify-center relative z-20">
              <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center text-center relative hover:shadow-xl transition-shadow duration-300">
                {/* Edge Label */}
                <div className="absolute -top-3 bg-slate-800 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  Edge Network
                </div>
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mb-4 shadow-md mt-2">
                  <svg
                    className="w-6 h-6"
                    viewBox="0 0 76 65"
                    fill="currentColor"
                  >
                    <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  Frontend Client
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Next.js on Vercel
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 w-full flex flex-wrap gap-2 justify-center">
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                    React 19
                  </span>
                  <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                    Three.js
                  </span>
                </div>
              </div>
            </div>

            {/* Connection Arrow 1 (Desktop) */}
            <div className="hidden xl:flex items-center justify-center w-24 shrink-0 relative z-0">
              <div className="w-full h-[2px] bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent w-[200%] animate-[slide-right_2s_linear_infinite]" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2.5 py-1 rounded-md text-[9px] font-bold text-slate-500 border border-slate-100 shadow-sm whitespace-nowrap">
                WSS / HTTPS
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-[2px] border-r-[2px] border-slate-300 rotate-45 translate-x-[1px]" />
            </div>

            {/* =========================================
                TIER 2 & 3: AWS CLOUD REGION (VPC)
                ========================================= */}
            <div className="w-full xl:w-auto bg-slate-50/50 border-[2px] border-dashed border-slate-300 rounded-3xl pb-8 pt-5 px-6 relative z-10 shadow-sm">
              {/* AWS Cloud Label */}
              <div className="absolute top-0 left-8 -translate-y-1/2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <img
                  src="/assets/aws.png"
                  alt="AWS"
                  className="h-3 object-contain"
                />
                AWS Cloud (us-east-1)
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 xl:gap-6 h-full mt-3">
                {/* -------------------------------------
                      PUBLIC SUBNET (PROXY TIER)
                      ------------------------------------- */}
                <div className="w-full md:w-[200px] shrink-0 bg-white border border-sky-200 rounded-2xl p-4 relative flex flex-col justify-center shadow-sm">
                  {/* Label */}
                  <div className="absolute top-0 left-4 -translate-y-1/2 bg-sky-50 px-2.5 py-0.5 text-[9px] font-bold text-sky-600 uppercase tracking-widest border border-sky-200 rounded-md shadow-sm">
                    Public Subnet
                  </div>

                  <div className="flex flex-col items-center text-center mt-3">
                    <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-3 shadow-sm border border-sky-100">
                      <img
                        src="/assets/nginx.png"
                        alt="NGINX"
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">
                      WSS Gateway
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">
                      NGINX Load Balancer
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 w-full flex flex-wrap gap-1.5 justify-center">
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                        ALB
                      </span>
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md border border-slate-200 uppercase">
                        SSL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connection Arrow 2 (Desktop) */}
                <div className="hidden md:flex items-center justify-center w-6 xl:w-8 shrink-0 relative z-0">
                  <div className="w-full h-[2px] bg-slate-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent w-[200%] animate-[slide-right_2s_linear_infinite_0.5s]" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-[2px] border-r-[2px] border-slate-300 rotate-45 translate-x-[1px]" />
                </div>

                {/* -------------------------------------
                      PRIVATE SUBNET (COMPUTE & DATA TIER)
                      ------------------------------------- */}
                <div className="w-full md:w-[560px] shrink-0 bg-white/70 border border-sky-200 rounded-2xl p-4 xl:p-8 relative shadow-sm">
                  {/* Label */}
                  <div className="absolute top-0 left-4 -translate-y-1/2 bg-sky-50 px-2.5 py-0.5 text-[9px] font-bold text-sky-600 uppercase tracking-widest border border-sky-200 rounded-md shadow-sm">
                    Private Subnet
                  </div>

                  <div className="flex flex-col gap-5 xl:gap-6 h-full mt-3">
                    {/* Core Compute Server */}
                    <div className="w-[260px] mx-auto shrink-0 bg-gradient-to-br from-sky-600 to-sky-700 p-6 rounded-2xl shadow-xl shadow-sky-600/20 border border-sky-400 flex flex-col items-center justify-center text-center text-white relative z-10 hover:-translate-y-1 transition-transform duration-300">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                        <img
                          src="/assets/ec2.png"
                          alt="EC2"
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                      <h4 className="font-bold text-white text-base mb-1 tracking-tight">
                        Core Backend
                      </h4>
                      <p className="text-[10px] text-sky-200 font-mono mb-4">
                        AWS EC2 Cluster
                      </p>

                      <div className="flex flex-wrap gap-1.5 justify-center w-full">
                        <span className="px-2 py-1 bg-white/20 rounded font-mono text-[9px] font-bold tracking-wider border border-white/10 shadow-sm">
                          FastAPI
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded font-mono text-[9px] font-bold tracking-wider border border-white/10 shadow-sm">
                          PM2
                        </span>
                        <span className="px-2 py-1 bg-white/20 rounded font-mono text-[9px] font-bold tracking-wider border border-white/10 shadow-sm">
                          WebRTC
                        </span>
                      </div>
                    </div>

                    {/* Distributing Arrows Downward */}
                    <div className="hidden sm:flex justify-center items-center h-5 relative z-0">
                      <div className="w-[2px] h-full bg-slate-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500 to-transparent h-[200%] animate-[slide-down_2s_linear_infinite]" />
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 border-b-[2px] border-r-[2px] border-slate-300 rotate-45 translate-y-[1px]" />
                    </div>

                    {/* Data & AI Tiers - 2x2 Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[480px] mx-auto w-full">
                      {/* Amazon Bedrock */}
                      <div className="bg-white p-3 border border-sky-100 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-600 shrink-0 border border-sky-100">
                          <img
                            src="/assets/bedrock.png"
                            alt="Bedrock"
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[13px] mb-0.5">
                            Amazon Bedrock
                          </h4>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Foundational LLMs
                          </p>
                        </div>
                      </div>

                      {/* Amazon Polly */}
                      <div className="bg-white p-3 border border-sky-100 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 shrink-0 border border-sky-100">
                          <img
                            src="/assets/polly.png"
                            alt="Polly"
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[13px] mb-0.5">
                            Amazon Polly
                          </h4>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Neural TTS
                          </p>
                        </div>
                      </div>

                      {/* Groq LPU */}
                      <div className="bg-white p-3 border border-sky-100 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 shrink-0 border border-sky-100">
                          <img
                            src="/assets/groq.png"
                            alt="Groq"
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[13px] mb-0.5">
                            Groq LPU
                          </h4>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Whisper STT
                          </p>
                        </div>
                      </div>

                      {/* Fast Intent Classifier */}
                      <div className="bg-white p-3 border border-sky-100 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-sky-500 shrink-0 border border-sky-100">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-[13px] mb-0.5">
                            Intent Classifier
                          </h4>
                          <p className="text-[9px] text-slate-500 font-mono">
                            Scikit-learn TF-IDF
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline animation styles for data flows */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slide-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `,
        }}
      />
    </section>
  );
}
