"""Patient data tools for LUMEN."""

from __future__ import annotations
from typing import Any, Optional
from ..models.schemas import PatientData, OverlayData

# Simulated patient database (EHR mock)
MOCK_EHR = {
    "PT-2024-0847": PatientData(
        id="PT-2024-0847",
        name="John Mitchell",
        age=62, sex="Male", weight_kg=84.5, height_cm=175.0, blood_type="A+",
        allergies=["Penicillin", "Latex"],
        medications=["Metoprolol 50mg BID", "Lisinopril 10mg daily", "Aspirin 81mg daily (held)"],
        diagnosis="Non-Small Cell Lung Cancer (NSCLC) - Right Upper Lobe",
        procedure="VATS Right Upper Lobectomy",
        estimated_blood_volume_ml=5915.0
    ),
    "PT-2024-0912": PatientData(
        id="PT-2024-0912",
        name="Sarah Jenkins",
        age=28, sex="Female", weight_kg=65.0, height_cm=165.0, blood_type="O+",
        allergies=["None"],
        medications=["Albuterol inhaler PRN"],
        diagnosis="Pulmonary Nodule - Left Lower Lobe",
        procedure="VATS Left Lower Lobe Wedge Resection",
        estimated_blood_volume_ml=4225.0
    ),
    "PT-2024-0955": PatientData(
        id="PT-2024-0955",
        name="Robert Chen",
        age=45, sex="Male", weight_kg=78.2, height_cm=180.0, blood_type="B-",
        allergies=["Sulfa drugs"],
        medications=["Atorvastatin 20mg daily"],
        diagnosis="Spontaneous Pneumothorax with Apical Blebs",
        procedure="Thoracoscopic Bullectomy and Pleurodesis",
        estimated_blood_volume_ml=5474.0
    )
}

# Current active patient context
_active_patient_id = "PT-2024-0847"

def get_patient() -> PatientData:
    """Return the current active patient data object."""
    return MOCK_EHR[_active_patient_id]

def select_patient(query: str) -> dict[str, Any]:
    """Search for and select a patient from the database by name or ID.
    
    Args:
        query: Patient name or ID to load.
    """
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
                        "alerts": f"{len(pt.allergies)} known allergies" if pt.allergies != ["None"] else "No known allergies"
                    },
                    position="top-left",
                ).model_dump(),
            }
            
    return {
        "tool": "select_patient",
        "error": f"Could not find patient matching '{query}'. Available patients: John Mitchell, Sarah Jenkins, Robert Chen."
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


def display_patient_data(field: Optional[str] = None) -> dict[str, Any]:
    """Display a specific patient data field or summary on the surgical overlay.

    Args:
        field: Specific field to display (e.g., 'labs', 'allergies', 'medications').
               If None, shows key summary.
    """
    pt = get_patient()
    if field:
        data = pt.model_dump()
        value = data.get(field, f"Unknown field: {field}")
        return {
            "tool": "display_patient_data",
            "overlay": OverlayData(
                type="patient_data",
                title=f"Patient — {field.replace('_', ' ').title()}",
                content={"field": field, "value": value},
                position="top-left",
            ).model_dump(),
        }
    return {
        "tool": "display_patient_data",
        "overlay": OverlayData(
            type="patient_data",
            title="Patient Summary",
            content={
                "name": pt.name,
                "id": pt.id,
                "age": pt.age,
                "diagnosis": pt.diagnosis,
                "procedure": pt.procedure,
                "blood_type": pt.blood_type,
            },
            position="top-left",
        ).model_dump(),
    }


def display_all_patient_data() -> dict[str, Any]:
    """Display the complete patient record on the surgical overlay."""
    pt = get_patient()
    return {
        "tool": "display_all_patient_data",
        "overlay": OverlayData(
            type="patient_data",
            title="Full Patient Record",
            content=pt.model_dump(),
            position="top-left",
        ).model_dump(),
    }


def hide_patient_data() -> dict[str, Any]:
    """Remove the patient data overlay from the surgical display."""
    return {
        "tool": "hide_patient_data",
        "action": "hide_overlay",
        "overlay_type": "patient_data",
    }
