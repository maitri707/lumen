"""Pydantic schemas for LUMEN."""

from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field


# ─── Enums ───────────────────────────────────────────────────────────────────

class AgentType(str, Enum):
    ORCHESTRATOR = "orchestrator"
    BRIEFING = "briefing"
    TIMEOUT = "timeout"
    REPORT = "report"
    COMPLICATION = "complication"
    EBL_TRACKER = "ebl_tracker"
    DRUG_CHECKER = "drug_checker"
    ANATOMY_SPOTTER = "anatomy_spotter"
    HANDOFF = "handoff"
    SCREEN_ADVISOR = "screen_advisor"


class SurgicalPhase(str, Enum):
    PRE_OP = "pre_op"
    INDUCTION = "induction"
    INCISION = "incision"
    DISSECTION = "dissection"
    CRITICAL_VIEW = "critical_view"
    CLIPPING = "clipping"
    TRANSECTION = "transection"
    HEMOSTASIS = "hemostasis"
    EXTRACTION = "extraction"
    CLOSURE = "closure"
    POST_OP = "post_op"


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"
    AGENT = "agent"


# ─── WebSocket Messages ─────────────────────────────────────────────────────

class WSMessage(BaseModel):
    type: str
    data: dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class VoiceCommand(BaseModel):
    text: str
    audio_base64: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AgentResponse(BaseModel):
    agent: AgentType
    message: str
    tool_calls: list[ToolCall] = Field(default_factory=list)
    overlays: list[OverlayData] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ToolCall(BaseModel):
    tool_name: str
    arguments: dict[str, Any] = Field(default_factory=dict)
    result: Optional[Any] = None


class OverlayData(BaseModel):
    type: str  # "patient_data", "ct_image", "3d_model", "checklist", "event_log", etc.
    title: str
    content: dict[str, Any] = Field(default_factory=dict)
    position: str = "top-left"  # "top-left", "top-right", "bottom-left", "bottom-right", "center"


# ─── Patient Data ────────────────────────────────────────────────────────────

class PatientData(BaseModel):
    id: str = "PT-2024-0847"
    name: str = "James Wilson"
    age: int = 58
    sex: str = "Male"
    weight_kg: float = 72.0
    height_cm: float = 175.0
    blood_type: str = "O+"
    allergies: list[str] = Field(default_factory=lambda: ["Penicillin", "Codeine"])
    allergy_details: list[dict[str, str]] = Field(default_factory=list)
    medications: list[str] = Field(default_factory=list)
    medication_notes: list[str] = Field(default_factory=list)
    diagnosis: str = "Stage II NSCLC — left upper lobe"
    staging: str = "cT2N1M0"
    procedure: str = "VATS left upper lobectomy"
    surgical_system: str = "da Vinci Si"
    labs: dict[str, Any] = Field(default_factory=dict)
    vitals: dict[str, Any] = Field(default_factory=dict)
    procedural_context: dict[str, Any] = Field(default_factory=dict)
    estimated_blood_volume_ml: float = 5040.0


# ─── Operative Log ───────────────────────────────────────────────────────────

class EventLogEntry(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    phase: SurgicalPhase
    event: str
    agent: AgentType
    details: Optional[str] = None


# ─── EBL Tracking ────────────────────────────────────────────────────────────

class EBLRecord(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    amount_ml: float
    source: str = "surgeon_estimate"
    cumulative_ml: float = 0.0
    percentage_ebv: float = 0.0


# ─── Drug Safety ─────────────────────────────────────────────────────────────

class DrugCheckRequest(BaseModel):
    drug_name: str
    dose: Optional[str] = None
    route: Optional[str] = None


class DrugCheckResult(BaseModel):
    drug_name: str
    safe: bool
    verdict: str  # "SAFE", "CAUTION", "CONTRAINDICATED"
    allergies_flagged: list[str] = Field(default_factory=list)
    interactions: list[str] = Field(default_factory=list)
    notes: str = ""


# ─── Screen Share ────────────────────────────────────────────────────────────

class ScreenFrame(BaseModel):
    image_base64: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    width: int = 1920
    height: int = 1080


class VisionAnalysis(BaseModel):
    description: str
    elements_detected: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    agent: AgentType = AgentType.SCREEN_ADVISOR


# ─── Conversation ────────────────────────────────────────────────────────────

class ConversationMessage(BaseModel):
    role: MessageRole
    content: str
    agent: Optional[AgentType] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
