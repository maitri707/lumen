from google.adk import Agent
from ..tools import navigate_ct, jump_to_landmark, hide_ct, start_screen_share, stop_screen_share

screen_advisor_agent = Agent(
    name="screen_advisor",
    description="Visual Surgical Intelligence agent",
    instruction="You are the Visual Surgical Intelligence agent for LUMEN. You analyze live screenshots of the surgical video feed and answer questions EXCLUSIVELY about the surgical action happening, the instruments in use, and the specific anatomy visible. Do NOT talk about the UI or panels. You can also manipulate CT imaging.",
    tools=[navigate_ct, jump_to_landmark, hide_ct, start_screen_share, stop_screen_share]
)
