"""LUMEN Orchestrator — Root agent that routes to 9 specialist agents."""
from __future__ import annotations
import json, logging, re
from typing import Any, Optional
from ..services.bedrock import bedrock_service
from .specialists import AGENTS

logger = logging.getLogger("lumen.orchestrator")

ORCHESTRATOR_SYSTEM = """You are LUMEN's Orchestrator. Your ONLY job is to analyze the surgeon's voice command and route it to the correct specialist agent.
You have 9 specialist agents:
1. briefing — Pre-op case briefing (patient data, labs, allergies)
2. timeout — WHO Surgical Safety Checklist
3. report — Operative report generation
4. complication — Complication protocol response (bleeding, etc.)
5. ebl_tracker — Blood loss tracking
6. drug_checker — Drug safety checks
7. anatomy_spotter — Anatomy identification, 3D model manipulation (rotate, hide)
8. handoff — Patient handoff SBAR
9. screen_advisor — Visual console intelligence (screen share analysis), CT navigation

Respond ONLY with a valid JSON object containing the target agent:
{"target_agent": "<agent_name>"}
If it's a generic command or hiding overlays ("hide everything"), route to "orchestrator".
"""

class Orchestrator:
    def __init__(self):
        self.conversation_history: list[dict[str, str]] = []

    async def process_command(self, text: str, screen_frame_b64: Optional[str] = None) -> dict[str, Any]:
        self.conversation_history.append({"role": "user", "content": text})
        
        # 1. Routing
        try:
            raw = await bedrock_service.invoke(system_prompt=ORCHESTRATOR_SYSTEM, user_message=text)
            raw = raw.strip()
            if raw.startswith("```"): raw = re.sub(r"```\w*\n?", "", raw).strip()
            parsed = json.loads(raw)
            target_agent = parsed.get("target_agent", "orchestrator")
        except Exception as e:
            logger.warning(f"Routing failed, defaulting to orchestrator. Error: {e}")
            target_agent = "orchestrator"
            
        if target_agent not in AGENTS and target_agent != "orchestrator":
            target_agent = "orchestrator"
            
        logger.info(f"Routing command to agent: {target_agent}")
            
        # 2. Handoff to specialist
        if target_agent in AGENTS:
            result = await AGENTS[target_agent].handle(text, self.conversation_history, screen_frame_b64)
            self.conversation_history.append({"role": "assistant", "content": result.get("response", "")})
            return result
            
        # 3. Fallback generic handling
        from ..tools import TOOL_REGISTRY
        text_lower = text.lower()
        if "hide" in text_lower or "clear" in text_lower:
             tool_result = TOOL_REGISTRY.get("hide_all_overlays", lambda: None)()
             response_text = "All overlays cleared."
             self.conversation_history.append({"role": "assistant", "content": response_text})
             return {"agent": "orchestrator", "response": response_text, "tool": "hide_all_overlays", "tool_result": tool_result}
             
        import re
        if re.search(r'\b(hello|hi|who are you|what can you do|help|who is this)\b', text_lower):
             response_text = (
                 "Hello! I am LUMEN, your voice-directed surgical intelligence assistant. "
                 "I can help you with pre-operative briefings, the WHO safety checklist, drug safety, blood loss tracking, "
                 "displaying complication protocols, and controlling the 3D anatomical model. How can I assist you in the OR today?"
             )
             self.conversation_history.append({"role": "assistant", "content": response_text})
             return {"agent": "orchestrator", "response": response_text, "tool": None, "tool_result": None}

        response_text = "I'm not sure which agent should handle that command."
        self.conversation_history.append({"role": "assistant", "content": response_text})
        return {"agent": "orchestrator", "response": response_text, "tool": None, "tool_result": None}

orchestrator = Orchestrator()
