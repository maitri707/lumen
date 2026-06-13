import React from "react";

interface AgentIconProps {
  agentId: string;
  className?: string;
}

export default function AgentIcon({ agentId, className = "w-6 h-6" }: AgentIconProps) {
  // Normalize agent ID to handle potential key mismatches
  const id = agentId.toLowerCase().replace(/_/g, "");

  switch (id) {
    case "orchestrator":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer high-tech dotted boundary ring */}
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1} strokeDasharray="3 3" className="opacity-40 animate-[spin_40s_linear_infinite]" />
          {/* Circuit hub ring */}
          <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth={1.5} className="opacity-80" />
          {/* Core neural chip */}
          <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" fill="currentColor" stroke="currentColor" strokeWidth={0.5} />
          {/* High-speed data buses */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M6.34 6.34l2.12 2.12M15.54 15.54l2.12 2.12M6.34 17.66l2.12-2.12M15.54 8.46l2.12-2.12" />
        </svg>
      );

    case "anatomy":
    case "anatomyspotter":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Target Reticle */}
          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
          <circle cx="12" cy="12" r="6" strokeDasharray="2 2" strokeWidth={1.2} className="opacity-70" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3M12 18v3M3 12h3M19 12h3" />
          {/* Scanner Crosshairs */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8.5 10c1-1.5 2.5-2 3.5-2s2.5.5 3.5 2M8.5 14c1 1.5 2.5 2 3.5 2s2.5-.5 3.5-2"
            className="opacity-70"
          />
          {/* Center pinpoint */}
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );

    case "briefing":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Clipboard Outline */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          {/* Board Clip */}
          <rect x="9" y="3" width="6" height="3.5" rx="1.2" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />
          {/* Patient EKG Sparkline */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9.5h1.5l1-2.5 1.5 5.5 1-3.5h2.5" />
          {/* Data fields lines */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14h8M8 17.5h5" className="opacity-60" />
        </svg>
      );

    case "timeout":
    case "whotimeout":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Compliance Shield */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 22s8-4 8-10V5.5L12 2 4 5.5V12c0 6 8 10 8 10z"
          />
          {/* Verified Checkmark */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.25 11.75l1.75 1.75 3.75-3.75"
          />
        </svg>
      );

    case "visual":
    case "visualassistant":
    case "screenadvisor":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Viewport capture frame corners */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8.5V5h3.5m7 0H19v3.5m0 7V19h-3.5m-7 0H5v-3.5" />
          {/* Medical camera lens outer ring */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
          {/* Lens center Iris */}
          <circle cx="12" cy="12" r="3.5" strokeWidth={1.5} />
          <circle cx="13" cy="11" r="1" fill="currentColor" />
        </svg>
      );

    case "report":
    case "opreport":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Operative Report Sheet with clean fold */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6M9 15.5h6m2.5 5H6.5a2 2 0 01-2-2V5.5a2 2 0 012-2h6.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18.5a2 2 0 01-2 2z"
          />
          {/* Paper dog-ear line */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 3.5v5.5h5.5" />
          {/* Structured checklist checks on left side */}
          <circle cx="7" cy="12" r="0.75" fill="currentColor" />
          <circle cx="7" cy="15.5" r="0.75" fill="currentColor" />
        </svg>
      );

    case "drug":
    case "drugchecker":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Capsule pill shell half 1 */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h4.5a3 3 0 013 3v0a3 3 0 01-3 3h-4.5M10.5 6a3 3 0 00-3 3v0a3 3 0 003 3" />
          {/* Capsule pill shell half 2 */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 12h4.5a3 3 0 013 3v0a3 3 0 01-3 3h-4.5M10.5 12a3 3 0 00-3 3v0a3 3 0 003 3" />
          {/* Medical validation cross */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6M9 12h6" className="opacity-80" />
        </svg>
      );

    case "handoff":
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Transfer File Clipboard */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="3" rx="1" strokeWidth="1.5" />
          {/* Dynamic shift transfer arrow */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12.5h8m0 0l-3.2-3.2M16 12.5l-3.2 3.2" />
        </svg>
      );

    default:
      // High-quality fallback circular info node
      return (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" />
        </svg>
      );
  }
}
