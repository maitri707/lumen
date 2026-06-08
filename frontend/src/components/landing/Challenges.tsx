"use client";

const CHALLENGES = [
  {
    icon: (
      <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: "Biliary Injury Prevention",
    stat: "Merely <strong>23.1%</strong> of laparoscopic cholecystectomies contain adequate Critical View of Safety (CVS) documentation—the main defense against bile duct injuries.",
    solution: "The Compliance Agent verbally confirms CVS visualization and instantly captures a time-stamped visual record for medicolegal protection.",
    citation: "Terho et al. 2021 · PMID 33975802",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: "Protocol Adherence",
    stat: "Strict use of the WHO Surgical Safety Checklist slashes in-hospital mortality by <strong>47%</strong> and major complications by <strong>36%</strong>.",
    solution: "The Protocol Agent projects the phase-relevant WHO checklist directly onto the surgical display, advancing only when verbally verified by the surgeon.",
    citation: "Haynes et al. 2009 · NEJM · PMID 19144931",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-fuchsia-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "Hemorrhage Monitoring",
    stat: "Visual estimation of intraoperative blood loss is notoriously inaccurate, with underestimations ranging from <strong>52% to 85%</strong>.",
    solution: "The Fluid Agent maintains a running tally of estimated blood loss, proactively alerting the team when volumes exceed critical safety thresholds.",
    citation: "PMC7943515",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Post-Op Documentation",
    stat: "Physicians average <strong>15.6 days</strong> to finalize operative reports, compared to a mere 28 minutes when utilizing structured voice-assisted templating.",
    solution: "The Scribe Agent logs crucial operative milestones in real time, compiling a comprehensive, structured clinical narrative the moment surgery concludes.",
    citation: "Laflamme et al. · PMC1560865",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "Intraoperative Pharmacovigilance",
    stat: "Approximately <strong>1 in 20</strong> perioperative medication administrations involve an error, with the vast majority deemed highly preventable.",
    solution: "The Pharmacy Agent instantly cross-references proposed medications with patient allergies and active labs, delivering an immediate safety verdict.",
    citation: "Nanji et al. · PMC4681677",
  },
];

export default function Challenges() {
  return (
    <section className="py-24 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-12 text-center md:text-left">
          Operational Hurdles Overcome
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CHALLENGES.map((c) => (
            <div
              key={c.title}
              className="p-8 rounded-3xl border border-zinc-200 bg-white hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="mb-6">
                {c.icon}
              </div>

              <h4 className="text-lg font-bold text-zinc-900 mb-4">
                {c.title}
              </h4>

              <p
                className="text-base text-zinc-600 leading-relaxed mb-6 flex-1 font-light"
                dangerouslySetInnerHTML={{ __html: c.stat }}
              />

              <div className="bg-indigo-50/50 rounded-2xl p-4 mb-6 border border-indigo-100/50">
                <p className="text-sm text-indigo-700 leading-relaxed font-medium">
                  {c.solution}
                </p>
              </div>

              <p className="text-xs text-zinc-400 flex items-center gap-2 mt-auto font-mono">
                <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                {c.citation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
