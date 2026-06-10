"use client";

export default function TheProblem() {
  return (
    <section className="py-32 bg-zinc-50 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-rose-500 uppercase mb-4">
            The Bottleneck
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-zinc-900 leading-tight">
            Sterile isolation.
            <br />
            <span className="text-zinc-400 font-medium">
              Crucial data stranded.
            </span>
          </h2>
          <p className="mt-8 text-xl text-zinc-600 leading-relaxed max-w-2xl font-light">
            Once a surgeon is scrubbed in and operating the robotic console, their hands are entirely occupied within the sterile field. Keyboards and mice are obsolete.
          </p>
          <p className="mt-6 text-xl text-zinc-600 leading-relaxed max-w-2xl font-light">
            Retrieving essential patient records, lab results, or 3D scans forces the surgeon to either break their sterile scrub or depend on circulating nurses—introducing unnecessary cognitive friction and critical delays.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Physical Constraint",
              desc: "Operating controls require total hand engagement during complex surgical maneuvers.",
            },
            {
              icon: (
                <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Data Latency",
              desc: "Relaying requests through personnel introduces lag and increases cognitive burden.",
            },
            {
              icon: (
                <svg className="w-8 h-8 text-fuchsia-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              ),
              title: "Loss of Momentum",
              desc: "Diverting attention from the surgical field breaks concentration and disrupts the operative flow.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-8 bg-white rounded-3xl border border-zinc-200 shadow-sm hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h4 className="text-xl font-bold text-zinc-900 mb-3">
                {card.title}
              </h4>
              <p className="text-zinc-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
