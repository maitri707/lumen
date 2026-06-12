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


class VisionService:
    """Analyzes screen-share frames using Bedrock + Claude vision."""

    async def analyze_frame(
        self,
        image_base64: str,
        question: Optional[str] = None,
    ) -> dict:
        """Analyze a single frame from screen share."""
        user_msg = question or "Describe what is visible on this surgical console screen. Identify all panels, data, and instruments visible."

        response = await bedrock_service.invoke_with_vision(
            system_prompt=VISION_SYSTEM_PROMPT,
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
            system_prompt=VISION_SYSTEM_PROMPT,
            user_message=f"Question about what's on screen: {question}",
            image_base64=image_base64,
        )


# Singleton
vision_service = VisionService()
