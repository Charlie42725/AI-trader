from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    google_api_key: str = ""
    alpha_vantage_api_key: str = ""
    reddit_client_id: str = ""
    reddit_client_secret: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
