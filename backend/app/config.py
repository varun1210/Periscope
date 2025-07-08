import os
from typing import Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    upload_dir: str = "uploads/resumes"
    max_file_size: int = 2097152  # 2MB
    github_client_id: str 
    github_client_secret: str
    github_access_token_url: str

    supabase_url: str
    supabase_key: str
    supabase_bucket_name: str
    
    # Frontend URL for email links
    frontend_url: str = "http://localhost:5173"
    
    # # Email settings (we'll add these later when implementing email verification)
    # smtp_server: Optional[str] = None
    # smtp_port: Optional[int] = None
    # smtp_username: Optional[str] = None
    # smtp_password: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()