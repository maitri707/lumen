"""3D Anatomy model tools for LUMEN."""

from __future__ import annotations
from typing import Any

# Simulated 3D anatomy state
_anatomy_state = {
    "visible": False,
    "rotation": {"x": 0, "y": 0, "z": 0},
    "structures": {
        "liver": True,
        "gallbladder": True,
        "cystic_duct": True,
        "cystic_artery": True,
        "common_bile_duct": True,
        "common_hepatic_duct": True,
        "hepatic_artery": True,
        "portal_vein": True,
        "duodenum": False,
        "pancreas": False,
    },
}


def rotate_model(axis: str = "y", degrees: float = 45) -> dict[str, Any]:
    """Rotate the 3D anatomy model.

    Args:
        axis: Rotation axis ('x', 'y', or 'z').
        degrees: Degrees to rotate.
    """
    if axis in _anatomy_state["rotation"]:
        _anatomy_state["rotation"][axis] = (_anatomy_state["rotation"][axis] + degrees) % 360

    _anatomy_state["visible"] = True
    return {
        "tool": "rotate_model",
        "overlay": {
            "type": "3d_model",
            "title": "3D Anatomy",
            "content": {
                "rotation": _anatomy_state["rotation"],
                "structures": {k: v for k, v in _anatomy_state["structures"].items() if v},
            },
            "position": "bottom-right",
        },
    }


def toggle_structure(structure: str, visible: bool | None = None) -> dict[str, Any]:
    """Toggle visibility of a specific anatomical structure.

    Args:
        structure: Name of the structure.
        visible: True to show, False to hide, None to toggle.
    """
    key = structure.lower().replace(" ", "_")
    matched = None
    for s in _anatomy_state["structures"]:
        if key in s or s in key:
            matched = s
            break

    if matched:
        if visible is None:
            _anatomy_state["structures"][matched] = not _anatomy_state["structures"][matched]
        else:
            _anatomy_state["structures"][matched] = visible

        _anatomy_state["visible"] = True
        state = "visible" if _anatomy_state["structures"][matched] else "hidden"
        return {
            "tool": "toggle_structure",
            "message": f"{matched.replace('_', ' ').title()} is now {state}.",
            "overlay": {
                "type": "3d_model",
                "title": "3D Anatomy",
                "content": {
                    "toggled": matched,
                    "state": state,
                    "structures": {k: v for k, v in _anatomy_state["structures"].items() if v},
                },
                "position": "bottom-right",
            },
        }
    return {
        "tool": "toggle_structure",
        "error": f"Structure '{structure}' not found. Available: {list(_anatomy_state['structures'].keys())}",
    }


def hide_3d() -> dict[str, Any]:
    """Remove the 3D anatomy overlay."""
    _anatomy_state["visible"] = False
    return {"tool": "hide_3d", "action": "hide_overlay", "overlay_type": "3d_model"}


def reset_3d_view() -> dict[str, Any]:
    """Reset the 3D model to default rotation and visibility."""
    _anatomy_state["rotation"] = {"x": 0, "y": 0, "z": 0}
    _anatomy_state["visible"] = True
    for key in _anatomy_state["structures"]:
        _anatomy_state["structures"][key] = key in [
            "liver", "gallbladder", "cystic_duct", "cystic_artery",
            "common_bile_duct", "common_hepatic_duct", "hepatic_artery", "portal_vein",
        ]
    return {
        "tool": "reset_3d_view",
        "overlay": {
            "type": "3d_model",
            "title": "3D Anatomy — Reset",
            "content": {
                "rotation": _anatomy_state["rotation"],
                "structures": {k: v for k, v in _anatomy_state["structures"].items() if v},
            },
            "position": "bottom-right",
        },
    }
