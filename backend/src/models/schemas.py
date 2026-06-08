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
    name: str = "John Mitchell"
    age: int = 62
    sex: str = "Male"
    weight_kg: float = 84.5
    height_cm: float = 175.0
    blood_type: str = "A+"
    allergies: list[str] = Field(default_factory=lambda: ["Penicillin", "Latex"])
    medications: list[str] = Field(default_factory=lambda: [
        "Metoprolol 50mg BID",
        "Lisinopril 10mg daily",
        "Aspirin 81mg daily (held 7 days pre-op)",
    ])
    diagnosis: str = "Symptomatic cholelithiasis"
    procedure: str = "Laparoscopic cholecystectomy"
    labs: dict[str, Any] = Field(default_factory=lambda: {
        "hemoglobin": {"value": 13.2, "unit": "g/dL", "normal": "12.0-17.5"},
        "hematocrit": {"value": 39.8, "unit": "%", "normal": "36-51"},
        "platelets": {"value": 245, "unit": "K/µL", "normal": "150-400"},
        "inr": {"value": 1.1, "unit": "", "normal": "0.8-1.2"},
        "creatinine": {"value": 0.9, "unit": "mg/dL", "normal": "0.7-1.3"},
        "potassium": {"value": 4.1, "unit": "mEq/L", "normal": "3.5-5.0"},
        "glucose": {"value": 105, "unit": "mg/dL", "normal": "70-110"},
    })
    estimated_blood_volume_ml: float = 5920.0  # ~70 mL/kg × 84.5 kg


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
