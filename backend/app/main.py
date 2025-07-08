from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
# import os

from .api import auth, users, jobs, interactions
# from .config import settings
from .supabase import init_supabase_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_supabase_connection()
    yield

# Create FastAPI app
app = FastAPI(
    title="Job Application API",
    description="FastAPI backend for job application system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Print request details
    print(f"Method: {request.method}")
    print(f"URL: {request.url}")
    print(f"Headers: {dict(request.headers)}")
    # Continue processing the request
    response = await call_next(request)
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail if isinstance(exc.detail, str) else exc.detail.get("error", "Unknown error"),
            "code": exc.detail.get("code", "UNKNOWN_ERROR") if isinstance(exc.detail, dict) else "UNKNOWN_ERROR"
        }
    )

# # Create upload directory if it doesn't exist
# os.makedirs(settings.upload_dir, exist_ok=True)

# # Mount static files for resume downloads
# app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include API routes
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(interactions.router, prefix="/interactions", tags=["Interactions"])

@app.get("/")
async def root():
    return {"message": "Job Application API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}