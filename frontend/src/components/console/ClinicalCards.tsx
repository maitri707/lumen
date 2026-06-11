import { ThreeDViewer } from "./ThreeDViewer";

export function ClinicalCard({ overlay, onClose, inline = false }: { overlay: any; onClose: () => void; inline?: boolean }) {
  const renderContent = () => {
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
