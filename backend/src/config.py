"""LUMEN Backend Configuration."""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (one level up from backend/)
_env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(_env_path)


class Settings:
    """Application settings loaded from environment."""

    # AWS
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")

    # Bedrock
    BEDROCK_MODEL_ID: str = os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-sonnet-4-20250514")

    # Transcribe
    TRANSCRIBE_LANGUAGE_CODE: str = os.getenv("TRANSCRIBE_LANGUAGE_CODE", "en-US")
    TRANSCRIBE_SAMPLE_RATE: int = int(os.getenv("TRANSCRIBE_SAMPLE_RATE", "16000"))

    # Polly
    POLLY_VOICE_ID: str = os.getenv("POLLY_VOICE_ID", "Joanna")
    POLLY_SAMPLE_RATE: str = os.getenv("POLLY_SAMPLE_RATE", "24000")

    # Server
    HOST: str = os.getenv("BACKEND_HOST", "0.0.0.0")
    PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    CORS_ORIGINS: list[str] = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:3000").split(",")


settings = Settings()
