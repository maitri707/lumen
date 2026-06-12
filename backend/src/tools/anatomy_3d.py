"""3D Anatomy model tools for LUMEN."""

from __future__ import annotations
from typing import Any

# Simulated 3D anatomy state
_anatomy_state = {
    "visible": False,
    "rotation": {"x": 0, "y": 0, "z": 0},
    "pan": {"x": 0, "y": 0},
    "zoom": 1.0,
    "camera_view": "default", # "top", "bottom", "left", "right", "anterior", "posterior"
    "structures": {
        # GI / Hepatic
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
        # Thoracic
        "right_lung": True,
        "left_lung": True,
        "trachea": True,
        "bronchi": True,
        "heart": True,
    },
}

def set_camera_view(view: str) -> dict[str, Any]:
    """Change the camera view angle for the 3D model.

    Args:
        view: One of 'top', 'bottom', 'left', 'right', 'anterior', 'posterior', 'default'.
    """
    valid_views = ['top', 'bottom', 'left', 'right', 'anterior', 'posterior', 'default']
    v = view.lower()
    if v in valid_views:
        _anatomy_state["camera_view"] = v
        
        # Automatically map views to fixed rotation matrices
        if v == "top":
            _anatomy_state["rotation"] = {"x": 90, "y": 0, "z": 0}
        elif v == "bottom":
            _anatomy_state["rotation"] = {"x": -90, "y": 0, "z": 0}
        elif v == "left":
            _anatomy_state["rotation"] = {"x": 0, "y": 90, "z": 0}
        elif v == "right":
            _anatomy_state["rotation"] = {"x": 0, "y": -90, "z": 0}
        elif v == "posterior":
            _anatomy_state["rotation"] = {"x": 0, "y": 180, "z": 0}
        else: # default / anterior
            _anatomy_state["rotation"] = {"x": 0, "y": 0, "z": 0}

    _anatomy_state["visible"] = True
    return _build_overlay(f"3D Anatomy — {view.title()} View")


def zoom_in(percent: float = 20) -> dict[str, Any]:
    """Zoom into the 3D model by a percentage.

    Args:
        percent: How much to zoom in, e.g. 10 means zoom in by 10%, 20 means 20%. Default is 20.
    """
    factor = 1.0 + (percent / 100.0)
    _anatomy_state["zoom"] = min(_anatomy_state["zoom"] * factor, 5.0)  # max 5x
    _anatomy_state["visible"] = True
    return _build_overlay(f"3D Anatomy — Zoomed In {percent}%")


def zoom_out(percent: float = 20) -> dict[str, Any]:
    """Zoom out of the 3D model by a percentage.

    Args:
        percent: How much to zoom out, e.g. 10 means zoom out by 10%, 20 means 20%. Default is 20.
    """
    factor = 1.0 - (percent / 100.0)
    _anatomy_state["zoom"] = max(_anatomy_state["zoom"] * factor, 0.2)  # min 0.2x
    _anatomy_state["visible"] = True
    return _build_overlay(f"3D Anatomy — Zoomed Out {percent}%")


def pan_model(direction: str, percent: float = 10) -> dict[str, Any]:
    """Pan (move) the 3D model left, right, up, or down.
    
    Args:
        direction: One of 'left', 'right', 'up', 'down'.
        percent: How much to move it. Default is 10.
    """
    d = direction.lower()
    if d == "left":
        _anatomy_state["pan"]["x"] -= percent
    elif d == "right":
        _anatomy_state["pan"]["x"] += percent
    elif d == "up":
        _anatomy_state["pan"]["y"] += percent
    elif d == "down":
        _anatomy_state["pan"]["y"] -= percent
        
    _anatomy_state["visible"] = True
    return _build_overlay(f"3D Anatomy — Panned {direction.title()} {percent}%")


def _build_overlay(title: str) -> dict[str, Any]:
    """Helper to build a consistent 3D model overlay response."""
    return {
        "tool": "3d_model_update",
        "overlay": {
            "type": "3d_model",
            "title": title,
            "content": {
                "rotation": _anatomy_state["rotation"],
                "pan": _anatomy_state["pan"],
                "zoom": _anatomy_state["zoom"],
                "camera_view": _anatomy_state["camera_view"],
                "structures": {k: v for k, v in _anatomy_state["structures"].items() if v},
            },
            "position": "bottom-right",
        },
    }

def rotate_model(axis: str = "y", degrees: float = 45) -> dict[str, Any]:
    """Rotate the 3D anatomy model relative to its current position.

    Args:
        axis: Rotation axis ('x', 'y', or 'z').
        degrees: Degrees to rotate.
    """
    if axis in _anatomy_state["rotation"]:
        _anatomy_state["rotation"][axis] = (_anatomy_state["rotation"][axis] + degrees) % 360

    _anatomy_state["visible"] = True
    return _build_overlay("3D Anatomy")

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
        result = _build_overlay("3D Anatomy")
        result["message"] = f"{matched.replace('_', ' ').title()} is now {state}."
        return result
    return {
        "tool": "toggle_structure",
        "error": f"Structure '{structure}' not found. Available: {list(_anatomy_state['structures'].keys())}",
    }

def hide_3d() -> dict[str, Any]:
    """Remove the 3D anatomy overlay."""
    _anatomy_state["visible"] = False
    return {"tool": "hide_3d", "action": "hide_overlay", "overlay_type": "3d_model"}

def reset_3d_view() -> dict[str, Any]:
    """Reset the 3D model to default rotation, zoom, and visibility."""
    _anatomy_state["rotation"] = {"x": 0, "y": 0, "z": 0}
    _anatomy_state["pan"] = {"x": 0, "y": 0}
    _anatomy_state["zoom"] = 1.0
    _anatomy_state["camera_view"] = "default"
    _anatomy_state["visible"] = True
    for key in _anatomy_state["structures"]:
        _anatomy_state["structures"][key] = key in [
            "liver", "gallbladder", "cystic_duct", "cystic_artery",
            "common_bile_duct", "common_hepatic_duct", "hepatic_artery", "portal_vein",
            "right_lung", "left_lung", "trachea", "bronchi", "heart"
        ]
    return _build_overlay("3D Anatomy — Reset")
