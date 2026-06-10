"""Decision support tools for LUMEN — EBL, drug safety, complication protocols, anatomy."""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from ..models.schemas import EBLRecord, DrugCheckResult, PatientData

_patient = PatientData()
_ebl_records: list[EBLRecord] = []
_cumulative_ebl: float = 0.0

def update_ebl(amount_ml: float, source: str = "surgeon_estimate") -> dict[str, Any]:
    global _cumulative_ebl
    _cumulative_ebl += amount_ml
    pct = (_cumulative_ebl / _patient.estimated_blood_volume_ml) * 100
    rec = EBLRecord(amount_ml=amount_ml, source=source, cumulative_ml=_cumulative_ebl, percentage_ebv=pct)
    _ebl_records.append(rec)
    alert = None
    if pct >= 40: alert = "CRITICAL — 40% EBV lost. Massive transfusion protocol recommended."
    elif pct >= 25: alert = "WARNING — 25% EBV lost. Consider transfusion."
    elif pct >= 15: alert = "CAUTION — 15% EBV lost. Monitor closely."
    
    # Also log this to the central Operative Log
    from .op_log import log_event
    log_event(event=f"Blood loss updated: +{amount_ml} mL", agent="ebl_tracker", details=f"Cumulative EBL is now {_cumulative_ebl} mL ({round(pct, 1)}% of EBV).")

    result = {"tool": "update_ebl", "cumulative_ml": _cumulative_ebl, "percentage_ebv": round(pct, 1), "ebv_ml": _patient.estimated_blood_volume_ml}
    if alert: result["alert"] = alert
    result["overlay"] = {"type": "ebl", "title": "Blood Loss Tracker", "content": {"cumulative_ml": _cumulative_ebl, "pct": round(pct, 1), "alert": alert}, "position": "bottom-left"}
    return result

def get_ebl_summary() -> dict[str, Any]:
    pct = (_cumulative_ebl / _patient.estimated_blood_volume_ml) * 100
    return {"tool": "get_ebl_summary", "cumulative_ml": _cumulative_ebl, "percentage_ebv": round(pct, 1), "ebv_ml": _patient.estimated_blood_volume_ml, "entries": len(_ebl_records), "overlay": {"type": "ebl", "title": "EBL Summary", "content": {"cumulative_ml": _cumulative_ebl, "pct": round(pct, 1)}, "position": "bottom-left"}}

def check_drug_safety(drug_name: str, dose: Optional[str] = None) -> dict[str, Any]:
    drug_lower = drug_name.lower()
    allergies_flagged = [a for a in _patient.allergies if a.lower() in drug_lower or drug_lower in a.lower()]
    interactions = []
    known_interactions = {"warfarin": ["aspirin"], "metoprolol": ["verapamil", "diltiazem"], "lisinopril": ["potassium", "spironolactone"]}
    for med in _patient.medications:
        med_lower = med.lower()
        for drug_key, interacts in known_interactions.items():
            if drug_key in drug_lower and any(i in med_lower for i in interacts): interactions.append(f"Interaction with {med}")
            if drug_key in med_lower and drug_lower in interacts: interactions.append(f"Interaction with {med}")
    if "penicillin" in drug_lower or "amoxicillin" in drug_lower:
        if "Penicillin" in _patient.allergies: allergies_flagged.append("Penicillin allergy — CONTRAINDICATED")
    verdict = "SAFE"
    if allergies_flagged: verdict = "CONTRAINDICATED"
    elif interactions: verdict = "CAUTION"
    return {"tool": "check_drug_safety", "drug": drug_name, "dose": dose, "verdict": verdict, "allergies_flagged": allergies_flagged, "interactions": interactions, "overlay": {"type": "drug_check", "title": f"Drug Safety — {drug_name}", "content": {"verdict": verdict, "drug": drug_name, "allergies": allergies_flagged, "interactions": interactions}, "position": "top-right"}}

def get_complication_protocol(complication: str) -> dict[str, Any]:
    protocols = {
        "bleeding": {"title": "Intraoperative Bleeding Protocol", "steps": ["1. Apply direct pressure", "2. Identify source", "3. Achieve hemostasis — clip, cautery, or suture", "4. Update EBL", "5. Consider conversion if uncontrolled"]},
        "bile_duct_injury": {"title": "Bile Duct Injury Protocol", "steps": ["1. STOP — Do not divide any structures", "2. Obtain cholangiogram", "3. Call hepatobiliary surgery consult", "4. Document intraoperatively", "5. Convert to open if necessary"]},
        "conversion": {"title": "Conversion to Open Protocol", "steps": ["1. Notify anesthesia", "2. Request open tray", "3. Extend incision as needed", "4. Document reason for conversion", "5. Continue procedure under direct vision"]},
        "pneumothorax": {"title": "Pneumothorax Protocol", "steps": ["1. Desufflate abdomen", "2. Notify anesthesia immediately", "3. Chest X-ray or ultrasound", "4. Chest tube if tension", "5. Consider aborting procedure"]},
    }
    key = complication.lower().replace(" ", "_")
    matched = None
    for k in protocols:
        if key in k or k in key: matched = k; break
    if matched:
        p = protocols[matched]
        return {"tool": "get_complication_protocol", "overlay": {"type": "protocol", "title": p["title"], "content": {"complication": matched, "steps": p["steps"]}, "position": "center"}}
    return {"tool": "get_complication_protocol", "message": f"No specific protocol for '{complication}'. General management: stabilize, identify, consult."}

def get_anatomy_context(structure: Optional[str] = None, phase: Optional[str] = None) -> dict[str, Any]:
    danger_zones = {
        "dissection": {"structures": ["Cystic artery", "Right hepatic artery", "Common bile duct"], "warnings": ["Triangle of Calot must be fully exposed", "Identify cystic artery before clipping"]},
        "critical_view": {"structures": ["Cystic duct", "Cystic artery", "Gallbladder base"], "warnings": ["Two structures only must enter the gallbladder", "Hepatocystic triangle cleared of fat and fibrous tissue"]},
        "clipping": {"structures": ["Cystic duct", "Cystic artery"], "warnings": ["Confirm critical view before clipping", "Two clips proximal, one distal on each structure"]},
    }
    p = phase or "dissection"
    info = danger_zones.get(p, danger_zones["dissection"])
    return {"tool": "get_anatomy_context", "overlay": {"type": "anatomy_context", "title": f"Anatomy — {p.replace('_', ' ').title()}", "content": {"phase": p, "at_risk_structures": info["structures"], "warnings": info["warnings"], "requested_structure": structure}, "position": "bottom-right"}}
