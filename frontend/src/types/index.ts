/* LUMEN TypeScript types */

export interface WSMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface AgentResponse {
  agent: string;
  action?: string;
  response: string;
  tool?: string | null;
  tool_result?: ToolResult | null;
}

export interface ToolResult {
  tool: string;
  overlay?: OverlayData;
  message?: string;
  action?: string;
  error?: string;
  [key: string]: unknown;
}

export interface OverlayData {
  type: string;
  title: string;
  content: Record<string, unknown>;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

export interface ConversationMessage {
  role: "user" | "assistant" | "system" | "agent";
  content: string;
  agent?: string;
  timestamp: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  category: "protocol" | "decision" | "visual" | "orchestrator";
  capabilities: string[];
}

export interface ToolInfo {
  name: string;
  category: string;
}

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

// Agent definitions for display
export const AGENT_LIST: AgentInfo[] = [
  { id: "orchestrator", name: "Orchestrator", description: "Routes commands to specialist agents", category: "orchestrator", capabilities: ["Wake-word filtering", "AutoFlow routing", "Multi-turn", "8 specialist agents", "24 tools"] },
  { id: "briefing", name: "Briefing", description: "Pre-Op Case Briefing", category: "protocol", capabilities: ["Labs & vitals", "Allergies", "Phase briefing"] },
  { id: "timeout", name: "WHO Timeout", description: "WHO Safety Timeout", category: "protocol", capabilities: ["WHO checklist", "Patient ID confirm", "Allergy check"] },
  { id: "report", name: "Op. Report", description: "Operative Report Generator", category: "protocol", capabilities: ["Auto-documentation", "Event log", "SBAR format"] },
  { id: "complication", name: "Complication Advisor", description: "Complication Protocol Agent", category: "decision", capabilities: ["Bleeding response", "Conversion protocol", "Phase-aware"] },
  { id: "ebl_tracker", name: "EBL Tracker", description: "Blood Loss Tracker", category: "decision", capabilities: ["EBL tracking", "Running total", "Transfusion alert"] },
  { id: "drug_checker", name: "Drug Checker", description: "Intraoperative Drug Safety", category: "decision", capabilities: ["Allergy check", "Drug interactions", "Pre-dosing"] },
  { id: "anatomy_spotter", name: "Anatomy Spotter", description: "Anatomy Identification Agent", category: "decision", capabilities: ["Danger zones", "Structure ID", "Phase-aware"] },
  { id: "handoff", name: "Handoff", description: "Patient Handoff — SBAR", category: "protocol", capabilities: ["SBAR format", "Shift handoff", "Auto-summary"] },
  { id: "screen_advisor", name: "Visual Assistant", description: "Visual Console Intelligence", category: "visual", capabilities: ["Screen capture", "Vision analysis", "Live context"] },
];

export const TOOL_CATEGORIES = {
  "PATIENT DATA": ["display_patient_data", "display_all_patient_data", "hide_patient_data"],
  "CT IMAGING": ["navigate_ct", "jump_to_landmark", "hide_ct"],
  "3D ANATOMY": ["rotate_model", "toggle_structure", "hide_3d", "reset_3d_view"],
  "PROCEDURE": ["get_surgical_phase", "hide_surgical_checklist"],
  "OP. LOG": ["log_event", "show_event_log", "hide_event_log", "capture_surgical_photo"],
  "DECISION SUPPORT": ["get_complication_protocol", "update_ebl", "get_ebl_summary", "check_drug_safety", "get_anatomy_context"],
  "GLOBAL": ["hide_all_overlays", "show_only_ar"],
  "SCREEN SHARE": ["start_screen_share", "stop_screen_share"],
};
