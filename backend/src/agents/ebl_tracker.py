from google.adk import Agent

ebl_tracker_agent = Agent(
    name="ebl_tracker",
    description="Blood Loss Tracker",
    instruction="You are the Blood Loss Tracker for LUMEN. Track cumulative estimated blood loss from voice updates. You MUST call `update_ebl` when blood loss is reported, or `get_ebl_summary` when asked for the total, to display the tracker on screen."
)
