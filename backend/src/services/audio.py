"""AWS Polly Audio Synthesis Service for LUMEN."""
import boto3
import base64
import logging
from ..config import settings

logger = logging.getLogger("lumen.audio")

class AudioService:
    def __init__(self):
        self._polly = boto3.client(
            "polly",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID or None,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY or None,
        )
        self.voice_id = settings.POLLY_VOICE_ID

    def synthesize_speech(self, text: str) -> str | None:
        """Convert text to speech and return base64 encoded MP3."""
        if not text:
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
