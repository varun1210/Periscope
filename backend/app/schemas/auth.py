from pydantic import BaseModel
from typing import Optional


class GitHubCode(BaseModel):
    code: str


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str