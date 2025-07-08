from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
import math

from ..database import get_db
from ..models import User, Job, UserJobApplication, UserJobSave
from ..schemas import JobResponse, JobSearchResponse
from ..services import get_current_user

router = APIRouter()


@router.post("/apply/{job_id}")
async def apply_to_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Apply to a job"""
    
    # Check if job exists and is active
    job = db.query(Job).filter(Job.job_id == job_id, Job.is_active == True).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if already applied
    existing_application = db.query(UserJobApplication).filter(
        UserJobApplication.user_id == current_user.id,
        UserJobApplication.job_id == job_id
    ).first()
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already applied to this job"
        )
    
    # Create application
    application = UserJobApplication(
        user_id=current_user.id,
        job_id=job_id
    )
    
    try:
        db.add(application)
        db.commit()
        return {"message": "Applied successfully", "job_id": job_id}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already applied to this job"
        )


@router.post("/save/{job_id}")
async def save_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save a job"""
    
    # Check if job exists and is active
    job = db.query(Job).filter(Job.job_id == job_id, Job.is_active == True).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check if already saved
    existing_save = db.query(UserJobSave).filter(
        UserJobSave.user_id == current_user.id,
        UserJobSave.job_id == job_id
    ).first()
    
    if existing_save:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )
    
    # Create save
    save = UserJobSave(
        user_id=current_user.id,
        job_id=job_id
    )
    
    try:
        db.add(save)
        db.commit()
        return {"message": "Job saved successfully", "job_id": job_id}
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )


@router.delete("/save/{job_id}")
async def unsave_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a job from saved jobs"""
    
    saved_job = db.query(UserJobSave).filter(
        UserJobSave.user_id == current_user.id,
        UserJobSave.job_id == job_id
    ).first()
    
    if not saved_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found in saved jobs"
        )
    
    db.delete(saved_job)
    db.commit()
    
    return {"message": "Job removed from saved jobs", "job_id": job_id}


@router.get("/applied", response_model=JobSearchResponse)
async def get_applied_jobs(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's applied jobs"""
    
    # Query applied jobs with job details
    query = db.query(Job).join(UserJobApplication).filter(
        UserJobApplication.user_id == current_user.id,
        Job.is_active == True
    )
    
    # Get total count
    total = query.count()
    
    # Apply pagination and ordering
    jobs = query.order_by(UserJobApplication.applied_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    total_pages = math.ceil(total / limit)
    
    return JobSearchResponse(
        jobs=jobs,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )


@router.get("/saved", response_model=JobSearchResponse)
async def get_saved_jobs(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's saved jobs"""
    
    # Query saved jobs with job details
    query = db.query(Job).join(UserJobSave).filter(
        UserJobSave.user_id == current_user.id,
        Job.is_active == True
    )
    
    # Get total count
    total = query.count()
    
    # Apply pagination and ordering
    jobs = query.order_by(UserJobSave.saved_at.desc()).offset((page - 1) * limit).limit(limit).all()
    
    total_pages = math.ceil(total / limit)
    
    return JobSearchResponse(
        jobs=jobs,
        total=total,
        page=page,
        limit=limit,
        total_pages=total_pages
    )