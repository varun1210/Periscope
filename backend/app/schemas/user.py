from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    github_username: str
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    hireable: Optional[bool] = None
    phone: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    # Note: file upload will be handled separately in the API endpoint


class UserResponse(UserBase):
    id: int
    github_id: str
    resume_paths: List[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserProfileResponse(BaseModel):
    """Clean user response for frontend - no database internals"""
    id: int
    github_username: str
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_paths: List[str]

    class Config:
        from_attributes = True


class GitHubUserCreate(BaseModel):
    """Schema for creating user from GitHub data"""
    github_id: str
    github_username: str
    github_access_token: str
    name: Optional[str] = None
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    hireable: Optional[bool] = None