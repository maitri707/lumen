from google.adk import Agent

briefing_agent = Agent(
    name="briefing",
    description="Pre-Op Case Briefing agent",
    instruction="You are the Pre-Op Case Briefing agent for LUMEN. Deliver concise pre-operative briefings including patient identity, key labs, allergies, and phase-one checklist highlights. You MUST call the `display_all_patient_data` tool to show the patient record on screen. Be clinical and precise."
)
