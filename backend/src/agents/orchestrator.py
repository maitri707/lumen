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

# ── ML Intent Routing replaces KEYWORD_ROUTES ──────────────


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


MAX_HISTORY = 6

class Orchestrator:
    def __init__(self):
        self.conversation_history: list[dict[str, str]] = []
        self.agent = orchestrator_agent
        self._build_specialist_prompts()

    def _trimmed_history(self) -> list[dict[str, str]]:
        return self.conversation_history[-MAX_HISTORY:] if self.conversation_history else []

    def _build_specialist_prompts(self):
        import inspect
        self._specialist_prompts = {}
        for name, specialist in AGENTS.items():
            tool_descriptions = []
            for tool_fn in specialist.tools:
                doc = (getattr(tool_fn, "__doc__", "") or "").split("\n")[0].strip()
                try:
                    sig = str(inspect.signature(tool_fn))
                except Exception:
                    sig = "()"
                tool_descriptions.append(f"- {tool_fn.__name__}{sig}: {doc}")
            
            self._specialist_prompts[name] = (
                specialist.instruction
                + "\n\nAvailable tools:\n"
                + "\n".join(tool_descriptions)
                + """\n\nRespond ONLY with a valid JSON object in this exact format:
{"action": "brief description", "tool": "tool_name_or_null", "tool_args": {"arg_name": "value"}, "response": "verbal response to user", "auto_log_summary": "If this interaction represents a clinically important event that should be documented in the operative report, provide a 1-sentence summary here. Otherwise, set to null."}"""
            )

    async def process_command(self, text: str, screen_frame_b64: Optional[str] = None) -> dict[str, Any]:
        from ..tools.patient_data import get_patient
        pt = get_patient()
        pt_context = f"\n\nActive Patient Context:\n- Name: {pt.name} (Age {pt.age}, {pt.sex})\n- Diagnosis: {pt.diagnosis}\n- Procedure: {pt.procedure}\n- Allergies: {', '.join(pt.allergies)}"

        # Snapshot history BEFORE appending current turn
        history_snapshot = self._trimmed_history()

        self.conversation_history.append({"role": "user", "content": text})
        text_lower = text.lower()

        # ── Step 1: Hide/clear commands (instant, no LLM) ──
        if "hide" in text_lower or "clear" in text_lower:
            tool_result = TOOL_REGISTRY.get("hide_all_overlays", lambda: None)()
            response_text = "All overlays cleared."
            self.conversation_history.append({"role": "assistant", "content": response_text})
            return {"agent": "orchestrator", "response": response_text, "tool": "hide_all_overlays", "tool_result": tool_result}

        # ── Step 2: Fast ML Intent Classification (No LLM Call) ──
        from ..services.classifier import intent_classifier
        target_agent, confidence = intent_classifier.classify(text_lower, threshold=0.25)

        if target_agent and target_agent in AGENTS:
            logger.info(f"ML-routed to: {target_agent} (confidence: {confidence:.2f})")
            return await self._run_specialist(target_agent, text, screen_frame_b64, pt_context, history_snapshot)

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
            semantic_clean = semantic_agent.replace(" ", "_").replace("-", "_").lower()
            
            # Match the response to an agent
            for name in AGENTS.keys():
                if name == semantic_clean or name in semantic_clean:
                    logger.info(f"Semantically routed to: {name}")
                    return await self._run_specialist(name, text, screen_frame_b64, pt_context, history_snapshot)

            # Router returned "none" — fall through to step 4
            if semantic_clean == "none":
                raise ValueError("Unroutable — go to general fallback")
                
        except Exception as e:
            logger.error(f"Routing miss ({e}) — general fallback")

        # ── Step 4: General conversational fallback (single LLM call) ──
        logger.info("Semantic routing failed — using general LLM response")
        try:
            # General fallback doesn't need the JSON system reminder
            raw_response = await bedrock_service.invoke(
                system_prompt=GENERAL_PROMPT + pt_context,
                user_message=text,
                history=history_snapshot
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

    async def _run_specialist(self, agent_name: str, text: str, screen_frame_b64: Optional[str] = None, pt_context: str = None, history_snapshot: list = None) -> dict[str, Any]:
        """Run a single specialist agent — makes exactly ONE LLM call."""
        if pt_context is None:
            raise ValueError("pt_context is required for specialist calls")
        if history_snapshot is None:
            history_snapshot = []
            
        specialist = AGENTS[agent_name]

        # Special case: screen_advisor with an active frame uses vision service directly
        if agent_name == "screen_advisor" and screen_frame_b64:
            from ..tools.procedure import get_surgical_phase
            from ..tools.op_log import get_full_log
            
            phase_info = get_surgical_phase().get("phase_display", "Unknown")
            logs = get_full_log()
            recent_logs = "\n".join([f"- {l.timestamp.strftime('%H:%M:%S')} ({l.phase.value}): {l.event}" for l in logs[-3:]]) if logs else "No recent events."
            
            vision_prompt = (
                f"{pt_context}\n\n"
                f"Current Surgical Phase: {phase_info}\n"
                f"Recent Operative Events:\n{recent_logs}\n\n"
                f"User Question: {text}"
            )
            
            result_vision = await vision_service.analyze_frame(screen_frame_b64, question=vision_prompt)
            
            # Check for vision auto-log prefix
            analysis_text = result_vision["analysis"]
            if analysis_text.startswith("[AUTO-LOG:"):
                end_idx = analysis_text.find("]")
                if end_idx != -1:
                    log_summary = analysis_text[10:end_idx].strip()
                    from ..tools.op_log import log_event
                    log_event(event=log_summary, phase=get_surgical_phase().get("phase", "dissection"), agent=specialist.name)
                    analysis_text = analysis_text[end_idx+1:].strip()
            
            response_payload = {
                "agent": specialist.name,
                "response": analysis_text,
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

        full_prompt = self._specialist_prompts[agent_name] + pt_context

        # Enforce JSON formatting by appending a reminder directly to the user's message
        enforced_user_message = f"{text}\n\n[SYSTEM REMINDER: You MUST respond ONLY with the raw JSON object containing action, tool, tool_args, and response. No other text.]"

        raw = await bedrock_service.invoke(
            system_prompt=full_prompt,
            user_message=enforced_user_message,
            image_base64=screen_frame_b64,
            history=history_snapshot
        )

        try:
            raw = raw.strip()
            if raw.startswith("```"):
                raw = re.sub(r"```\w*\n?", "", raw).strip()
            
            # Auto-fix common LLM JSON syntax errors
            if raw.endswith("]") and raw.startswith("{"):
                raw = raw[:-1] + "}"
                
            parsed = json.loads(raw)

            tool_name = parsed.get("tool")
            tool_result = None
            
            allowed_tools = {fn.__name__: fn for fn in specialist.tools}
            
            if tool_name and tool_name in allowed_tools:
                try:
                    tool_result = allowed_tools[tool_name](**parsed.get("tool_args", {}))
                except Exception as e:
                    logger.error(f"Tool error ({tool_name}): {e}")
                    tool_result = {"error": str(e)}
            elif tool_name and tool_name not in allowed_tools:
                logger.warning(f"Agent {agent_name} attempted to call unauthorized tool: {tool_name}")
                if agent_name == "briefing" and "display_all_patient_data" in allowed_tools:
                    logger.warning("Auto-correcting briefing agent to use display_all_patient_data")
                    tool_result = allowed_tools["display_all_patient_data"]()
                    tool_name = "display_all_patient_data"
                else:
                    tool_result = {"error": f"Tool '{tool_name}' not allowed for {agent_name}."}
            elif not tool_name and agent_name == "briefing" and "display_all_patient_data" in allowed_tools:
                # Fallback: Briefing agent MUST call display_all_patient_data
                logger.warning("Briefing agent omitted tool call, auto-injecting display_all_patient_data")
                tool_result = allowed_tools["display_all_patient_data"]()
                tool_name = "display_all_patient_data"

            result = {
                "agent": specialist.name,
                "action": parsed.get("action", ""),
                "response": parsed.get("response", ""),
                "tool": tool_name,
                "tool_result": tool_result,
            }
            
            # Auto-log if the agent decided it was critical
            auto_log = parsed.get("auto_log_summary")
            if auto_log:
                from ..tools.procedure import get_surgical_phase
                from ..tools.op_log import log_event
                log_event(event=auto_log, phase=get_surgical_phase().get("phase", "dissection"), agent=specialist.name)
                
            self.conversation_history.append({"role": "assistant", "content": result.get("response", "")})
            return result
        except Exception as e:
            raw_err = raw[:200] if isinstance(raw, str) else str(raw)
            logger.error(f"Agent JSON parse error for {agent_name}: {e}\nRaw: {raw_err}")
            
            # Try to salvage just the response field with regex
            match = re.search(r'"response"\s*:\s*"([^"]+)"', str(raw))
            if match:
                response_text = match.group(1)
            else:
                response_text = raw if raw and not str(raw).startswith("[LUMEN]") else f"I processed your {agent_name} request but had a formatting issue. Please try again."
            
            # Try to salvage tool if possible (especially for briefing)
            tool_name = None
            tool_result = None
            allowed_tools = {fn.__name__: fn for fn in specialist.tools}
            if agent_name == "briefing" and "display_all_patient_data" in allowed_tools:
                logger.warning("Salvaging briefing agent response by forcefully executing display_all_patient_data")
                tool_name = "display_all_patient_data"
                tool_result = allowed_tools["display_all_patient_data"]()
                
            self.conversation_history.append({"role": "assistant", "content": response_text})
            return {"agent": specialist.name, "response": response_text, "tool": tool_name, "tool_result": tool_result}


orchestrator = Orchestrator()
