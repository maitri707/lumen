"""Operative log tools for LUMEN."""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from ..models.schemas import EventLogEntry, SurgicalPhase, AgentType

_event_log: list[EventLogEntry] = []

def log_event(event: str, phase: str = "dissection", agent: str = "orchestrator", details: Optional[str] = None) -> dict[str, Any]:
    entry = EventLogEntry(timestamp=datetime.utcnow(), phase=SurgicalPhase(phase) if phase in [e.value for e in SurgicalPhase] else SurgicalPhase.DISSECTION, event=event, agent=AgentType(agent) if agent in [e.value for e in AgentType] else AgentType.ORCHESTRATOR, details=details)
    _event_log.append(entry)
    # Return the full updated log as an overlay so the UI refreshes immediately
    entries = _event_log[-10:]
    return {
        "tool": "log_event",
        "message": f"Event logged: {event}",
        "entry_index": len(_event_log) - 1,
        "overlay": {
            "type": "event_log",
            "title": f"Operative Log — {len(_event_log)} Events",
            "content": {
                "events": [{"time": e.timestamp.strftime("%H:%M:%S"), "phase": e.phase.value, "event": e.event, "agent": e.agent.value, "details": e.details} for e in entries],
                "total_events": len(_event_log),
            },
            "position": "bottom-left",
        },
    }

def show_event_log(last_n: int = 10) -> dict[str, Any]:
    entries = _event_log[-last_n:] if _event_log else []
    return {"tool": "show_event_log", "overlay": {"type": "event_log", "title": f"Operative Log — Last {len(entries)} Events", "content": {"events": [{"time": e.timestamp.strftime("%H:%M:%S"), "phase": e.phase.value, "event": e.event, "agent": e.agent.value, "details": e.details} for e in entries], "total_events": len(_event_log)}, "position": "bottom-left"}}

def hide_event_log() -> dict[str, Any]:
    return {"tool": "hide_event_log", "action": "hide_overlay", "overlay_type": "event_log"}

def capture_surgical_photo(label: str = "CVS confirmation") -> dict[str, Any]:
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    log_event(event=f"Photo captured: {label}", details=f"Filename: LUMEN_capture_{ts}.jpg")
    return {"tool": "capture_surgical_photo", "message": f"Photo captured — {label} ({ts})", "filename": f"LUMEN_capture_{ts}.jpg"}

def get_full_log() -> list[EventLogEntry]:
    return _event_log.copy()

def generate_operative_report() -> dict[str, Any]:
    from .patient_data import get_patient, _build_briefing_content
    pt = get_patient()
    entries = _event_log.copy()
    
    return {
        "tool": "generate_operative_report",
        "overlay": {
            "type": "operative_report",
            "title": "Comprehensive Operative Report",
            "content": {
                "patient": _build_briefing_content(pt),
                "events": [{"time": e.timestamp.strftime("%H:%M:%S"), "phase": e.phase.value, "event": e.event, "agent": e.agent.value, "details": e.details} for e in entries],
                "total_events": len(entries)
            },
            "position": "top-right"
        }
    }
