from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Lenny Growth Assistant"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str = ""

    LLM_PROVIDER: str = "ollama"

    OLLAMA_MODEL: str = "llama3.2"

    OLLAMA_BASE_URL: str = "http://localhost:11434"

    OPENAI_API_KEY: str = ""

    ANTHROPIC_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()