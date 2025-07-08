from sqlalchemy import Column, Integer, String, Boolean, DateTime, ARRAY, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    # GitHub authentication fields
    github_id = Column(String(50), unique=True, nullable=False, index=True)
    github_username = Column(String(100), nullable=False)
    github_access_token = Column(String(255), nullable=False)
    github_refresh_token = Column(String(255), nullable=False)
    github_token_expires_at = Column(DateTime, nullable=False)
    github_refresh_token_expires_at = Column(DateTime, nullable=False)
    
    # User profile fields (from GitHub)
    name = Column(String(200), nullable=True)  # Full name from GitHub
    email = Column(String(255), nullable=True, index=True)  # Can be private
    avatar_url = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String(200), nullable=True)
    hireable = Column(Boolean, nullable=True)
    
    # Application-specific fields
    phone = Column(String(20), nullable=True)
    resume_paths = Column(ARRAY(Text), default=[])
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    applications = relationship("UserJobApplication", back_populates="user")
    saved_jobs = relationship("UserJobSave", back_populates="user")