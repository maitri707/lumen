"""LUMEN — FastAPI + WebSocket server for voice-directed surgical intelligence."""
from __future__ import annotations
import json, logging, asyncio, base64
from datetime import datetime
from typing import Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .agents.orchestrator import orchestrator
from .agents import AGENTS
from .tools import TOOL_REGISTRY
from .services.vision import vision_service
from .services.audio import audio_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(name)s | %(levelname)s | %(message)s")
logger = logging.getLogger("lumen.server")

app = FastAPI(title="LUMEN", description="Voice-Directed Intelligence for the Operating Room", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Connected clients
clients: list[WebSocket] = []

latest_screen_frame: str | None = None

# ─── REST Endpoints ──────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"name": "LUMEN", "status": "online", "agents": len(AGENTS), "tools": len(TOOL_REGISTRY)}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/agents")
async def list_agents():
    return {"agents": [{"name": a.name, "type": type(a).__name__} for a in AGENTS.values()]}

@app.get("/tools")
async def list_tools():
    categories = {
        "patient_data": ["display_patient_data", "display_all_patient_data", "hide_patient_data"],
        "ct_imaging": ["navigate_ct", "jump_to_landmark", "hide_ct"],
        "3d_anatomy": ["rotate_model", "toggle_structure", "hide_3d", "reset_3d_view"],
        "procedure": ["get_surgical_phase", "get_who_checklist", "confirm_checklist_item", "hide_surgical_checklist"],
        "op_log": ["log_event", "show_event_log", "hide_event_log", "capture_surgical_photo"],
        "decision_support": ["get_complication_protocol", "update_ebl", "get_ebl_summary", "check_drug_safety", "get_anatomy_context"],
        "global": ["hide_all_overlays", "show_only_ar"],
        "screen_share": ["start_screen_share", "stop_screen_share"],
    }
    return {"tools": list(TOOL_REGISTRY.keys()), "categories": categories, "count": len(TOOL_REGISTRY)}

# ─── WebSocket ───────────────────────────────────────────────────────────────

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    global latest_screen_frame
    await ws.accept()
    clients.append(ws)
    logger.info(f"Client connected. Total: {len(clients)}")
    await ws.send_json({"type": "connection", "data": {"status": "connected", "agents": len(AGENTS), "tools": len(TOOL_REGISTRY)}, "timestamp": datetime.utcnow().isoformat()})
    try:
        while True:
            raw = await ws.receive_text()
            msg = json.loads(raw)
            msg_type = msg.get("type", "")

            if msg_type == "voice_command":
                text = msg.get("data", {}).get("text", "")
                if not text: continue
                await ws.send_json({"type": "agent_activity", "data": {"status": "processing", "agent": "orchestrator", "message": f"Processing: {text}"}, "timestamp": datetime.utcnow().isoformat()})
                
                # Pass the latest passively-collected frame as context
                result = await orchestrator.process_command(text, screen_frame_b64=latest_screen_frame)
                
                # Synthesize speech
                response_text = result.get("response", "")
                if response_text:
                    audio_b64 = await asyncio.to_thread(audio_service.synthesize_speech, response_text)
                    result["audio_base64"] = audio_b64
                
                await ws.send_json({"type": "agent_response", "data": result, "timestamp": datetime.utcnow().isoformat()})

            elif msg_type == "screen_frame":
                frame_b64 = msg.get("data", {}).get("image_base64", "")
                question = msg.get("data", {}).get("question", "")
                if frame_b64:
                    latest_screen_frame = frame_b64 # Silently store the latest frame for context
                    
                    if question:
                        await ws.send_json({"type": "agent_activity", "data": {"status": "analyzing", "agent": "screen_advisor", "message": "Analyzing screen..."}, "timestamp": datetime.utcnow().isoformat()})
                        result = await orchestrator.process_command(question, screen_frame_b64=frame_b64)
                        
                        response_text = result.get("response", "")
                        if response_text:
                            audio_b64 = await asyncio.to_thread(audio_service.synthesize_speech, response_text)
                            result["audio_base64"] = audio_b64
                            
                        await ws.send_json({"type": "agent_response", "data": result, "timestamp": datetime.utcnow().isoformat()})

            elif msg_type == "tool_call":
                tool_name = msg.get("data", {}).get("tool", "")
                tool_args = msg.get("data", {}).get("args", {})
                if tool_name in TOOL_REGISTRY:
                    try:
                        result = TOOL_REGISTRY[tool_name](**tool_args)
                        await ws.send_json({"type": "tool_result", "data": {"tool": tool_name, "result": result}, "timestamp": datetime.utcnow().isoformat()})
                    except Exception as e:
                        await ws.send_json({"type": "error", "data": {"tool": tool_name, "error": str(e)}, "timestamp": datetime.utcnow().isoformat()})

            elif msg_type == "ping":
                await ws.send_json({"type": "pong", "timestamp": datetime.utcnow().isoformat()})

    except WebSocketDisconnect:
        clients.remove(ws)
        logger.info(f"Client disconnected. Total: {len(clients)}")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        if ws in clients: clients.remove(ws)
