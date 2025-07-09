from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, exists, func
from typing import Optional, List
import math

from ..database import get_db
from ..models import User, Job, UserJobApplication
from ..schemas import JobResponse, JobSearchRequest, JobSearchResponse, QueryResponse, QueryType
from ..services import get_current_user
from ..utils import StandardHTTPException

router = APIRouter()


@router.get("/query", response_model=QueryResponse)
async def query_database(
    type: QueryType = Query(..., description="Type of query to perform"),
    query_string: str = Query(..., description="The query string to search for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Return search bar and dynamic filter options"""
    try:
        match type:
            case QueryType.title:
                results = db.query(Job.title).filter(
                    or_(
                        Job.title.ilike(f"%{query_string}%"),
                        Job.job_description.ilike(f"%{query_string}%")
                    )
                ).limit(5)
            case QueryType.location:
                results = db.query(Job.location).filter(
                    Job.location.ilike(f"%{query_string}%")
                ).limit(5)
            case QueryType.industry:
                results = db.query(Job.industry).filter(
                    Job.industry.ilike(f"%{query_string}%")
                ).limit(5)
            case _:
                raise StandardHTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Invalid query type",
                    code="BAD_REQUEST"
                )

        return QueryResponse(results=[result[0] for result in results.distinct().all()])
    
    except ValueError as ve:
        raise StandardHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(ve),
            code="BAD_REQUEST"
        )
    except Exception as e:
        raise StandardHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
            code="SERVER_ERROR"
        )
    

@router.post("/search", response_model=JobSearchResponse)
async def search_jobs(
    searchRequest: JobSearchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Search and filter jobs with pagination, excluding applied jobs"""
    try:
        query_string = searchRequest.query_string
        filters = searchRequest.filters
        page = searchRequest.page
        limit = searchRequest.limit

        if not query_string and not filters:
            raise StandardHTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="At least one search parameter is required",
                code="BAD_REQUEST"
            )

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
        if query_string:
            # Full-text search on title, company, and description
            search_filter = or_(
                Job.title.ilike(f"%{query_string}%"),
                Job.company.ilike(f"%{query_string}%"),
                Job.job_description.ilike(f"%{query_string}%")
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
        jobs = query.order_by(Job.posted_date.desc()).offset((page - 1) * limit).limit(limit).all()
        # Calculate pagination info
        total_pages = math.ceil(total / limit)

        return JobSearchResponse(
            jobs=jobs,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages
        )
    
    except ValueError as ve:
        raise StandardHTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(ve),
            code="BAD_REQUEST"
        )
    
    except Exception as e:
        raise StandardHTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error",
            code="SERVER_ERROR"
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


# @router.get("/filters/options")
# async def get_filter_options(
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     """Get available filter options for dropdowns"""
    
#     # Get distinct values for filter dropdowns
#     industries = db.query(Job.industry).filter(
#         Job.industry.isnot(None),
#         Job.is_active == True
#     ).distinct().order_by(Job.industry).all()
    
#     experiences = db.query(Job.experience).filter(
#         Job.experience.isnot(None),
#         Job.is_active == True
#     ).distinct().order_by(Job.experience).all()
    
#     states = db.query(Job.state).filter(
#         Job.state.isnot(None),
#         Job.is_active == True
#     ).distinct().order_by(Job.state).all()
    
#     return {
#         "industries": [industry[0] for industry in industries],
#         "experiences": [experience[0] for experience in experiences],
#         "states": [state[0] for state in states]
#     }