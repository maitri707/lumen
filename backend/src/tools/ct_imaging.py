"""CT Imaging navigation tools for LUMEN."""

from __future__ import annotations
from typing import Any

# Simulated CT state
_ct_state = {
    "current_slice": 66,
    "total_slices": 133,
    "window": "abdomen",
    "visible": False,
    "landmarks": {
        "liver_dome": 15,
        "gallbladder_fundus": 45,
        "gallbladder_neck": 58,
        "cystic_duct": 62,
        "common_bile_duct": 68,
        "portal_vein": 70,
        "hepatic_artery": 72,
        "duodenum": 85,
        "right_kidney": 95,
        "pancreas": 100,
    },
}


def navigate_ct(direction: str = "next", steps: int = 1) -> dict[str, Any]:
    """Navigate through CT slices.

    Args:
        direction: 'next', 'prev', or a specific slice number as string.
        steps: Number of slices to advance/retreat.
    """
    if direction.isdigit():
        _ct_state["current_slice"] = max(1, min(int(direction), _ct_state["total_slices"]))
    elif direction == "next":
        _ct_state["current_slice"] = min(_ct_state["current_slice"] + steps, _ct_state["total_slices"])
    elif direction == "prev":
        _ct_state["current_slice"] = max(_ct_state["current_slice"] - steps, 1)

    _ct_state["visible"] = True
    return {
        "tool": "navigate_ct",
        "overlay": {
            "type": "ct_image",
            "title": f"CT Slice {_ct_state['current_slice']}/{_ct_state['total_slices']}",
            "content": {
                "slice": _ct_state["current_slice"],
                "total": _ct_state["total_slices"],
                "window": _ct_state["window"],
            },
            "position": "top-right",
        },
    }


def jump_to_landmark(landmark: str) -> dict[str, Any]:
    """Jump to a predefined anatomical landmark on CT.

    Args:
        landmark: Name of the landmark (e.g., 'gallbladder_neck', 'cystic_duct').
    """
    # Fuzzy match
    key = landmark.lower().replace(" ", "_")
    matched = None
    for lm in _ct_state["landmarks"]:
        if key in lm or lm in key:
            matched = lm
            break

    if matched:
        _ct_state["current_slice"] = _ct_state["landmarks"][matched]
        _ct_state["visible"] = True
        return {
            "tool": "jump_to_landmark",
            "overlay": {
                "type": "ct_image",
                "title": f"CT — {matched.replace('_', ' ').title()}",
                "content": {
                    "landmark": matched,
                    "slice": _ct_state["current_slice"],
                    "total": _ct_state["total_slices"],
                },
                "position": "top-right",
            },
        }
    return {
        "tool": "jump_to_landmark",
        "error": f"Landmark '{landmark}' not found. Available: {list(_ct_state['landmarks'].keys())}",
    }


def hide_ct() -> dict[str, Any]:
    """Remove the CT overlay from the surgical display."""
    _ct_state["visible"] = False
    return {"tool": "hide_ct", "action": "hide_overlay", "overlay_type": "ct_image"}
