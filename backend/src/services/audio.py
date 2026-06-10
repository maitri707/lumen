"""AWS Polly Audio Synthesis Service for LUMEN."""
import boto3
import base64
import logging
from ..config import settings

logger = logging.getLogger("lumen.audio")

class AudioService:
    def __init__(self):
        self.is_mock = (
            not settings.AWS_ACCESS_KEY_ID or 
            "your_access_key" in settings.AWS_ACCESS_KEY_ID or 
            "placeholder" in settings.AWS_ACCESS_KEY_ID
        )
        if not self.is_mock:
            try:
                self._polly = boto3.client(
                    "polly",
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
                )
            except Exception as e:
                logger.warning(f"Failed to create Polly client, falling back to mock mode: {e}")
                self.is_mock = True
        else:
            logger.info("Polly is running in MOCK mode (placeholder or missing credentials).")
        self.voice_id = settings.POLLY_VOICE_ID

    def synthesize_speech(self, text: str) -> str | None:
        """Convert text to speech and return base64 encoded MP3."""
        if not text:
            return None
            
        if self.is_mock:
            logger.info(f"[Mock Audio] Synthesizing speech: '{text}' (mock active, no sound generated)")
            return None
            
        try:
            response = self._polly.synthesize_speech(
                Text=text,
                OutputFormat="mp3",
                VoiceId=self.voice_id,
                Engine="neural"  # Use neural for more natural surgical voice
            )
            
            audio_stream = response.get("AudioStream")
            if audio_stream:
                audio_bytes = audio_stream.read()
                return base64.b64encode(audio_bytes).decode("utf-8")
        except Exception as e:
            logger.error(f"Polly synthesis failed: {e}")
            
        return None

audio_service = AudioService()
