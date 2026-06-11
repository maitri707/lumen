"""Transcription service utilizing Groq Whisper API for lightning-fast, highly accurate STT."""
from __future__ import annotations
import logging
import os
from typing import Optional
from groq import AsyncGroq
from ..config import settings

logger = logging.getLogger("lumen.transcription")

class TranscriptionService:
    def __init__(self):
        # We instantiate it with the API key from environment
        api_key = os.environ.get("GROQ_API_KEY", "")
        self.client = AsyncGroq(api_key=api_key) if api_key else None
        
        if not self.client:
            logger.warning("GROQ_API_KEY is not set. Transcription service will fail.")

    async def transcribe_audio(self, audio_data: bytes, filename: str = "audio.wav") -> str:
        """
        Transcribe raw audio bytes using Groq's Whisper Large V3.
        Includes a medical prompt to bias the model towards surgical terms,
        and enforces English language to prevent 'Welsh hallucination' bugs.
        """
        if not self.client:
            raise ValueError("Groq API key not configured")

        try:
            logger.info(f"Sending {len(audio_data)} bytes to Groq Whisper...")
            response = await self.client.audio.transcriptions.create(
                file=(filename, audio_data),
                model="whisper-large-v3",
                prompt="Surgical operation voice assistant. Medical terms, anatomy, patient data, EBL tracking, WHO timeout, procedure briefing.",
                language="en", # Force English to prevent hallucination bug
                temperature=0.0 # Low temperature for accurate transcription
            )
            transcript = response.text.strip()
            
            # Whisper Hallucination Filter: When fed pure static or silence, Whisper notoriously 
            # defaults to returning "Thank you." or "Thanks for watching."
            hallucination_phrases = ["thank you.", "thank you", "thanks.", "thanks", "thanks for watching.", "you."]
            if transcript.lower() in hallucination_phrases:
                logger.info("Filtered out known Whisper silence hallucination.")
                return ""
                
            logger.info(f"Transcription complete: '{transcript}'")
            return transcript
        except Exception as e:
            logger.error(f"Groq transcription failed: {e}")
            raise e

transcription_service = TranscriptionService()
