"""Surgical procedure tools for LUMEN."""

from __future__ import annotations
from typing import Any
from ..models.schemas import SurgicalPhase

# Simulated procedure state
_procedure_state = {
    "current_phase": SurgicalPhase.DISSECTION,
    "checklist_visible": False,
    "who_checklist": {
        "sign_in": {
            "patient_identity_confirmed": True,
            "site_marked": True,
            "anesthesia_check_complete": True,
            "pulse_oximeter_functioning": True,
            "known_allergy": True,
            "airway_risk": True,
            "blood_loss_risk": True,
        },
        "time_out": {
            "team_members_introduced": False,
            "patient_name_procedure_confirmed": False,
            "antibiotics_given": False,
            "critical_events_anticipated": False,
            "imaging_displayed": False,
        },
        "sign_out": {
            "procedure_recorded": False,
            "instrument_count_correct": False,
            "specimen_labeled": False,
            "equipment_issues": False,
            "recovery_plan_reviewed": False,
        },
    },
}


def get_surgical_phase() -> dict[str, Any]:
    """Get the current surgical phase."""
    return {
        "tool": "get_surgical_phase",
        "phase": _procedure_state["current_phase"].value,
        "phase_display": _procedure_state["current_phase"].value.replace("_", " ").title(),
    }


def get_who_checklist(phase: str = "time_out") -> dict[str, Any]:
    """Display the WHO Surgical Safety Checklist for a given phase.

    Args:
        phase: Checklist phase — 'sign_in', 'time_out', or 'sign_out'.
    """
    checklist = _procedure_state["who_checklist"].get(phase, {})
    _procedure_state["checklist_visible"] = True
    return {
        "tool": "get_who_checklist",
        "overlay": {
            "type": "checklist",
            "title": f"WHO Checklist — {phase.replace('_', ' ').title()}",
            "content": {
                "phase": phase,
                "items": checklist,
                "completed": sum(1 for v in checklist.values() if v),
                "total": len(checklist),
            },
            "position": "top-left",
        },
    }


def confirm_checklist_item(phase: str, item: str) -> dict[str, Any]:
    """Mark a WHO checklist item as confirmed.

    Args:
        phase: Checklist phase.
        item: Item key to confirm.
    """
    checklist = _procedure_state["who_checklist"].get(phase, {})
    key = item.lower().replace(" ", "_")
    matched = None
    for k in checklist:
        if key in k or k in key:
            matched = k
            break

    if matched:
        _procedure_state["who_checklist"][phase][matched] = True
        return {
            "tool": "confirm_checklist_item",
            "message": f"✓ {matched.replace('_', ' ').title()} confirmed.",
            "overlay": {
                "type": "checklist",
                "title": f"WHO Checklist — {phase.replace('_', ' ').title()}",
                "content": {
                    "phase": phase,
                    "items": _procedure_state["who_checklist"][phase],
                    "completed": sum(1 for v in _procedure_state["who_checklist"][phase].values() if v),
                    "total": len(_procedure_state["who_checklist"][phase]),
                },
                "position": "top-left",
            },
        }
    return {"tool": "confirm_checklist_item", "error": f"Item '{item}' not found in {phase}."}


def hide_surgical_checklist() -> dict[str, Any]:
    """Remove the checklist overlay."""
    _procedure_state["checklist_visible"] = False
    return {"tool": "hide_surgical_checklist", "action": "hide_overlay", "overlay_type": "checklist"}
