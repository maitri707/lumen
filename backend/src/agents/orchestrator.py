"""LUMEN Orchestrator — Root agent that routes to 9 specialist agents."""
from __future__ import annotations
import json, logging, re
from typing import Any, Optional
from ..services.bedrock import bedrock_service
from ..tools import TOOL_REGISTRY

logger = logging.getLogger("lumen.orchestrator")

ORCHESTRATOR_SYSTEM = """You are LUMEN, a voice-directed surgical intelligence system for the operating room.
You are the root orchestrator. You listen to the surgeon's voice commands and route them to the correct specialist agent.

You have 9 specialist agents:
1. briefing — Pre-op case briefing (patient data, labs, allergies)
2. timeout — WHO Surgical Safety Checklist
3. report — Operative report generation
4. complication — Complication protocol response
5. ebl_tracker — Blood loss tracking
6. drug_checker — Drug safety checks
7. anatomy_spotter — Anatomy identification and danger zones
8. handoff — Patient handoff SBAR
9. screen_advisor — Visual console intelligence (screen share analysis)

Based on the surgeon's command, respond with a JSON object:
{"agent": "<agent_name>", "action": "<brief_action>", "tool": "<tool_name_if_applicable>", "tool_args": {}, "response": "<brief_spoken_response>"}

Available tools: display_patient_data, display_all_patient_data, hide_patient_data, navigate_ct, jump_to_landmark, hide_ct, rotate_model, toggle_structure, hide_3d, reset_3d_view, get_surgical_phase, get_who_checklist, confirm_checklist_item, hide_surgical_checklist, log_event, show_event_log, hide_event_log, capture_surgical_photo, update_ebl, get_ebl_summary, check_drug_safety, get_complication_protocol, get_anatomy_context, hide_all_overlays, show_only_ar, start_screen_share, stop_screen_share

IMPORTANT: Always respond with valid JSON only. No markdown, no code fences. Just the JSON object."""

class Orchestrator:
    def __init__(self):
        self.conversation_history: list[dict[str, str]] = []

    async def process_command(self, text: str, screen_frame_b64: Optional[str] = None) -> dict[str, Any]:
        self.conversation_history.append({"role": "user", "content": text})
        try:
            raw = await bedrock_service.invoke(system_prompt=ORCHESTRATOR_SYSTEM, user_message=text, image_base64=screen_frame_b64)
            # Try to extract JSON from response
            raw = raw.strip()
            if raw.startswith("```"): raw = re.sub(r"```\w*\n?", "", raw).strip()
            parsed = json.loads(raw)
        except (json.JSONDecodeError, Exception) as e:
            logger.warning(f"Failed to parse orchestrator response: {e}. Raw: {raw[:200] if 'raw' in dir() else 'N/A'}")
            parsed = {"agent": "orchestrator", "action": "general_response", "response": raw if isinstance(raw, str) else str(e), "tool": None, "tool_args": {}}

        tool_result = None
        tool_name = parsed.get("tool")
        if tool_name and tool_name in TOOL_REGISTRY:
            tool_fn = TOOL_REGISTRY[tool_name]
            tool_args = parsed.get("tool_args", {})
            try: tool_result = tool_fn(**tool_args)
            except Exception as e:
                logger.error(f"Tool {tool_name} failed: {e}")
                tool_result = {"error": str(e)}

        response_text = parsed.get("response", "Command processed.")
        self.conversation_history.append({"role": "assistant", "content": response_text})

        return {"agent": parsed.get("agent", "orchestrator"), "action": parsed.get("action", ""), "response": response_text, "tool": tool_name, "tool_result": tool_result}

orchestrator = Orchestrator()
