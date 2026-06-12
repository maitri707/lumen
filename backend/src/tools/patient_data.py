"""Patient data tools for LUMEN."""

from __future__ import annotations
from typing import Any, Optional
from ..models.schemas import PatientData, OverlayData

# Simulated patient database (EHR mock)
MOCK_EHR = {
    "PT-2024-0847": PatientData(
        id="PT-2024-0847",
        name="James Wilson",
        age=58, sex="Male", weight_kg=72.0, height_cm=175.0, blood_type="O+",
        allergies=["Penicillin", "Codeine"],
        allergy_details=[
            {"drug": "Penicillin", "reaction": "rash"},
            {"drug": "Codeine", "reaction": "nausea"},
        ],
        medications=["Metoprolol 25mg QD", "Lisinopril 10mg QD", "Aspirin 81mg QD (held)"],
        medication_notes=["Aspirin held 7 days pre-op"],
        diagnosis="Stage II NSCLC — left upper lobe",
        staging="cT2N1M0",
        procedure="VATS left upper lobectomy",
        surgical_system="da Vinci Si",
        labs={
            "hemoglobin": {"value": 11.2, "unit": "g/dL", "normal": "13.5-17.5", "status": "low", "note": "Low — pre-op anemia noted"},
            "creatinine": {"value": 0.9, "unit": "mg/dL", "normal": "0.7-1.3", "status": "normal", "note": "Normal renal function"},
            "platelets": {"value": 210, "unit": "K/μL", "normal": "150-400", "status": "normal", "note": "Adequate for surgery"},
            "inr": {"value": 1.1, "unit": "", "normal": "0.8-1.2", "status": "normal", "note": "Normal coagulation"},
        },
        vitals={
            "blood_pressure": {"value": "118/74", "unit": "mmHg", "note": "Last recorded 0630"},
        },
        procedural_context={
            "phase_name": "Vascular Dissection",
            "warnings": ["⚠ CRITICAL: Left phrenic nerve runs anterior to hilum"],
            "steps": [
                "Identify lingular PA branch before upper division PA",
                "Confirm 2 clips + 1 stapler load per vessel minimum",
                "Superior PV — confirm no common trunk with lower",
            ],
        },
        estimated_blood_volume_ml=5040.0
    )
}

# Current active patient context
_active_patient_id = "PT-2024-0847"

def get_patient() -> PatientData:
    """Return the current active patient data object."""
    return MOCK_EHR[_active_patient_id]

def select_patient(query: str) -> dict[str, Any]:
    """Search for and select a patient from the database."""
    global _active_patient_id
    query_lower = query.lower()
    
    for pid, pt in MOCK_EHR.items():
        if query_lower in pid.lower() or query_lower in pt.name.lower():
            _active_patient_id = pid
            return {
                "tool": "select_patient",
                "message": f"Patient profile loaded for {pt.name}.",
                "overlay": OverlayData(
                    type="patient_data",
                    title="Active Patient Loaded",
                    content={
                        "name": pt.name,
                        "id": pt.id,
                        "diagnosis": pt.diagnosis,
                        "procedure": pt.procedure,
                    },
                    position="top-left",
                ).model_dump(),
            }
            
    return {
        "tool": "select_patient",
        "error": f"Could not find patient matching '{query}'."
    }

def list_patients() -> dict[str, Any]:
    """Display a list of all patients available in the EHR database."""
    patients_list = []
    for pid, pt in MOCK_EHR.items():
        patients_list.append({
            "id": pid,
            "name": pt.name,
            "procedure": pt.procedure
        })
        
    return {
        "tool": "list_patients",
        "message": f"There are {len(patients_list)} patients scheduled today.",
        "overlay": OverlayData(
            type="patient_data",
            title="Today's Patient Schedule",
            content={"patients": patients_list},
            position="top-left",
        ).model_dump(),
    }


def _build_briefing_content(pt: PatientData) -> dict[str, Any]:
    """Build the structured briefing content payload from patient data."""
    return {
        "name": pt.name,
        "id": pt.id,
        "age": pt.age,
        "sex": pt.sex,
        "weight_kg": pt.weight_kg,
        "blood_type": pt.blood_type,
        "diagnosis": pt.diagnosis,
        "staging": pt.staging,
        "procedure": pt.procedure,
        "surgical_system": pt.surgical_system,
        "labs": pt.labs,
        "vitals": pt.vitals,
        "allergies": pt.allergies,
        "allergy_details": pt.allergy_details,
        "medications": pt.medications,
        "medication_notes": pt.medication_notes,
        "procedural_context": pt.procedural_context,
    }


def display_patient_data(field: Optional[str] = None) -> dict[str, Any]:
    """Display a specific patient data field or summary on the surgical overlay."""
    pt = get_patient()
    if field:
        full_content = _build_briefing_content(pt)
        # Keep identity fields and the specific requested field
        filtered_content = {
            "name": full_content["name"],
            "id": full_content["id"],
            "blood_type": full_content["blood_type"],
            field: full_content.get(field)
        }
        return {
            "tool": "display_patient_data",
            "overlay": OverlayData(
                type="patient_data",
                title=f"Patient — {field.replace('_', ' ').title()}",
                content=filtered_content,
                position="top-left",
            ).model_dump(),
        }
    return {
        "tool": "display_patient_data",
        "overlay": OverlayData(
            type="briefing_patient_data",
            title="Patient Summary",
            content=_build_briefing_content(pt),
            position="top-left",
        ).model_dump(),
    }


def display_all_patient_data() -> dict[str, Any]:
    """Display the complete patient record on the surgical overlay."""
    pt = get_patient()
    return {
        "tool": "display_all_patient_data",
        "overlay": OverlayData(
            type="briefing_patient_data",
            title="Full Patient Record",
            content=_build_briefing_content(pt),
            position="top-left",
        ).model_dump(),
    }


def hide_patient_data() -> dict[str, Any]:
    """Remove the patient data overlay from the surgical display."""
    return {
        "tool": "hide_patient_data",
        "action": "hide_overlay",
        "overlay_type": "briefing_patient_data",
    }
