from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base


class UserJobApplication(Base):
    __tablename__ = "user_job_applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False)
    applied_at = Column(DateTime, server_default=func.now())
    status = Column(String(50), default="applied")

    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")

    # Unique constraint
    __table_args__ = (UniqueConstraint('user_id', 'job_id', name='unique_user_job_application'),)


class UserJobSave(Base):
    __tablename__ = "user_job_saves"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.job_id", ondelete="CASCADE"), nullable=False)
    saved_at = Column(DateTime, server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="saved_jobs")
    job = relationship("Job", back_populates="saves")

    # Unique constraint
    __table_args__ = (UniqueConstraint('user_id', 'job_id', name='unique_user_job_save'),)