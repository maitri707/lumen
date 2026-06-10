from google.adk import Agent

from .briefing import briefing_agent
from .timeout import timeout_agent
from .report import report_agent
from .complication import complication_agent
from .ebl_tracker import ebl_tracker_agent
from .drug_checker import drug_checker_agent
from .anatomy_spotter import anatomy_spotter_agent
from .handoff import handoff_agent
from .screen_advisor import screen_advisor_agent

import json, logging, re
from typing import Any, Optional
from ..services.bedrock import bedrock_service
from ..tools import TOOL_REGISTRY
from ..services.vision import vision_service

logger = logging.getLogger("lumen.orchestrator")

orchestrator_agent = Agent(
    name="orchestrator",
    description="ORION Orchestrator root agent",
    instruction="""You are LUMEN's Orchestrator. Your ONLY job is to analyze the surgeon's voice command and route it to the correct specialist agent.
You have 9 specialist agents.
If it's a generic command or hiding overlays ("hide everything"), route to "orchestrator".
Never state clinical values from memory — always call a tool.""",
    sub_agents=[
        briefing_agent, timeout_agent, report_agent, complication_agent,
        ebl_tracker_agent, drug_checker_agent, anatomy_spotter_agent,
        handoff_agent, screen_advisor_agent
    ]
)

AGENTS = {sub.name: sub for sub in orchestrator_agent.sub_agents}

class Orchestrator:
    def __init__(self):
        self.conversation_history: list[dict[str, str]] = []
        self.agent = orchestrator_agent

    async def process_command(self, text: str, screen_frame_b64: Optional[str] = None) -> dict[str, Any]:
        self.conversation_history.append({"role": "user", "content": text})
        
        # 1. Routing
        try:
            routing_prompt = self.agent.instruction + "\n\nSpecialist agents:\n"
            for sub in self.agent.sub_agents:
                routing_prompt += f"- {sub.name}: {sub.description}\n"
            routing_prompt += """\nRespond ONLY with a valid JSON object containing the target agent:
{"target_agent": "<agent_name>"}"""

            raw = await bedrock_service.invoke(system_prompt=routing_prompt, user_message=text)
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
            specialist = AGENTS[target_agent]
            
            # Special case for screen_advisor which uses vision_service
            if specialist.name == "screen_advisor" and screen_frame_b64 and "navigate_ct" not in text and "jump_to_landmark" not in text:
                result_vision = await vision_service.analyze_frame(screen_frame_b64, question=text)
                response_payload = {
                    "agent": specialist.name, 
                    "response": result_vision["analysis"], 
                    "tool": "display_analyzed_frame", 
                    "tool_result": {
                        "overlay": {
                            "type": "analyzed_frame",
                            "title": "Vision Analysis",
                            "position": "top-right",
                            "content": {"image_base64": screen_frame_b64}
                        }
                    }
                }
                self.conversation_history.append({"role": "assistant", "content": response_payload.get("response", "")})
                return response_payload

            full_prompt = specialist.instruction + "\n\nAvailable tools: " + ", ".join(TOOL_REGISTRY.keys())
            full_prompt += """\n\nRespond ONLY with a valid JSON object in this exact format:
{"action": "brief description", "tool": "tool_name_or_null", "tool_args": {}, "response": "verbal response to user"}"""
            
            raw_spec = await bedrock_service.invoke(system_prompt=full_prompt, user_message=text, image_base64=screen_frame_b64)
            
            try:
                raw_spec = raw_spec.strip()
                if raw_spec.startswith("```"): raw_spec = re.sub(r"```\w*\n?", "", raw_spec).strip()
                parsed_spec = json.loads(raw_spec)
                
                tool_name = parsed_spec.get("tool")
                tool_result = None
                if tool_name and tool_name in TOOL_REGISTRY:
                    try:
                        tool_result = TOOL_REGISTRY[tool_name](**parsed_spec.get("tool_args", {}))
                    except Exception as e:
                        logger.error(f"Tool error: {e}")
                        tool_result = {"error": str(e)}
                        
                result = {
                    "agent": specialist.name,
                    "action": parsed_spec.get("action", ""),
                    "response": parsed_spec.get("response", ""),
                    "tool": tool_name,
                    "tool_result": tool_result
                }
                self.conversation_history.append({"role": "assistant", "content": result.get("response", "")})
                return result
            except Exception as e:
                logger.error(f"Agent JSON parse error: {e}")
                return {"agent": specialist.name, "response": str(raw_spec)}
                
        # 3. Fallback generic handling
        text_lower = text.lower()
        if "hide" in text_lower or "clear" in text_lower:
             tool_result = TOOL_REGISTRY.get("hide_all_overlays", lambda: None)()
             response_text = "All overlays cleared."
             self.conversation_history.append({"role": "assistant", "content": response_text})
             return {"agent": "orchestrator", "response": response_text, "tool": "hide_all_overlays", "tool_result": tool_result}
             
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
