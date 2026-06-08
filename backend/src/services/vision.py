"""Vision analysis service — processes screen-share frames via Bedrock."""

from __future__ import annotations

import logging
from typing import Optional

from .bedrock import bedrock_service

logger = logging.getLogger("lumen.vision")

VISION_SYSTEM_PROMPT = """You are LUMEN's Visual Console Intelligence agent.
You analyze screenshots of a surgical console and provide precise, actionable observations.

When analyzing a screen capture, identify:
1. What panels/views are currently displayed
2. Any vitals or monitoring data visible
3. CT imaging slice information if present
4. Surgical instruments visible in the field
5. Any alerts, warnings, or notifications on screen
6. The current surgical phase based on visual context

Be concise and clinical in your responses. Use medical terminology appropriately.
Format your response as structured observations."""


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
