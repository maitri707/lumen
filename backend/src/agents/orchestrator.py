"""LUMEN Orchestrator — routes to specialists with instant keyword matching (zero LLM routing calls)."""
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
from .patient_manager import patient_manager_agent

import json, logging, re
from typing import Any, Optional
from ..services.bedrock import bedrock_service
from ..tools import TOOL_REGISTRY
from ..services.vision import vision_service

logger = logging.getLogger("lumen.orchestrator")

orchestrator_agent = Agent(
    name="orchestrator",
    description="LUMEN's Orchestrator root agent",
    instruction="You are LUMEN's Orchestrator. Route commands to the correct specialist agent.",
    sub_agents=[
        briefing_agent, timeout_agent, report_agent, complication_agent,
        ebl_tracker_agent, drug_checker_agent, anatomy_spotter_agent,
        handoff_agent, screen_advisor_agent, patient_manager_agent
    ],
    tools=[TOOL_REGISTRY["hide_all_overlays"], TOOL_REGISTRY["show_only_ar"]]
)

AGENTS = {sub.name: sub for sub in orchestrator_agent.sub_agents}

# ── Keyword routing table ──────────────────────────────────────────
# Order matters: more specific patterns first, broader ones last.
KEYWORD_ROUTES = [
    ("patient_manager", [
        "load patient", "select patient", "start case for", "we are operating on",
        "switch patient", "patient is", "set patient", "patients list", "patient list",
        "schedule", "who are the patients", "list of patients", "working on", "open patient",
        "patient"
    ]),
    ("anatomy_spotter", [
        "3d model", "3d view", "rotate the model", "rotate model", "show me the lung",
        "danger zone", "at-risk", "at risk", "anatomy", "critical structure",
        "show the model", "left side", "right side", "posterior", "anterior",
        "lung", "lungs", "lobes", "chest"
        "show me the right", "show me the left",
    ]),
    ("complication", [
        "complication", "bleeding protocol", "bile duct injury", "bile duct",
        "pneumothorax", "conversion protocol", "emergency protocol",
        "nerve injury", "air leak", "hemorrhage",
    ]),
    ("drug_checker", [
        "drug safety", "safe to give", "safe to administer", "can we give",
        "medication check", "drug interaction", "contraindication",
        "penicillin", "cefazolin", "warfarin", "aspirin", "metoprolol", "lisinopril",
        "check drug", "is it safe",
    ]),
    ("ebl_tracker", [
        "blood loss", "ebl", "milliliters of blood", "ml of blood",
        "estimated blood", "transfusion", "how much blood", "total blood",
        "lost blood", "suctioned", "we lost",
    ]),
    ("report", [
        "operative report", "op report", "event log", "log that",
        "log event", "show the log", "show the report", "show me the report",
        "record that", "note that", "document that",
    ]),
    ("timeout", [
        "timeout", "time out", "who checklist", "safety checklist",
        "surgical safety", "run the checklist", "sign in", "sign out",
    ]),
    ("briefing", [
        "briefing", "brief me", "pre-op", "patient summary", "patient data",
        "show patient", "patient record", "patient info", "allergies",
        "who is the patient", "patient name",
    ]),
    ("handoff", [
        "handoff", "hand off", "shift change", "sbar", "scrub out",
        "handover", "transfer care",
    ]),
    ("screen_advisor", [
        "what do you see", "what's on screen", "what is on screen",
        "screen share", "what's happening", "what is happening",
        "describe the screen", "analyze the screen", "what instrument",
        "tell me what you see", "look at the screen", "on the screen",
    ]),
]


def _route_by_keywords(text_lower: str) -> Optional[str]:
    """Instant keyword-based routing. Returns agent name or None."""
    for agent_name, keywords in KEYWORD_ROUTES:
        if any(kw in text_lower for kw in keywords):
            return agent_name
    return None


# ── General-purpose prompt for conversational fallback ──────────────
GENERAL_PROMPT = """You are LUMEN, a voice-directed surgical intelligence assistant in the operating room.
If the user's request is unrecognized or ambiguous, politely ask them to clarify. DO NOT hallucinate commands or parrot examples.

You can assist with:
- Patient briefings and EHR data
- WHO surgical safety timeouts
- Tracking blood loss (EBL)
- Checking drug safety and allergies
- Displaying 3D anatomy models
- Complication protocols
- Operative logging
- Analyzing the live surgical screen

Answer the user's question naturally and helpfully. Be concise and professional. Keep responses under 2 sentences."""


class Orchestrator:
    def __init__(self):
        self.conversation_history: list[dict[str, str]] = []
        self.agent = orchestrator_agent

    async def process_command(self, text: str, screen_frame_b64: Optional[str] = None) -> dict[str, Any]:
        self.conversation_history.append({"role": "user", "content": text})
        text_lower = text.lower()

        # ── Step 1: Hide/clear commands (instant, no LLM) ──
        if "hide" in text_lower or "clear" in text_lower:
            tool_result = TOOL_REGISTRY.get("hide_all_overlays", lambda: None)()
            response_text = "All overlays cleared."
            self.conversation_history.append({"role": "assistant", "content": response_text})
            return {"agent": "orchestrator", "response": response_text, "tool": "hide_all_overlays", "tool_result": tool_result}

        # ── Step 2: Instant keyword routing (no LLM call) ──
        target_agent = _route_by_keywords(text_lower)

        if target_agent and target_agent in AGENTS:
            logger.info(f"Keyword-routed to: {target_agent}")
            return await self._run_specialist(target_agent, text, screen_frame_b64)

        # ── Step 3: Semantic LLM routing ──
        logger.info("No keyword match — attempting semantic routing")
        agent_names = ", ".join(AGENTS.keys())
        router_prompt = f"""You are a surgical routing AI. Classify the user's request into EXACTLY ONE of these specialist agents:
{agent_names}

If the request doesn't match any agent's typical domain, reply 'none'.
Return ONLY the single word representing the agent name."""
        
        try:
            semantic_response = await bedrock_service.invoke(
                system_prompt=router_prompt,
                user_message=text,
                max_tokens=20
            )
            semantic_agent = semantic_response.strip().lower()
            
            # Match the response to an agent
            for name in AGENTS.keys():
                if name in semantic_agent:
                    logger.info(f"Semantically routed to: {name}")
                    return await self._run_specialist(name, text, screen_frame_b64)
        except Exception as e:
            logger.error(f"Semantic routing failed: {e}")

        # ── Step 4: General conversational fallback (single LLM call) ──
        logger.info("Semantic routing failed — using general LLM response")
        
        # Inject current patient context
        from ..tools.patient_data import get_patient
        pt = get_patient()
        pt_context = f"\n\nActive Patient Context:\n- Name: {pt.name} (Age {pt.age}, {pt.sex})\n- Diagnosis: {pt.diagnosis}\n- Procedure: {pt.procedure}\n- Allergies: {', '.join(pt.allergies)}"
        
        try:
            raw_response = await bedrock_service.invoke(
                system_prompt=GENERAL_PROMPT + pt_context,
                user_message=text,
                history=self.conversation_history[:-1] # Pass history excluding the current user message
            )
            response_text = raw_response.strip()
            # Clean up any JSON wrapping from mock mode
            if response_text.startswith("{"):
                try:
                    parsed = json.loads(response_text)
                    response_text = parsed.get("response", response_text)
                except json.JSONDecodeError:
                    pass
        except Exception as e:
            logger.error(f"General response failed: {e}")
            response_text = (
                "I'm LUMEN, your surgical assistant. You can ask me for patient briefings, "
                "WHO checklists, drug safety checks, blood loss tracking, complication protocols, "
                "3D anatomy, operative reports, and screen analysis. Just tell me what you need!"
            )

        self.conversation_history.append({"role": "assistant", "content": response_text})
        return {"agent": "orchestrator", "response": response_text, "tool": None, "tool_result": None}

    async def _run_specialist(self, agent_name: str, text: str, screen_frame_b64: Optional[str] = None) -> dict[str, Any]:
        """Run a single specialist agent — makes exactly ONE LLM call."""
        specialist = AGENTS[agent_name]

        # Special case: screen_advisor with an active frame uses vision service directly
        if agent_name == "screen_advisor" and screen_frame_b64:
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
            self.conversation_history.append({"role": "assistant", "content": response_payload["response"]})
            return response_payload

        # Build specialist prompt with specific tool signatures and descriptions
        import inspect
        tool_descriptions = []
        for tool_fn in specialist.tools:
            doc_str = getattr(tool_fn, "__doc__", None) or "No description"
            doc = doc_str.split("\n")[0].strip()
            try:
                sig = str(inspect.signature(tool_fn))
            except Exception:
                sig = "()"
            tool_descriptions.append(f"- {tool_fn.__name__}{sig}: {doc}")

        # Inject current patient context
        from ..tools.patient_data import get_patient
        pt = get_patient()
        pt_context = f"\n\nActive Patient Context:\n- Name: {pt.name} (Age {pt.age}, {pt.sex})\n- Diagnosis: {pt.diagnosis}\n- Procedure: {pt.procedure}\n- Allergies: {', '.join(pt.allergies)}"

        full_prompt = specialist.instruction + pt_context + "\n\nAvailable tools:\n" + "\n".join(tool_descriptions)
        full_prompt += """\n\nRespond ONLY with a valid JSON object in this exact format:
{"action": "brief description", "tool": "tool_name_or_null", "tool_args": {"arg_name": "value"}, "response": "verbal response to user"}"""

        raw = await bedrock_service.invoke(
            system_prompt=full_prompt,
            user_message=text,
            image_base64=screen_frame_b64,
            history=self.conversation_history[:-1]
        )

        try:
            raw = raw.strip()
            if raw.startswith("```"):
                raw = re.sub(r"```\w*\n?", "", raw).strip()
            parsed = json.loads(raw)

            tool_name = parsed.get("tool")
            tool_result = None
            if tool_name and tool_name in TOOL_REGISTRY:
                try:
                    tool_result = TOOL_REGISTRY[tool_name](**parsed.get("tool_args", {}))
                except Exception as e:
                    logger.error(f"Tool error ({tool_name}): {e}")
                    tool_result = {"error": str(e)}

            result = {
                "agent": specialist.name,
                "action": parsed.get("action", ""),
                "response": parsed.get("response", ""),
                "tool": tool_name,
                "tool_result": tool_result,
            }
            self.conversation_history.append({"role": "assistant", "content": result.get("response", "")})
            return result
        except Exception as e:
            logger.error(f"Agent JSON parse error for {agent_name}: {e}")
            # Return the raw text as a spoken response even if JSON parsing failed
            response_text = raw if raw and not raw.startswith("[LUMEN]") else f"The {agent_name} agent processed your request."
            self.conversation_history.append({"role": "assistant", "content": response_text})
            return {"agent": specialist.name, "response": response_text, "tool": None, "tool_result": None}


orchestrator = Orchestrator()
