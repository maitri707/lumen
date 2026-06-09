"""Specialist agents for LUMEN — each handles a specific surgical domain."""
from __future__ import annotations
import json, re, logging
from typing import Any, Optional
from ..services.bedrock import bedrock_service
from ..services.vision import vision_service
from ..tools import TOOL_REGISTRY

logger = logging.getLogger("lumen.specialists")

class BaseAgent:
    name: str = ""
    system_prompt: str = ""

    async def handle(self, text: str, history: list[dict[str, str]] = None, image_base64: Optional[str] = None) -> dict[str, Any]:
        # Append tool instructions to system prompt
        full_prompt = self.system_prompt + "\n\nAvailable tools: " + ", ".join(TOOL_REGISTRY.keys())
        full_prompt += """\n\nRespond ONLY with a valid JSON object in this exact format:
{"action": "brief description", "tool": "tool_name_or_null", "tool_args": {}, "response": "verbal response to user"}"""

        raw = await bedrock_service.invoke(system_prompt=full_prompt, user_message=text, image_base64=image_base64)
        
        try:
            raw = raw.strip()
            if raw.startswith("```"): raw = re.sub(r"```\w*\n?", "", raw).strip()
            parsed = json.loads(raw)
            
            tool_name = parsed.get("tool")
            tool_result = None
            if tool_name and tool_name in TOOL_REGISTRY:
                try:
                    tool_result = TOOL_REGISTRY[tool_name](**parsed.get("tool_args", {}))
                except Exception as e:
                    logger.error(f"Tool error: {e}")
                    tool_result = {"error": str(e)}
                    
            return {
                "agent": self.name,
                "action": parsed.get("action", ""),
                "response": parsed.get("response", ""),
                "tool": tool_name,
                "tool_result": tool_result
            }
        except Exception as e:
            logger.error(f"Agent JSON parse error: {e}")
            return {"agent": self.name, "response": str(raw)}


class BriefingAgent(BaseAgent):
    name = "briefing"
    system_prompt = "You are the Pre-Op Case Briefing agent for LUMEN. Deliver concise pre-operative briefings including patient identity, key labs, allergies, and phase-one checklist highlights. You MUST call the `display_all_patient_data` tool to show the patient record on screen. Be clinical and precise."

class TimeoutAgent(BaseAgent):
    name = "timeout"
    system_prompt = "You are the WHO Safety Timeout agent for LUMEN. Run the WHO Surgical Safety Checklist at incision. You MUST call the `get_who_checklist` tool to display the checklist on screen. Confirm patient identity, procedure, allergies, and critical labs — hands-free and timestamped."

class ReportAgent(BaseAgent):
    name = "report"
    system_prompt = "You are the Operative Report Generator for LUMEN. Compile intraoperative event logs into structured operative reports. When asked to show the report, log, or operative report, you MUST call `show_event_log` to display it on screen. When asked to log an event, you MUST call `log_event` with the event details."

class ComplicationAgent(BaseAgent):
    name = "complication"
    system_prompt = "You are the Complication Protocol Agent for LUMEN. Respond to intraoperative complications — bleeding, nerve injury, air leak, conversion. You MUST call the `get_complication_protocol` tool to surface the management protocol on screen."

class EBLTrackerAgent(BaseAgent):
    name = "ebl_tracker"
    system_prompt = "You are the Blood Loss Tracker for LUMEN. Track cumulative estimated blood loss from voice updates. You MUST call `update_ebl` when blood loss is reported, or `get_ebl_summary` when asked for the total, to display the tracker on screen."

class DrugCheckerAgent(BaseAgent):
    name = "drug_checker"
    system_prompt = "You are the Drug Safety Agent for LUMEN. Perform real-time drug safety checks against the patient's medication list and allergy profile. You MUST call the `check_drug_safety` tool to flag contraindications and display the results on screen."

class AnatomySpotterAgent(BaseAgent):
    name = "anatomy_spotter"
    system_prompt = "You are the Anatomy Identification Agent for LUMEN. Identify at-risk structures for the current surgical phase. When asked about anatomy or danger zones, you MUST call `get_anatomy_context` to display them on screen. When asked to see or show the 3D model, you MUST call `reset_3d_view` or `toggle_structure`. You can also call `rotate_model` to rotate."

class HandoffAgent(BaseAgent):
    name = "handoff"
    system_prompt = "You are the Patient Handoff Agent for LUMEN. Generate structured SBAR handoffs for shift change or scrub-out. You MUST call `display_all_patient_data` to show the patient record on screen AND call `show_event_log` to display the operative log."

class ScreenAdvisorAgent(BaseAgent):
    name = "screen_advisor"
    system_prompt = "You are the Visual Surgical Intelligence agent for LUMEN. You analyze live screenshots of the surgical video feed and answer questions EXCLUSIVELY about the surgical action happening, the instruments in use, and the specific anatomy visible. Do NOT talk about the UI or panels. You can also manipulate CT imaging."

    async def handle(self, text: str, history: list[dict[str, str]] = None, image_base64: Optional[str] = None) -> dict[str, Any]:
        if image_base64 and not "navigate_ct" in text and not "jump_to_landmark" in text:
            result = await vision_service.analyze_frame(image_base64, question=text)
            return {
                "agent": self.name, 
                "response": result["analysis"], 
                "tool": "display_analyzed_frame", 
                "tool_result": {
                    "overlay": {
                        "type": "analyzed_frame",
                        "title": "Vision Analysis",
                        "position": "top-right",
                        "content": {"image_base64": image_base64}
                    }
                }
            }
        return await super().handle(text, history, image_base64)

AGENTS = {
    "briefing": BriefingAgent(), "timeout": TimeoutAgent(), "report": ReportAgent(),
    "complication": ComplicationAgent(), "ebl_tracker": EBLTrackerAgent(), "drug_checker": DrugCheckerAgent(),
    "anatomy_spotter": AnatomySpotterAgent(), "handoff": HandoffAgent(), "screen_advisor": ScreenAdvisorAgent(),
}
