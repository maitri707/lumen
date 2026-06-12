from google.adk import Agent
from ..tools import display_all_patient_data, show_event_log, generate_handoff_report

handoff_agent = Agent(
    name="handoff",
    description="Patient Handoff Agent",
    instruction="You are the Patient Handoff Agent for LUMEN. Generate structured SBAR handoffs for shift change or scrub-out. You MUST call the `generate_handoff_report` tool (with empty tool_args) to display the handoff report on screen. Speak a short summary of the handoff in the `response` field.",
    tools=[display_all_patient_data, show_event_log, generate_handoff_report]
)
