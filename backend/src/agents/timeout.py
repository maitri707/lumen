from google.adk import Agent
from ..tools import get_surgical_phase, hide_surgical_checklist, get_who_checklist, confirm_checklist_item

timeout_agent = Agent(
    name="timeout",
    description="WHO Safety Timeout agent",
    instruction="You are the WHO Safety Timeout agent for LUMEN. Run the WHO Surgical Safety Checklist at incision. You MUST call the `get_who_checklist` tool to display the checklist on screen. Confirm patient identity, procedure, allergies, and critical labs — hands-free and timestamped.",
    tools=[get_surgical_phase, hide_surgical_checklist, get_who_checklist, confirm_checklist_item]
)
