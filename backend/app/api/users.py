from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List

from ..database import get_db
from ..supabase import SupabaseConnection, get_supabase_connection
from ..models import User
from ..schemas import UserUpdate, UserProfileResponse
from ..services import get_current_user, FileService
from ..utils import StandardHTTPException

router = APIRouter()


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return UserProfileResponse(
        id=current_user.id,
        github_username=current_user.github_username,
        name=current_user.name,
        email=current_user.email,
        phone=current_user.phone,
        resume_paths=current_user.resume_paths
    )


@router.put("/me", response_model=UserProfileResponse)
async def update_user_profile(
    name: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    resume_paths: Optional[List[str]] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    supabase_connection: SupabaseConnection = Depends(get_supabase_connection)
):
    # Initialize FileService once at the beginning - this solves the scope issue!
    file_service = FileService(db, supabase_connection)
    uploaded_file_path = None

    print(name)
    print(phone)
    print(bio)
    print(location)
    print(resume_paths)
    print(file)
    
    try:
        if name is not None and name.strip() != "":
            current_user.name = name
        if phone is not None and phone.strip() != "":
            current_user.phone = phone
        if bio is not None and bio.strip() != "":
            current_user.bio = bio
        if location is not None and location.strip() != "":
            current_user.location = location
        if resume_paths is not None and (resume_paths[0] != "" or resume_paths[1] != ""):
            current_user.resume_paths = resume_paths
        
        if file:
            uploaded_file_path = await file_service.save_resume(current_user, file)
        
        db.commit()
        db.refresh(current_user)
        
        return current_user
        
    except StandardHTTPException:
        db.rollback()
        if uploaded_file_path:
            await file_service.cleanup_uploaded_file(uploaded_file_path)
        raise
        
    except Exception as e:
        db.rollback()
        if uploaded_file_path:
            await file_service.cleanup_uploaded_file(uploaded_file_path)
        raise StandardHTTPException(
            status_code=500,
            message="Failed to update user profile",
            code="UPDATE_ERROR"
        )


@router.delete("/me")
async def delete_user_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    supabase_connection: SupabaseConnection = Depends(get_supabase_connection)
):
    """Soft delete user account"""
    
    try:
        file_service = FileService(db, supabase_connection)
        
        # Clean up user files first
        files_deleted = await file_service.delete_user_files(current_user)
        
        # Soft delete user
        current_user.is_active = False
        db.commit()
        
        message = "Account deleted successfully"
        if not files_deleted:
            message += " (some files may not have been deleted)"
        
        return {"message": message}
        
    except Exception as e:
        db.rollback()
        raise StandardHTTPException(
            status_code=500,
            message="Failed to delete account",
            code="DELETE_ERROR"
        )


@router.delete("/me/resume/{file_index}")
async def delete_resume(
    file_index: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    supabase_connection: SupabaseConnection = Depends(get_supabase_connection)
):
    """Delete a specific resume file by index"""
    
    if not current_user.resume_paths or file_index >= len(current_user.resume_paths):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume file not found"
        )
    
    file_path = current_user.resume_paths[file_index]
    
    if not file_path or file_path.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No resume file at this index"
        )
    
    try:
        file_service = FileService(db, supabase_connection)
        
        # Delete from Supabase
        file_deleted = await file_service.delete_file(file_path)
        
        if file_deleted:
            current_user.resume_paths[file_index] = "" 
            db.commit()
            db.refresh(current_user)
            
            return {"message": "Resume deleted successfully"}
        else:
            raise StandardHTTPException(
                status_code=500,
                message="Failed to delete resume file",
                code="DELETE_ERROR"
            )
            
    except StandardHTTPException:
        raise
        
    except Exception as e:
        db.rollback()
        raise StandardHTTPException(
            status_code=500,
            message="Failed to delete resume",
            code="DELETE_ERROR"
        )