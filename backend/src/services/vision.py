"""Vision analysis service — processes screen-share frames via Bedrock."""

from __future__ import annotations

import logging
from typing import Optional

from .bedrock import bedrock_service

logger = logging.getLogger("lumen.vision")

VISION_SYSTEM_PROMPT = """You are LUMEN's Visual Surgical Intelligence agent.
You analyze screenshots of a live surgical feed and provide precise, actionable observations of the surgical procedure itself.

When analyzing a screen capture, focus EXCLUSIVELY on:
1. The surgical action currently being performed
2. The specific anatomical structures and tissues visible in the field
3. The surgical instruments in use and exactly what they are manipulating
4. Any potential hazards, bleeding, or danger zones near the instruments

If you detect a clinically significant event, anomaly, or complication (e.g., active bleeding, tissue damage, critical structure identification), you should automatically log it in the operative report.
To do this, simply prefix your response with exactly: `[AUTO-LOG: <1 sentence summary of the event>]`
Example: `[AUTO-LOG: Active bleeding encountered near the cystic artery.] I see the grasper...`

Do NOT describe the UI layout, panels, or empty spaces unless specifically asked. Focus purely on the clinical reality of the surgical field.
Be concise and clinical in your responses. Use medical terminology appropriately."""


from ..tools.patient_data import get_patient
from ..tools.op_log import get_full_log

class VisionService:
    """Analyzes screen-share frames using Bedrock + Claude vision."""

    def _build_contextual_prompt(self) -> str:
        pt = get_patient()
        logs = get_full_log()
        
        recent_events = ""
        if logs:
            recent_events = "\n".join([f"- [{e.timestamp.strftime('%H:%M:%S')}] {e.phase.value.upper()}: {e.event}" for e in logs[-5:]])
        else:
            recent_events = "No events logged yet."

        ctx = pt.procedural_context or {}
        phase_name = ctx.get("phase_name", "Unknown")
        steps = "\n".join([f"  * {s}" for s in ctx.get("steps", [])])
        warnings = "\n".join([f"  * {w}" for w in ctx.get("warnings", [])])

        context_block = f"""
---
CURRENT SURGICAL CONTEXT:
Patient: {pt.name} (Age {pt.age}, {pt.sex})
Procedure: {pt.procedure}
Diagnosis: {pt.diagnosis}
Current Phase: {phase_name}
Expected Steps in this Phase:
{steps}
Clinical Warnings:
{warnings}

RECENT OPERATIVE EVENTS (Last 5):
{recent_events}
---
Always interpret the visual feed through the lens of this specific procedure and phase.
"""
        return VISION_SYSTEM_PROMPT + "\n" + context_block

    async def analyze_frame(
        self,
        image_base64: str,
        question: Optional[str] = None,
    ) -> dict:
        """Analyze a single frame from screen share."""
        user_msg = question or "Describe what is visible on this surgical console screen. Identify all panels, data, and instruments visible."

        response = await bedrock_service.invoke_with_vision(
            system_prompt=self._build_contextual_prompt(),
            user_message=user_msg,
            image_base64=image_base64,
        )

        return {
            "analysis": response,
            "type": "vision_analysis",
        }

    async def answer_screen_question(
        self,
        image_base64: str,
        question: str,
    ) -> str:
        """Answer a specific question about what's on screen."""
        return await bedrock_service.invoke_with_vision(
            system_prompt=self._build_contextual_prompt(),
            user_message=f"Question about what's on screen: {question}",
            image_base64=image_base64,
        )


# Singleton
vision_service = VisionService()
