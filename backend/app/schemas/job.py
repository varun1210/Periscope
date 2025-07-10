from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from enum import Enum

class QueryType(Enum):
    title = "Title"
    location = "Location"
    industry = "Industry"

class QueryResponse(BaseModel):
    results: Optional[List[str]] = None

class JobBase(BaseModel):
    job_id: int
    company: str
    title: str
    location: str
    state: str
    job_description: Optional[str] = None
    median_pay: Optional[Decimal] = None
    min_pay: Optional[Decimal] = None
    max_pay: Optional[Decimal] = None
    industry: Optional[str] = None
    experience: Optional[str] = None
    link: Optional[str] = None

class JobSummary(BaseModel):
    job_id: int
    company: str
    title: str 
    location: Optional[str] = None 
    median_pay: Optional[Decimal] = None
    min_pay: Optional[Decimal] = None
    max_pay: Optional[Decimal] = None
    link: Optional[str] = None

class JobSummaryResponse(JobSummary):
    """Lightweight job info for search results"""
    # posted_date: datetime

    class Config:
        from_attributes = True

class JobSearchFilters(BaseModel):
    industry: Optional[List[str]] = None
    experience: Optional[List[str]] = None
    location: Optional[List[str]] = None
    resume: Optional[str] = None

class JobSearchRequest(BaseModel):
    query_string: Optional[str]
    filters: Optional[JobSearchFilters] = None
    page: int = 1
    limit: int = 20

# class JobSearchParams(BaseModel):
#     text: Optional[str] = None
#     industry: Optional[List[str]] = None
#     experience: Optional[List[str]] = None
#     location: Optional[List[str]] = None
#     resume: Optional[str] = None
#     page: int = 1
#     limit: int = 20


class JobResponse(JobBase):
    """Full job details for individual job view - clean interface"""
    posted_date: datetime

    class Config:
        from_attributes = True


class JobSearchResponse(BaseModel):
    jobs: list[JobSummaryResponse]  # Changed to summary instead of full details
    total: int
    page: int
    limit: int
    total_pages: int