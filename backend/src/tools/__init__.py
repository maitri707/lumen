"""Tools package — all 24 tools for LUMEN agents."""
from .patient_data import display_patient_data, display_all_patient_data, hide_patient_data, get_patient, select_patient, list_patients
from .ct_imaging import navigate_ct, jump_to_landmark, hide_ct
from .anatomy_3d import rotate_model, toggle_structure, hide_3d, reset_3d_view, set_camera_view, zoom_in, zoom_out, pan_model
from .procedure import get_surgical_phase, get_who_checklist, confirm_checklist_item, hide_surgical_checklist
from .op_log import log_event, show_event_log, hide_event_log, capture_surgical_photo, get_full_log
from .decision_support import update_ebl, get_ebl_summary, check_drug_safety, get_complication_protocol, get_anatomy_context
from .screen_share import start_screen_share, stop_screen_share, is_screen_sharing, hide_all_overlays, show_only_ar

TOOL_REGISTRY = {
    "display_patient_data": display_patient_data, "display_all_patient_data": display_all_patient_data,
    "hide_patient_data": hide_patient_data, "select_patient": select_patient, "get_patient": get_patient, "list_patients": list_patients,
    "navigate_ct": navigate_ct, "jump_to_landmark": jump_to_landmark,
    "hide_ct": hide_ct, "rotate_model": rotate_model, "toggle_structure": toggle_structure, "hide_3d": hide_3d,
    "reset_3d_view": reset_3d_view, "set_camera_view": set_camera_view, "zoom_in": zoom_in, "zoom_out": zoom_out, "pan_model": pan_model,
    "get_surgical_phase": get_surgical_phase, "get_who_checklist": get_who_checklist,
    "confirm_checklist_item": confirm_checklist_item, "hide_surgical_checklist": hide_surgical_checklist,
    "log_event": log_event, "show_event_log": show_event_log, "hide_event_log": hide_event_log,
    "capture_surgical_photo": capture_surgical_photo, "update_ebl": update_ebl, "get_ebl_summary": get_ebl_summary,
    "check_drug_safety": check_drug_safety, "get_complication_protocol": get_complication_protocol,
    "get_anatomy_context": get_anatomy_context, "hide_all_overlays": hide_all_overlays, "show_only_ar": show_only_ar,
    "start_screen_share": start_screen_share, "stop_screen_share": stop_screen_share,
}
