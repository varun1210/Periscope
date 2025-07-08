from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, DECIMAL
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class Job(Base):
    __tablename__ = "jobs"

    job_id = Column(Integer, primary_key=True, index=True)
    company = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    job_description = Column(Text, nullable=True)
    median_pay = Column(DECIMAL(10, 2), nullable=True)
    min_pay = Column(DECIMAL(10, 2), nullable=True)
    max_pay = Column(DECIMAL(10, 2), nullable=True)
    industry = Column(String(100), nullable=True)
    experience = Column(String(50), nullable=True)
    link = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    posted_date = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    applications = relationship("UserJobApplication", back_populates="job")
    saves = relationship("UserJobSave", back_populates="job")