"""Specialist agents for LUMEN — each handles a specific surgical domain."""
from __future__ import annotations
from ..services.bedrock import bedrock_service
from ..services.vision import vision_service
from typing import Any, Optional

class BaseAgent:
    name: str = ""
    system_prompt: str = ""

    async def handle(self, text: str, **kwargs) -> dict[str, Any]:
        resp = await bedrock_service.invoke(system_prompt=self.system_prompt, user_message=text)
        return {"agent": self.name, "response": resp}


class BriefingAgent(BaseAgent):
    name = "briefing"
    system_prompt = "You are the Pre-Op Case Briefing agent for LUMEN. Deliver concise pre-operative briefings including patient identity, key labs, allergies, and phase-one checklist highlights. Be clinical and precise."


class TimeoutAgent(BaseAgent):
    name = "timeout"
    system_prompt = "You are the WHO Safety Timeout agent for LUMEN. Run the WHO Surgical Safety Checklist at incision. Confirm patient identity, procedure, allergies, and critical labs — hands-free and timestamped."


class ReportAgent(BaseAgent):
    name = "report"
    system_prompt = "You are the Operative Report Generator for LUMEN. Compile intraoperative event logs into structured operative reports. Use SBAR-style format. Be thorough and professionally formatted."


class ComplicationAgent(BaseAgent):
    name = "complication"
    system_prompt = "You are the Complication Protocol Agent for LUMEN. Respond to intraoperative complications — bleeding, nerve injury, air leak, conversion. Surface the phase-aware management protocol instantly."


class EBLTrackerAgent(BaseAgent):
    name = "ebl_tracker"
    system_prompt = "You are the Blood Loss Tracker for LUMEN. Track cumulative estimated blood loss from voice updates. Maintain a running total and alert when thresholds approach transfusion criteria."


class DrugCheckerAgent(BaseAgent):
    name = "drug_checker"
    system_prompt = "You are the Drug Safety Agent for LUMEN. Perform real-time drug safety checks against the patient's medication list and allergy profile. Flag contraindications and interactions before administration."


class AnatomySpotterAgent(BaseAgent):
    name = "anatomy_spotter"
    system_prompt = "You are the Anatomy Identification Agent for LUMEN. Identify at-risk structures for the current surgical phase. Use 3D model context to surface danger zones and critical spatial relationships."


class HandoffAgent(BaseAgent):
    name = "handoff"
    system_prompt = "You are the Patient Handoff Agent for LUMEN. Generate structured SBAR handoffs for shift change or scrub-out. Pull the event log, phase status, and patient data automatically."


class ScreenAdvisorAgent(BaseAgent):
    name = "screen_advisor"
    system_prompt = "You are the Visual Console Intelligence agent for LUMEN. You analyze live screenshots of the surgical console and answer questions about what is visible — panels open, vitals shown, CT slice displayed, instruments in view."

    async def handle(self, text: str, image_base64: Optional[str] = None, **kwargs) -> dict[str, Any]:
        if image_base64:
            result = await vision_service.analyze_frame(image_base64, question=text)
            return {"agent": self.name, "response": result["analysis"]}
        resp = await bedrock_service.invoke(system_prompt=self.system_prompt, user_message=text)
        return {"agent": self.name, "response": resp}


AGENTS = {
    "briefing": BriefingAgent(), "timeout": TimeoutAgent(), "report": ReportAgent(),
    "complication": ComplicationAgent(), "ebl_tracker": EBLTrackerAgent(), "drug_checker": DrugCheckerAgent(),
    "anatomy_spotter": AnatomySpotterAgent(), "handoff": HandoffAgent(), "screen_advisor": ScreenAdvisorAgent(),
}
