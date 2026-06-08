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
        """Invoke Claude via Bedrock with optional image input."""
        messages: list[dict[str, Any]] = []

        # Build user content
        content: list[dict[str, Any]] = []

        if image_base64:
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_base64,
                },
            })

        content.append({"type": "text", "text": user_message})
        messages.append({"role": "user", "content": content})

        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "temperature": temperature,
            "system": system_prompt,
            "messages": messages,
        })

        try:
            response = self._client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=body,
            )
            result = json.loads(response["body"].read())
            return result["content"][0]["text"]
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
