"""Amazon Bedrock service for LUMEN — Claude-powered AI reasoning."""

from __future__ import annotations

import json
import base64
import logging
from typing import Any, Optional

import boto3

from ..config import settings

logger = logging.getLogger("lumen.bedrock")


class BedrockService:
    """Wrapper around Amazon Bedrock Runtime for Claude inference."""

    def __init__(self):
        self._client = boto3.client(
            "bedrock-runtime",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
        )
        self.model_id = settings.BEDROCK_MODEL_ID

    async def invoke(
        self,
        system_prompt: str,
        user_message: str,
        image_base64: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.3,
    ) -> str:
        """Invoke LLM via Bedrock Converse API with optional image input."""
        user_content: list[dict[str, Any]] = []

        if image_base64:
            image_bytes = base64.b64decode(image_base64)
            user_content.append({
                "image": {
                    "format": "jpeg",
                    "source": {"bytes": image_bytes}
                }
            })

        user_content.append({"text": user_message})

        try:
            response = self._client.converse(
                modelId=self.model_id,
                system=[{"text": system_prompt}],
                messages=[{"role": "user", "content": user_content}],
                inferenceConfig={
                    "maxTokens": max_tokens,
                    "temperature": temperature
                }
            )
            return response["output"]["message"]["content"][0]["text"]
        except Exception as e:
            logger.error(f"Bedrock invocation failed: {e}")
            # Return a graceful fallback for demo purposes
            return f"[LUMEN] I'm currently unable to process that request. Error: {str(e)[:100]}"

    async def invoke_with_vision(
        self,
        system_prompt: str,
        user_message: str,
        image_base64: str,
    ) -> str:
        """Invoke Claude with a screen-share frame for vision analysis."""
        return await self.invoke(
            system_prompt=system_prompt,
            user_message=user_message,
            image_base64=image_base64,
        )


# Singleton
bedrock_service = BedrockService()
