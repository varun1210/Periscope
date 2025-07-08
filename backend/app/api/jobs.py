from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, exists, func
from typing import Optional, List
import math

from ..database import get_db
from ..models import User, Job, UserJobApplication
from ..schemas import JobResponse, JobSearchParams, JobSearchResponse
from ..services import get_current_user

router = APIRouter()


@router.post("/search", response_model=JobSearchResponse)
async def search_jobs(
    filters: JobSearchParams,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search and filter jobs with pagination, excluding applied jobs"""
    
    # Base query - exclude applied jobs and inactive jobs
    query = db.query(Job).filter(
        Job.is_active == True,
        ~exists().where(
            and_(
                UserJobApplication.user_id == current_user.id,
                UserJobApplication.job_id == Job.job_id
            )
        )
    )
    
    # Apply filters
    if filters.text:
        # Full-text search on title, company, and description
        search_filter = or_(
            Job.title.ilike(f"%{filters.text}%"),
            Job.company.ilike(f"%{filters.text}%"),
            Job.job_description.ilike(f"%{filters.text}%")
        )
        query = query.filter(search_filter)
    
    if filters.industry:
        # Filter by multiple industries
        query = query.filter(Job.industry.in_(filters.industry))
    
    if filters.experience:
        # Filter by multiple experience levels
        query = query.filter(Job.experience.in_(filters.experience))
    
    if filters.location:
        # Search in both location and state fields for multiple values
        location_filters = []
        for loc in filters.location:
            location_filters.append(
                or_(
                    Job.location.ilike(f"%{loc}%"),
                    Job.state.ilike(f"%{loc}%")
                )
            )
        query = query.filter(or_(*location_filters))
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination and ordering
    jobs = query.order_by(Job.posted_date.desc()).offset((filters.page - 1) * filters.limit).limit(filters.limit).all()
    
    # Calculate pagination info
    total_pages = math.ceil(total / filters.limit)
    
    return JobSearchResponse(
        jobs=jobs,
        total=total,
        page=filters.page,
        limit=filters.limit,
        total_pages=total_pages
    )


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get specific job details"""
    
    job = db.query(Job).filter(Job.job_id == job_id, Job.is_active == True).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job


@router.get("/filters/options")
async def get_filter_options(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get available filter options for dropdowns"""
    
    # Get distinct values for filter dropdowns
    industries = db.query(Job.industry).filter(
        Job.industry.isnot(None),
        Job.is_active == True
    ).distinct().order_by(Job.industry).all()
    
    experiences = db.query(Job.experience).filter(
        Job.experience.isnot(None),
        Job.is_active == True
    ).distinct().order_by(Job.experience).all()
    
    states = db.query(Job.state).filter(
        Job.state.isnot(None),
        Job.is_active == True
    ).distinct().order_by(Job.state).all()
    
    return {
        "industries": [industry[0] for industry in industries],
        "experiences": [experience[0] for experience in experiences],
        "states": [state[0] for state in states]
    }