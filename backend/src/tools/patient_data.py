"""Patient data tools for LUMEN."""

from __future__ import annotations
from typing import Any, Optional
from ..models.schemas import PatientData, OverlayData

# Simulated patient data store
_patient = PatientData()


def display_patient_data(field: Optional[str] = None) -> dict[str, Any]:
    """Display a specific patient data field or summary on the surgical overlay.

    Args:
        field: Specific field to display (e.g., 'labs', 'allergies', 'medications').
               If None, shows key summary.
    """
    if field:
        data = _patient.model_dump()
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
                "name": _patient.name,
                "id": _patient.id,
                "age": _patient.age,
                "diagnosis": _patient.diagnosis,
                "procedure": _patient.procedure,
                "blood_type": _patient.blood_type,
            },
            position="top-left",
        ).model_dump(),
    }


def display_all_patient_data() -> dict[str, Any]:
    """Display the complete patient record on the surgical overlay."""
    return {
        "tool": "display_all_patient_data",
        "overlay": OverlayData(
            type="patient_data",
            title="Full Patient Record",
            content=_patient.model_dump(),
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


def get_patient() -> PatientData:
    """Return the current patient data object."""
    return _patient
