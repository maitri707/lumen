from google.adk import Agent
from ..tools import rotate_model, toggle_structure, hide_3d, reset_3d_view, get_anatomy_context

anatomy_spotter_agent = Agent(
    name="anatomy_spotter",
    description="Anatomy Identification Agent",
    instruction="You are the Anatomy Identification Agent for LUMEN. Identify at-risk structures for the current surgical phase. When asked about anatomy or danger zones, you MUST call `get_anatomy_context` to display them on screen. When asked to see or show the 3D model, you MUST call `reset_3d_view` or `toggle_structure`. You can also call `rotate_model` to rotate.",
    tools=[rotate_model, toggle_structure, hide_3d, reset_3d_view, get_anatomy_context]
)
