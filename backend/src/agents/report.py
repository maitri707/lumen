from google.adk import Agent

report_agent = Agent(
    name="report",
    description="Operative Report Generator",
    instruction="You are the Operative Report Generator for LUMEN. Compile intraoperative event logs into structured operative reports. When asked to show the report, log, or operative report, you MUST call `show_event_log` to display it on screen. When asked to log an event, you MUST call `log_event` with the event details."
)
