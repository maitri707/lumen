"""Screen share tools for LUMEN."""
from __future__ import annotations
from typing import Any

_screen_share_state = {"active": False, "last_frame": None}

def start_screen_share() -> dict[str, Any]:
    _screen_share_state["active"] = True
    return {"tool": "start_screen_share", "message": "Screen share started. Visual Console Intelligence is now active.", "state": "active"}

def stop_screen_share() -> dict[str, Any]:
    _screen_share_state["active"] = False
    _screen_share_state["last_frame"] = None
    return {"tool": "stop_screen_share", "message": "Screen share stopped.", "state": "inactive"}

def is_screen_sharing() -> bool:
    return _screen_share_state["active"]

def hide_all_overlays() -> dict[str, Any]:
    return {"tool": "hide_all_overlays", "action": "hide_all", "message": "All overlays cleared."}

def show_only_ar() -> dict[str, Any]:
    return {"tool": "show_only_ar", "action": "show_only_ar", "message": "AR-only mode activated."}
