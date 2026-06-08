"""Operative log tools for LUMEN."""
from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from ..models.schemas import EventLogEntry, SurgicalPhase, AgentType

_event_log: list[EventLogEntry] = []

def log_event(event: str, phase: str = "dissection", agent: str = "orchestrator", details: Optional[str] = None) -> dict[str, Any]:
    entry = EventLogEntry(timestamp=datetime.utcnow(), phase=SurgicalPhase(phase) if phase in [e.value for e in SurgicalPhase] else SurgicalPhase.DISSECTION, event=event, agent=AgentType(agent) if agent in [e.value for e in AgentType] else AgentType.ORCHESTRATOR, details=details)
    _event_log.append(entry)
    return {"tool": "log_event", "message": f"Event logged: {event}", "entry_index": len(_event_log) - 1}

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
