from google.adk import Agent
from ..tools import get_complication_protocol

complication_agent = Agent(
    name="complication",
    description="Complication Protocol Agent",
    instruction="You are the Complication Protocol Agent for LUMEN. Respond to intraoperative complications — bleeding, nerve injury, air leak, conversion. You MUST call the `get_complication_protocol` tool to surface the management protocol on screen.",
    tools=[get_complication_protocol]
)
