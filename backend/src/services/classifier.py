"""Fast Intent Classifier for Orchestrator Routing."""
from __future__ import annotations
import logging
from typing import Optional, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

logger = logging.getLogger("lumen.classifier")

# Training data mapping intent to an array of phrases
TRAINING_DATA = {
    "patient_manager": [
        "load patient", "select patient", "start case for", "we are operating on",
        "switch patient", "set patient", "patients list", "patient list",
        "schedule", "who are the patients", "list of patients", "working on", "open patient",
        "who is the patient", "what patient are we doing", "pull up the patient",
        "let's work on", "give me the list of patients", "who is scheduled"
    ],
    "anatomy_spotter": [
        "3d model", "3d view", "rotate the model", "rotate model", "show me the lung",
        "danger zone", "at-risk", "at risk", "anatomy", "critical structure",
        "show the model", "left side", "right side", "posterior", "anterior",
        "lung", "lungs", "lobes", "chest", "show me the right", "show me the left",
        "hide the liver", "what is this structure", "highlight the cystic duct",
        "toggle visibility", "reset view", "rotate 90 degrees", "flip it",
        "zoom in", "zoom out", "zoom in 10", "zoom in 20", "zoom in 50",
        "zoom out 10", "zoom out 20", "zoom out 50", "make it bigger", "make it smaller",
        "enlarge the model", "zoom into the model", "zoom out of the model",
        "closer", "get closer", "move closer", "move back", "pull back",
        "show me the top", "show me the bottom", "upper side", "lower side",
        "camera view", "change the view", "view from the top", "view from the left",
        "pan", "move left", "move right", "move up", "move down",
        "move to the right", "move to the left", "shift right", "shift left",
        "pan down", "pan up", "pan left", "pan right", "move down 10", "move up 10"
    ],
    "complication": [
        "complication", "emergency", "we have a problem", "bleeding", "bile leak",
        "protocol", "pneumothorax", "conversion to open", "how to manage", "manage the",
        "we hit a vessel", "it's bleeding", "we have bleeding", "what is the protocol for"
    ],
    "ebl_tracker": [
        "blood loss", "ebl", "suctioned", "we lost", "blood volume", "transfusion",
        "how much blood", "update ebl", "log blood", "track blood", "estimated blood",
        "we took", "taken blood", "can you track", "suction canister", "add 100 ml"
    ],
    "drug_checker": [
        "safe to give", "allergy", "allergic", "interaction", "contraindicated", "drug",
        "medication", "can we administer", "give penicillin", "is he allergic to",
        "what meds is the patient on", "check drug", "pharmacy"
    ],
    "report": [
        "log that", "record that", "note that", "put in the report", "op report",
        "operative report", "show me the log", "event log", "take a picture",
        "take a photo", "capture this", "surgical event", "log the event"
    ],
    "timeout": [
        "time out", "timeout", "who checklist", "surgical safety checklist", "checklist",
        "run the checklist", "let's do a time out", "confirm identity", "verify patient",
        "start timeout", "confirm", "confirmed", "already confirmed", "check off",
        "mark as done", "patient name procedure confirmed", "team members introduced",
        "antibiotics given"
    ],
    "briefing": [
        "briefing", "give me the briefing", "pre-op", "patient history", "labs", "lab results",
        "what are the labs", "patient labs", "patient's latest lab results", "show patient record",
        "full patient record", "diagnosis", "what are we doing today", "procedure details",
        "history and physical", "vital signs", "patient vitals", "patient data", "clinical data",
        "patient details", "give me details on the patients", "details of the patient"
    ],
    "handoff": [
        "handoff", "hand-off", "sbar", "prepare a handoff", "summarize the case",
        "i need to step out", "generate sbar", "shift change", "nursing handoff"
    ],
    "screen_advisor": [
        "what's happening on screen", "look at the screen", "what do you see",
        "analyze the video", "what instrument is this", "what is happening",
        "tell me what's on the monitor", "visual assistant"
    ]
}

class FastIntentClassifier:
    """Lightweight TF-IDF classifier for ultra-fast zero-shot intent routing."""
    
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 3), analyzer='word', stop_words='english')
        
        # Flatten training data
        self.classes = []
        self.corpus = []
        for intent, phrases in TRAINING_DATA.items():
            for phrase in phrases:
                self.classes.append(intent)
                self.corpus.append(phrase)
                
        # Fit the model
        self.tfidf_matrix = self.vectorizer.fit_transform(self.corpus)
        logger.info(f"FastIntentClassifier trained on {len(self.corpus)} phrases.")

    def classify(self, text: str, threshold: float = 0.25) -> Tuple[Optional[str], float]:
        """Classify the text and return the intent and confidence score."""
        # Clean text
        text_vec = self.vectorizer.transform([text.lower().strip()])
        
        # Compute cosine similarities
        similarities = cosine_similarity(text_vec, self.tfidf_matrix)[0]
        
        # Find best match
        best_idx = np.argmax(similarities)
        best_score = similarities[best_idx]
        
        if best_score >= threshold:
            best_intent = self.classes[best_idx]
            logger.debug(f"Classified '{text}' -> {best_intent} (score: {best_score:.2f})")
            return best_intent, float(best_score)
            
        logger.debug(f"Classification failed for '{text}' (best score: {best_score:.2f})")
        return None, float(best_score)

# Singleton
intent_classifier = FastIntentClassifier()
