import Link from 'next/link';

export default function DemoSection() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-200 bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
            Live Preview
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            See LUMEN in <span className="text-sky-600">Action</span>
          </h2>
          <p className="text-slate-500 text-lg leading-relaxed">
            Experience the real-time surgical intelligence dashboard. Voice commands are processed in milliseconds, instantly pulling up relevant patient data and 3D anatomy models.
          </p>
        </div>

        {/* Browser Mockup */}
        <div className="max-w-5xl mx-auto rounded-xl border border-slate-200/60 shadow-2xl overflow-hidden bg-white relative">
          
          {/* Browser Header */}
          <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="mx-auto flex items-center justify-center bg-white border border-slate-200 text-slate-400 text-xs font-mono py-1 px-32 rounded-md shadow-sm">
              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              lumen-intelligence.com/console
            </div>
          </div>

          {/* Console Interface Mockup */}
          <div className="flex h-[400px] md:h-[600px] bg-slate-900 overflow-hidden relative">
            
            {/* Sidebar */}
            <div className="w-16 md:w-64 border-r border-slate-800 bg-slate-950 flex flex-col p-4 gap-4 hidden sm:flex">
              <div className="flex items-center gap-3 text-white font-bold text-lg mb-8">
                 <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">L</div>
                 <span className="hidden md:block tracking-widest">LUMEN</span>
              </div>
              
              <div className="w-full h-10 rounded-lg bg-slate-800/50 mb-2 animate-pulse" />
              <div className="w-full h-10 rounded-lg bg-slate-800/30 mb-2 animate-pulse" />
              <div className="w-full h-10 rounded-lg bg-slate-800/30 mb-2 animate-pulse" />
            </div>

            {/* Main Area */}
            <div className="flex-1 p-6 flex flex-col gap-6">
               <div className="flex justify-between items-center">
                  <div className="w-48 h-8 bg-slate-800 rounded-md animate-pulse" />
                  <div className="w-32 h-8 bg-sky-900/40 rounded-full animate-pulse border border-sky-800" />
               </div>

               <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="col-span-2 bg-slate-800/40 border border-slate-700 rounded-xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
                    {/* Simulated 3D Model Area */}
                    <svg className="w-48 h-48 text-sky-500/20 animate-[spin_10s_linear_infinite]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    <div className="absolute bottom-6 bg-slate-950/80 backdrop-blur border border-slate-800 px-4 py-2 rounded-lg text-sky-400 font-mono text-sm shadow-xl">
                       Rendering: Heart.obj
                    </div>
                  </div>
                  
                  <div className="col-span-1 flex flex-col gap-6">
                     <div className="h-1/2 bg-slate-800/40 border border-slate-700 rounded-xl p-6 relative">
                        <div className="w-1/3 h-4 bg-slate-700 rounded mb-4" />
                        <div className="space-y-3">
                          <div className="w-full h-3 bg-slate-700 rounded animate-pulse" />
                          <div className="w-5/6 h-3 bg-slate-700 rounded animate-pulse" />
                          <div className="w-4/6 h-3 bg-slate-700 rounded animate-pulse" />
                        </div>
                     </div>
                     <div className="h-1/2 bg-slate-800/40 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                       <div className="absolute inset-x-0 bottom-0 h-1 bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                       <div className="flex items-center justify-between mb-4">
                         <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center animate-ping">
                            <div className="w-4 h-4 rounded-full bg-sky-500" />
                         </div>
                         <div className="text-xs font-mono text-sky-400">Recording...</div>
                       </div>
                       <p className="text-slate-300 text-sm italic">"Show me the patient's recent CT scan."</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Overlay Play Button Area */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center hover:bg-transparent transition-colors duration-500 group">
             <Link href="/console" className="w-24 h-24 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-sky-500 group-hover:text-white text-sky-600">
               <svg className="w-10 h-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
             </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
