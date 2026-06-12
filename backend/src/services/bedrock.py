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
        self.is_mock = (
            not settings.AWS_ACCESS_KEY_ID or 
            "your_access_key" in settings.AWS_ACCESS_KEY_ID or 
            "placeholder" in settings.AWS_ACCESS_KEY_ID
        )
        if not self.is_mock:
            try:
                self._client = boto3.client(
                    "bedrock-runtime",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
                )
            except Exception as e:
                logger.warning(f"Failed to create Bedrock client, falling back to mock mode: {e}")
                self.is_mock = True
        else:
            logger.info("Bedrock is running in MOCK mode (placeholder or missing credentials).")
        self.model_id = settings.BEDROCK_MODEL_ID

    def _mock_invoke(self, system_prompt: str, user_message: str, image_base64: Optional[str] = None) -> str:
        msg_lower = user_message.lower()
        
        # 1. General conversational prompt (orchestrator fallback)
        if "voice-directed surgical intelligence assistant" in system_prompt:
            return json.dumps({
                "response": (
                    "I'm LUMEN, your voice-directed surgical assistant. Here's what I can do: "
                    "Say 'Give me the briefing' for patient data, 'Run the WHO checklist' for safety timeout, "
                    "'Is it safe to give Penicillin?' for drug checks, 'We lost 200 mL of blood' for EBL tracking, "
                    "'Show me the 3D model' for anatomy, 'What are the danger zones?' for critical structures, "
                    "'We have a bleeding complication' for emergency protocols, 'Show me the op report' for the operative log, "
                    "'Prepare a handoff' for SBAR summaries, or 'What's happening on screen?' when screen sharing is active."
                )
            })
            
        # 2. Specialist Agent prompts
        if "briefing" in system_prompt:
            return json.dumps({
                "action": "Display patient data",
                "tool": "display_all_patient_data",
                "tool_args": {},
                "response": "Displaying patient vitals and data. Hemoglobin is 11.2, which is low, pre-op anemia noted. Creatinine is 0.9, showing normal renal function. Platelets are 210, adequate for surgery. INR is 1.1, normal coagulation. Blood Pressure is 118 over 74, last recorded at 0630. Patient is a 58-year-old male, weighing 72 kg. Diagnosis is Stage 2 Non-Small Cell Lung Cancer of the left upper lobe, staging cT2 N1 M0. Procedure is VATS left upper lobectomy using the da Vinci Si. Allergies include Penicillin causing rash, and Codeine causing nausea. Medications are Metoprolol 25mg, Lisinopril 10mg, and Aspirin 81mg, which was held 7 days pre-op. For the procedural context, we are at Port Placement and Access. Warning: Avoid intercostal vessels during trocar insertion. The steps are: 1, keep CO2 insufflation pressure at or below 12 mmHg. 2, ensure all 3 trocars are seated and sealed. 3, confirm camera white-balance and focus. And 4, position the DLT with the left lung deflated."
            })
        elif "timeout" in system_prompt:
            return json.dumps({
                "action": "Show WHO checklist",
                "tool": "get_who_checklist",
                "tool_args": {"phase": "time_out"},
                "response": "Starting the WHO Surgical Safety Checklist for timeout. Please verify patient name, surgical site, and procedure."
            })
        elif "report" in system_prompt:
            if "log" in msg_lower:
                event_desc = user_message.split("log")[-1].strip()
                if not event_desc:
                    event_desc = "Intraoperative event logged."
                return json.dumps({
                    "action": "Log surgical event",
                    "tool": "log_event",
                    "tool_args": {"description": event_desc},
                    "response": f"Logged event: {event_desc}"
                })
            else:
                return json.dumps({
                    "action": "Display event log",
                    "tool": "show_event_log",
                    "tool_args": {},
                    "response": "Displaying the intraoperative event log."
                })
        elif "complication" in system_prompt:
            comp = "bleeding"
            if "bile" in msg_lower:
                comp = "bile_duct_injury"
            elif "convert" in msg_lower:
                comp = "conversion"
            elif "pneumo" in msg_lower:
                comp = "pneumothorax"
            return json.dumps({
                "action": f"Display protocol for {comp}",
                "tool": "get_complication_protocol",
                "tool_args": {"complication": comp},
                "response": f"Surfacing the complication protocol for {comp.replace('_', ' ')}. Please follow the steps on screen."
            })
        elif "ebl" in system_prompt:
            import re
            nums = re.findall(r"\d+", user_message)
            if nums:
                val = float(nums[0])
                return json.dumps({
                    "action": f"Update estimated blood loss by {val} ml",
                    "tool": "update_ebl",
                    "tool_args": {"amount_ml": val},
                    "response": f"Updating blood loss by {val} mL. Cumulative blood loss is tracked."
                })
            else:
                return json.dumps({
                    "action": "Get EBL summary",
                    "tool": "get_ebl_summary",
                    "tool_args": {},
                    "response": "Displaying the estimated blood loss summary on screen."
                })
        elif "drug" in system_prompt:
            drug = "cefazolin"
            for d in ["cefazolin", "penicillin", "warfarin", "aspirin", "lisinopril", "metoprolol"]:
                if d in msg_lower:
                    drug = d
                    break
            return json.dumps({
                "action": f"Check drug safety for {drug}",
                "tool": "check_drug_safety",
                "tool_args": {"drug_name": drug},
                "response": f"Running safety check for {drug}. Displaying results on screen."
            })
        elif "anatomy" in system_prompt:
            if "rotate" in msg_lower:
                return json.dumps({
                    "action": "Rotate 3D model",
                    "tool": "rotate_model",
                    "tool_args": {"degrees": 90.0},
                    "response": "Rotating the 3D anatomical model."
                })
            elif "hide" in msg_lower or "toggle" in msg_lower:
                return json.dumps({
                    "action": "Toggle structure visibility",
                    "tool": "toggle_structure",
                    "tool_args": {"structure_name": "liver"},
                    "response": "Toggling visibility of the requested structure."
                })
            elif "reset" in msg_lower:
                return json.dumps({
                    "action": "Reset 3D view",
                    "tool": "reset_3d_view",
                    "tool_args": {},
                    "response": "Resetting the 3D anatomical view."
                })
            else:
                return json.dumps({
                    "action": "Get anatomy context",
                    "tool": "get_anatomy_context",
                    "tool_args": {"structure": "cystic duct"},
                    "response": "Displaying critical anatomy and warnings for the dissection phase."
                })
        elif "handoff" in system_prompt:
            return json.dumps({
                "action": "Generate handoff report",
                "tool": "display_all_patient_data",
                "tool_args": {},
                "response": "Generating structured SBAR handoff report and showing active patient record."
            })
        elif "screen_advisor" in system_prompt or "Visual Surgical Intelligence" in system_prompt:
            return json.dumps({
                "action": "Analyze surgical screen",
                "tool": None,
                "tool_args": {},
                "response": "I see the surgical scene. The camera is positioned inside the peritoneal cavity, and a grasper is visible on the right. No active bleeding detected."
            })
            
        return json.dumps({
            "action": "Fallback action",
            "tool": None,
            "tool_args": {},
            "response": "I am operating in demo fallback mode. AWS Bedrock is not configured."
        })

    async def invoke(
        self,
        system_prompt: str,
        user_message: str,
        image_base64: Optional[str] = None,
        max_tokens: int = 2048,
        temperature: float = 0.3,
        history: Optional[list[dict[str, str]]] = None,
    ) -> str:
        """Invoke LLM via Bedrock Converse API with optional image input and conversation history."""
        if self.is_mock:
            return self._mock_invoke(system_prompt, user_message, image_base64)

        messages = []
        
        # Add past history if provided (limit to last 10 messages for context window)
        if history:
            valid_history = []
            for msg in history[-10:]:
                # Bedrock expects role to be 'user' or 'assistant'
                role = msg.get("role", "user")
                if role not in ["user", "assistant"]:
                    role = "assistant"
                
                # AWS Converse API requires strictly alternating roles
                if valid_history and valid_history[-1]["role"] == role:
                    valid_history[-1]["content"][0]["text"] += "\n" + msg.get("content", "")
                else:
                    valid_history.append({
                        "role": role,
                        "content": [{"text": msg.get("content", "")}]
                    })
                    
            # AWS Converse API requires the conversation to start with a 'user' message
            if valid_history and valid_history[0]["role"] != "user":
                valid_history.pop(0)

            messages.extend(valid_history)

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
        messages.append({"role": "user", "content": user_content})

        try:
            response = self._client.converse(
                modelId=self.model_id,
                system=[{"text": system_prompt}],
                messages=messages,
                inferenceConfig={
                    "maxTokens": max_tokens,
                    "temperature": temperature
                }
            )
            return response["output"]["message"]["content"][0]["text"]
        except Exception as e:
            logger.error(f"Bedrock invocation failed: {e}")
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
