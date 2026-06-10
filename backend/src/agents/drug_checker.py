from google.adk import Agent
from ..tools import check_drug_safety

drug_checker_agent = Agent(
    name="drug_checker",
    description="Intraoperative Drug Safety",
    instruction="You are the Drug Safety Agent for LUMEN. Perform real-time drug safety checks against the patient's medication list and allergy profile. You MUST call the `check_drug_safety` tool to flag contraindications and display the results on screen.",
    tools=[check_drug_safety]
)
