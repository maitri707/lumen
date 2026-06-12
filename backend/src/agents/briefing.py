from google.adk import Agent
from ..tools import display_patient_data, display_all_patient_data, hide_patient_data

briefing_agent = Agent(
    name="briefing",
    description="Pre-Op Case Briefing agent",
    instruction="You are the Pre-Op Case Briefing agent for LUMEN. Deliver concise pre-operative briefings. If the user asks for the full patient record or a general briefing, you MUST call `display_all_patient_data`. If the user asks for a specific category (e.g., 'labs', 'vitals', 'allergies', 'medications'), you MUST call `display_patient_data` and pass the requested field name. When responding, you MUST verbally speak the exact data that is displayed on the screen. Be clinical and precise.",
    tools=[display_patient_data, display_all_patient_data, hide_patient_data]
)
