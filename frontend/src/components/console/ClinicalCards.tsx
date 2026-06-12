import { ThreeDViewer } from "./ThreeDViewer";

/* ── Status badge color helper ─────────────────────────────── */
function labStatusClasses(status: string) {
  switch (status) {
    case "low":
      return { badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" };
    case "elevated":
    case "high":
      return { badge: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-500" };
    case "critical":
      return { badge: "bg-red-200 text-red-800 border-red-300", dot: "bg-red-600" };
    default:
      return { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" };
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "low": return "Low";
    case "elevated": return "Elevated";
    case "high": return "High";
    case "critical": return "Critical";
    default: return "Normal";
  }
}

export function ClinicalCard({ overlay, onClose, inline = false }: { overlay: any; onClose: () => void; inline?: boolean }) {
  const renderContent = () => {
    /* ────────────────────────────────────────────────────────────
       BRIEFING PATIENT DATA — rich structured view
       ──────────────────────────────────────────────────────────── */
    if (overlay.type === "briefing_patient_data") {
      const c = overlay.content;
      const labs = c.labs || {};
      const vitals = c.vitals || {};
      const allergyDetails: { drug: string; reaction: string }[] = c.allergy_details || [];
      const meds: string[] = c.medications || [];
      const medNotes: string[] = c.medication_notes || [];
      const ctx = c.procedural_context || {};
      const ctxSteps: string[] = ctx.steps || [];
      const ctxWarnings: string[] = ctx.warnings || [];

      return (
        <div className="space-y-5 text-[13px]">
          {/* ── Patient Identity Bar ────────────────────────────── */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-sky-50/60 rounded-xl p-3 border border-slate-100">
            <div>
              <p className="text-base font-extrabold text-slate-800 tracking-tight">{c.name}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-0.5">{c.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {c.blood_type && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 rounded-md tracking-wider">
                  {c.blood_type}
                </span>
              )}
            </div>
          </div>

          {/* ── Patient Vitals (Labs) ──────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Patient Vitals</p>
            <div className="space-y-1.5">
              {Object.entries(labs).map(([key, lab]: [string, any]) => {
                const st = labStatusClasses(lab.status || "normal");
                return (
                  <div key={key} className="flex items-start justify-between py-1.5 border-b border-slate-50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 capitalize text-[13px]">{key.replace(/_/g, " ")}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-bold text-slate-800 text-sm tabular-nums">
                        {lab.value} <span className="text-slate-400 text-[11px] font-medium">{lab.unit}</span>
                      </p>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${st.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
                          {statusLabel(lab.status || "normal")}
                        </span>
                      </div>
                      {lab.note && <p className="text-[10px] text-slate-400 mt-0.5 italic">{lab.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Vitals (BP / HR / SpO2 / Temp) ────────────────── */}
          {Object.keys(vitals).length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Vital Signs</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(vitals).map(([key, v]: [string, any]) => (
                  <div key={key} className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{key.replace(/_/g, " ")}</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5 tabular-nums">{v.value} <span className="text-slate-400 text-[11px] font-medium">{v.unit}</span></p>
                    {v.note && <p className="text-[9px] text-slate-400 mt-0.5">{v.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Demographics ──────────────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Demographics</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Weight</p>
                <p className="text-sm font-bold text-slate-800">{c.weight_kg} <span className="text-[11px] text-slate-400">kg</span></p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Age</p>
                <p className="text-sm font-bold text-slate-800">{c.age} <span className="text-[11px] text-slate-400">years</span></p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Sex</p>
                <p className="text-sm font-bold text-slate-800">{c.sex}</p>
              </div>
            </div>
          </div>

          {/* ── Diagnosis & Procedure ─────────────────────────── */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Diagnosis</p>
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3">
              <p className="font-bold text-sky-900 text-[13px]">{c.diagnosis}</p>
              {c.staging && <p className="text-[11px] text-sky-600 font-mono mt-1 tracking-wider">{c.staging}</p>}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Procedure</p>
            <div className="bg-violet-50/60 border border-violet-100 rounded-xl p-3">
              <p className="font-bold text-violet-900 text-[13px]">{c.procedure}</p>
              {c.surgical_system && <p className="text-[11px] text-violet-500 font-mono mt-1">{c.surgical_system}</p>}
            </div>
          </div>

          {/* ── Allergies ─────────────────────────────────────── */}
          {allergyDetails.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Allergies</p>
              <div className="space-y-1.5">
                {allergyDetails.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 bg-red-50/80 border border-red-100 rounded-lg px-3 py-2">
                    <span className="text-red-500 text-sm">⚠</span>
                    <div>
                      <span className="font-bold text-red-700 text-[12px]">{a.drug}</span>
                      <span className="text-red-400 text-[11px] ml-1">({a.reaction})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Medications ───────────────────────────────────── */}
          {meds.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Medications</p>
              <div className="space-y-1">
                {meds.map((m, i) => (
                  <p key={i} className="text-[12px] text-slate-700 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    {m}
                  </p>
                ))}
              </div>
              {medNotes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {medNotes.map((n, i) => (
                    <p key={i} className="text-[10px] text-amber-600 italic font-medium flex items-center gap-1">
                      <span>📌</span> {n}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Procedural Context ────────────────────────────── */}
          {ctx.phase_name && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2.5">Procedural Context</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="font-bold text-slate-800 text-[13px] mb-2.5">{ctx.phase_name}</p>

                {ctxWarnings.map((w: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-2">
                    <span className="text-amber-500 text-sm mt-0.5">⚠</span>
                    <p className="text-[12px] text-amber-800 font-medium">{w.replace(/^⚠\s*/, "")}</p>
                  </div>
                ))}

                <div className="space-y-1.5 mt-1">
                  {ctxSteps.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold flex items-center justify-center border border-sky-200 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-[12px] text-slate-700 font-medium leading-snug">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Basic formatting for different overlay types
    if (overlay.type === "patient_data" || overlay.type === "all_patient_data") {
      if (overlay.content.patients && Array.isArray(overlay.content.patients)) {
        return (
          <div className="space-y-3">
            <p className="text-slate-500 text-xs font-semibold mb-2 uppercase tracking-wider">Scheduled Patients</p>
            {overlay.content.patients.map((pt: any, i: number) => (
              <div key={i} className="flex flex-col p-2 bg-slate-50 rounded border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{pt.name}</span>
                  <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{pt.id}</span>
                </div>
                <span className="text-xs text-sky-700 font-medium mt-1">{pt.procedure}</span>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {Object.entries(overlay.content).map(([key, value]) => (
            <div key={key} className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500 capitalize">{key.replace(/_/g, " ")}:</span>
              <span className="font-medium text-slate-800 text-right">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    
    if (overlay.type === "surgical_checklist" || overlay.type === "who_checklist" || overlay.type === "checklist") {
      const items = overlay.content.items || {};
      return (
        <div className="space-y-1">
          <p className="font-semibold text-sky-700 mb-2">{overlay.content.phase}</p>
          {Object.entries(items).map(([item, status]) => (
            <div key={item} className="flex items-center gap-2">
              <input type="checkbox" checked={status === true} readOnly className="rounded text-sky-600" />
              <span className={status === true ? 'line-through text-slate-400 capitalize' : 'text-slate-700 capitalize'}>
                {item.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      );
    }

    if (overlay.type === "event_log") {
      const events = overlay.content.events || [];
      return (
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 sidebar-scrollbar">
          {events.map((e: any, i: number) => (
            <div key={i} className="flex gap-3 text-sm border-b border-slate-50 pb-2 last:border-0">
              <div className="text-slate-400 font-mono text-[10px] whitespace-nowrap pt-0.5">{e.time}</div>
              <div>
                <span className="inline-block px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[9px] font-bold tracking-widest rounded mb-1">{e.agent}</span>
                <p className="text-slate-700 font-medium leading-snug">{e.event}</p>
                {e.details && <p className="text-slate-500 text-xs mt-0.5">{e.details}</p>}
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-slate-400 text-xs italic text-center py-4">No events logged yet.</p>
          )}
        </div>
      );
    }

    if (overlay.type === "ebl" || overlay.type === "ebl_summary") {
      const ebl = overlay.content.cumulative_ml as number;
      const pct = overlay.content.pct as number;
      const alert = overlay.content.alert;
      const isHigh = pct >= 25;
      const isCritical = pct >= 40;
      return (
        <div className="text-center p-4">
          <p className="text-slate-500 mb-1 uppercase tracking-widest text-[10px] font-bold">Estimated Blood Loss</p>
          <p className={`text-5xl font-bold mb-2 ${isCritical ? 'text-red-600' : isHigh ? 'text-orange-500' : 'text-slate-800'}`}>{ebl} <span className="text-xl text-slate-400">mL</span></p>
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
            <div className={`h-2.5 rounded-full ${isCritical ? 'bg-red-500' : isHigh ? 'bg-orange-400' : 'bg-sky-500'}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 font-medium">{pct}% of Estimated Blood Volume</p>
          {alert && (
            <div className={`mt-4 p-3 rounded-lg text-xs font-bold border ${isCritical ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
              ⚠️ {alert}
            </div>
          )}
        </div>
      );
    }

    if (overlay.type === "protocol") {
      return (
        <div className="space-y-3">
          <p className="font-semibold text-rose-600 mb-2 border-b border-rose-100 pb-2">Emergency Management: {overlay.content.complication.replace(/_/g, " ").toUpperCase()}</p>
          <ul className="space-y-2">
            {overlay.content.steps.map((step: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm text-slate-700 font-medium bg-rose-50/50 p-2 rounded-lg border border-rose-50">
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    if (overlay.type === "anatomy_context") {
      return (
        <div className="space-y-3">
          <p className="font-semibold text-violet-700 mb-2 border-b border-violet-100 pb-2">Surgical Phase: {overlay.content.phase.replace(/_/g, " ").toUpperCase()}</p>
          
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">At-Risk Structures</p>
            <div className="flex flex-wrap gap-2">
              {overlay.content.at_risk_structures.map((struct: string, i: number) => (
                <span key={i} className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-md text-xs font-semibold">
                  {struct}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Clinical Warnings</p>
            <ul className="space-y-1">
              {overlay.content.warnings.map((warn: string, i: number) => (
                <li key={i} className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5">⚠️</span> {warn}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (overlay.type === "drug_check") {
      const isSafe = overlay.content.verdict === "SAFE";
      const isContra = overlay.content.verdict === "CONTRAINDICATED";
      
      return (
        <div className="space-y-4 p-2">
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isContra ? 'bg-red-50 border-red-200' : isSafe ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm ${isContra ? 'bg-red-100 text-red-600' : isSafe ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {isContra ? '🛑' : isSafe ? '✅' : '⚠️'}
            </div>
            <div>
              <p className="font-bold text-slate-800 capitalize">{overlay.content.drug}</p>
              <p className={`text-xs font-bold tracking-widest uppercase ${isContra ? 'text-red-600' : isSafe ? 'text-emerald-600' : 'text-amber-600'}`}>{overlay.content.verdict}</p>
            </div>
          </div>

          {overlay.content.allergies?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Allergy Alerts</p>
              <ul className="space-y-1.5">
                {overlay.content.allergies.map((alert: string, i: number) => (
                  <li key={i} className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100">{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {overlay.content.interactions?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">Drug Interactions</p>
              <ul className="space-y-1.5">
                {overlay.content.interactions.map((alert: string, i: number) => (
                  <li key={i} className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">{alert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    if (overlay.type === "ct_viewer" || overlay.type === "3d_anatomy" || overlay.type === "ct_slice" || overlay.type === "3d_model") {
      // If it's a 3D model, render our real Three.js viewer
      if (overlay.type === "3d_anatomy" || overlay.type === "3d_model") {
        return <ThreeDViewer 
          rotation={overlay.content?.rotation} 
          zoom={overlay.content?.zoom}
          structures={overlay.content?.structures}
        />;
      }
      
      return (
        <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent"></div>
          <div className="text-center z-10">
            <svg className="w-12 h-12 text-sky-400 mx-auto animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
            <p className="text-sky-300 font-mono text-xs mt-3 tracking-widest uppercase">{overlay.type.replace('_', ' ')} SIMULATION</p>
            <p className="text-slate-400 text-[10px] mt-1">{JSON.stringify(overlay.content).slice(0, 50)}...</p>
          </div>
        </div>
      );
    }

    if (overlay.type === "analyzed_frame") {
      return (
        <div className="w-full">
          <img src={`data:image/jpeg;base64,${overlay.content.image_base64}`} className="w-full rounded-lg shadow-sm border border-slate-200" alt="Analyzed Frame" />
          <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-widest text-center">Screen frame captured and analyzed.</p>
        </div>
      );
    }

    // Default fallback
    return (
      <pre className="text-xs text-slate-600 bg-slate-50/80 border border-slate-100 p-3 rounded-xl whitespace-pre-wrap overflow-auto max-h-48 font-mono">
        {JSON.stringify(overlay.content, null, 2)}
      </pre>
    );
  };

  const positionClasses = inline
    ? "relative w-full mb-3"
    : `absolute min-w-[280px] max-w-md ${
        overlay.position === "top-left" ? "top-6 left-6" :
        overlay.position === "top-right" ? "top-6 right-6" :
        overlay.position === "bottom-left" ? "bottom-6 left-6" :
        overlay.position === "bottom-right" ? "bottom-6 right-6" :
        "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      }`;

  return (
    <div className={`${positionClasses} p-4 bg-white shadow-2xl border border-slate-200/80 rounded-2xl text-sm animate-in fade-in zoom-in-95 duration-200`}>
      <div className="flex items-center justify-between mb-3 gap-4 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></div>
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest">{overlay.title}</h4>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-rose-500 text-lg leading-none transition-colors">&times;</button>
      </div>
      {renderContent()}
    </div>
  );
}
