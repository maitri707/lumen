export default function UseCasesSection() {
  const cases = [
    {
      title: "Pre-Op Briefing",
      description:
        "Quickly pull up patient history, allergies, and the surgical plan while scrubbing in. Ensure all team members are aligned without touching a screen.",
      icon: "clipboard-document-check",
      color: "sky",
    },
    {
      title: "Mid-Surgery Assistance",
      description:
        "Ask LUMEN to highlight danger zones on a 3D model, check drug contraindications, or pull up recent lab results without breaking the sterile field.",
      icon: "heart",
      color: "indigo",
    },
    {
      title: "Post-Op Documentation",
      description:
        "Automatically generate an Operative Report in standard SBAR format based on the voice logs recorded throughout the procedure.",
      icon: "document-text",
      color: "teal",
    },
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden text-white">
      {/* Dark background mesh */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Real-world applications.
            </h2>
          </div>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg lg:text-right">
            Designed specifically for the high-stakes environment of the
            operating room, LUMEN adapts to every phase of surgery.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((scenario, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700 shadow-sm hover:shadow-[0_0_25px_rgba(14,165,233,0.15)] hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 group backdrop-blur-sm"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm ${
                  scenario.color === "sky"
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                    : scenario.color === "indigo"
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
                      : "bg-teal-500/10 text-teal-400 border border-teal-500/30"
                } group-hover:scale-110 transition-transform`}
              >
                {/* Abstract Icon Placeholder depending on type */}
                {scenario.icon === "heart" && (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
                {scenario.icon === "clipboard-document-check" && (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                    />
                  </svg>
                )}
                {scenario.icon === "document-text" && (
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                {scenario.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {scenario.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
