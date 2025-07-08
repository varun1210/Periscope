import os
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from ..config import settings


ALLOWED_FILE_TYPES = {
    "application/pdf": ".pdf",
    "application/msword": ".doc", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx"
}

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}


def validate_file_upload(file: UploadFile) -> bool:
    """Validate uploaded file type and size"""
    
    # Check file size
    if file.size and file.size > settings.max_file_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size too large. Maximum allowed: {settings.max_file_size / 1024 / 1024:.1f}MB"
        )
    
    # Check file type by content type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type not allowed. Allowed types: PDF, DOC, DOCX"
        )
    
    # Check file extension
    if file.filename:
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File extension not allowed. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
            )
    
    return True


def validate_password_strength(password: str) -> bool:
    """Validate password meets minimum requirements"""
    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Add more password requirements as needed
    if not any(c.isupper() for c in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one uppercase letter"
        )
    
    if not any(c.islower() for c in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one lowercase letter"
        )
    
    if not any(c.isdigit() for c in password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must contain at least one number"
        )
    
    return True


def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    # Remove potentially dangerous characters
    import re
    # Keep only alphanumeric, dots, hyphens, and underscores
    sanitized = re.sub(r'[^a-zA-Z0-9.\-_]', '_', filename)
    return sanitized[:100]  # Limit length