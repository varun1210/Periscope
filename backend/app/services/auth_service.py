from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import status, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx

from ..models import User
from ..utils import (
    create_access_token, 
    create_refresh_token, 
    verify_token,
    StandardHTTPException
)
from ..database import get_db
from ..config import settings

security = HTTPBearer()


class AuthService:
    
    def __init__(self, db: Session):
        self.db = db
    
    async def github_oauth_login(self, code: str) -> User:
        """Handle complete GitHub OAuth flow and return User object"""
        
        try:
            # Step 1: Exchange code for GitHub tokens
            github_tokens = await self._exchange_code_for_token(code)
            
            # Step 2: Get user data from GitHub
            github_user_data = await self._get_github_user_data(github_tokens["access_token"])
            
            # Step 3: Create or update user in our database
            user = await self._create_or_update_user(github_user_data, github_tokens)
            
            return user
            
        except StandardHTTPException:
            raise  # Re-raise StandardHTTPExceptions
        except HTTPException:
            raise  # Re-raise HTTPExceptions
        except Exception as e:
            print(f"Unexpected error in GitHub OAuth: {str(e)}")
            raise StandardHTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Internal server error during authentication",
                code="INTERNAL_SERVER_ERROR"
            )
    
    async def _exchange_code_for_token(self, code: str) -> dict:
        """Exchange authorization code for GitHub access token and refresh token"""
        
        request_params = {
            "client_id": settings.github_client_id,
            "client_secret": settings.github_client_secret,
            "code": code
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    settings.github_access_token_url,
                    data=request_params,
                    headers={"Accept": "application/json"}
                )
            
            # Handle GitHub API response with proper HTTP status codes
            if response.status_code == 400:
                raise StandardHTTPException(400, "Invalid authorization code. Please try signing in again.", "INVALID_AUTH_CODE")
            elif response.status_code == 401:
                raise StandardHTTPException(401, "GitHub authentication failed. Please try signing in again.", "GITHUB_AUTH_FAILED")
            elif response.status_code == 403:
                raise StandardHTTPException(403, "GitHub access denied. Please check your GitHub account permissions.", "GITHUB_ACCESS_DENIED")
            elif response.status_code == 422:
                raise StandardHTTPException(400, "Invalid authorization code. Please try signing in again.", "INVALID_AUTH_CODE")
            elif response.status_code == 429:
                raise StandardHTTPException(429, "GitHub rate limit exceeded. Please wait a moment and try again.", "GITHUB_RATE_LIMIT")
            elif response.status_code >= 500:
                raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_SERVER_ERROR")
            elif response.status_code != 200:
                raise StandardHTTPException(response.status_code, f"GitHub authentication failed (error {response.status_code}). Please try again.", "GITHUB_AUTH_FAILED")
            
            response_data = response.json()
            
            if "access_token" not in response_data:
                raise StandardHTTPException(401, "GitHub authentication failed. Please try signing in again.", "GITHUB_AUTH_FAILED")
            
            # Calculate expiration times
            now = datetime.now(timezone.utc)
            access_token_expires = now + timedelta(seconds=response_data.get("expires_in", 28800))  # Default 8 hours
            refresh_token_expires = now + timedelta(seconds=response_data.get("refresh_token_expires_in", 15811200))  # Default ~6 months
            
            return {
                "access_token": response_data["access_token"],
                "refresh_token": response_data["refresh_token"],
                "access_token_expires_at": access_token_expires,
                "refresh_token_expires_at": refresh_token_expires
            }
            
        except httpx.TimeoutException:
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_TIMEOUT")
        except httpx.RequestError:
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_REQUEST_ERROR")
        except StandardHTTPException:
            raise  # Re-raise our StandardHTTPExceptions
        except Exception as e:
            print(f"Unexpected error getting GitHub token: {str(e)}")
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_SERVER_ERROR")
    
    async def _get_github_user_data(self, access_token: str) -> dict:
        """Get user data from GitHub API"""
        
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get("https://api.github.com/user", headers=headers)
            
            # Handle GitHub API response with proper HTTP status codes
            if response.status_code == 401:
                raise StandardHTTPException(401, "GitHub authentication failed. Please try signing in again.", "GITHUB_AUTH_FAILED")
            elif response.status_code == 403:
                raise StandardHTTPException(403, "GitHub access denied. Please check your GitHub account permissions.", "GITHUB_ACCESS_DENIED")
            elif response.status_code == 429:
                raise StandardHTTPException(429, "GitHub rate limit exceeded. Please wait a moment and try again.", "GITHUB_RATE_LIMIT")
            elif response.status_code >= 500:
                raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_SERVER_ERROR")
            elif response.status_code != 200:
                raise StandardHTTPException(response.status_code, f"GitHub authentication failed (error {response.status_code}). Please try again.", "GITHUB_AUTH_FAILED")
            
            user_data = response.json()
            
            # Validate required fields
            if "id" not in user_data or "login" not in user_data:
                raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_INVALID_DATA")
            
            return user_data
            
        except httpx.TimeoutException:
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_TIMEOUT")
        except httpx.RequestError:
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_REQUEST_ERROR")
        except StandardHTTPException:
            raise  # Re-raise our StandardHTTPExceptions
        except Exception as e:
            print(f"Unexpected error getting GitHub user data: {str(e)}")
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_SERVER_ERROR")
    
    async def _create_or_update_user(self, github_data: dict, github_tokens: dict) -> User:
        """Create new user or update existing user from GitHub data"""
        
        github_id = str(github_data["id"])
        
        try:
            # Check if user already exists
            existing_user = self.db.query(User).filter(User.github_id == github_id).first()
            
            if existing_user:
                # Update existing user with latest GitHub data and tokens
                existing_user.github_username = github_data["login"]
                existing_user.github_access_token = github_tokens["access_token"]
                existing_user.github_refresh_token = github_tokens["refresh_token"]
                existing_user.github_token_expires_at = github_tokens["access_token_expires_at"]
                existing_user.github_refresh_token_expires_at = github_tokens["refresh_token_expires_at"]
                existing_user.name = github_data.get("name")
                existing_user.email = github_data.get("email")
                existing_user.avatar_url = github_data.get("avatar_url")
                existing_user.bio = github_data.get("bio")
                existing_user.location = github_data.get("location")
                existing_user.hireable = github_data.get("hireable")
                
                self.db.commit()
                self.db.refresh(existing_user)
                return existing_user
            else:
                # Create new user
                new_user = User(
                    github_id=github_id,
                    github_username=github_data["login"],
                    github_access_token=github_tokens["access_token"],
                    github_refresh_token=github_tokens["refresh_token"],
                    github_token_expires_at=github_tokens["access_token_expires_at"],
                    github_refresh_token_expires_at=github_tokens["refresh_token_expires_at"],
                    name=github_data.get("name"),
                    email=github_data.get("email"),
                    avatar_url=github_data.get("avatar_url"),
                    bio=github_data.get("bio"),
                    location=github_data.get("location"),
                    hireable=github_data.get("hireable"),
                    resume_paths=['', '']
                )
                
                self.db.add(new_user)
                self.db.commit()
                self.db.refresh(new_user)
                return new_user
                
        except Exception as e:
            self.db.rollback()
            print(f"Database error creating/updating user: {str(e)}")
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "DATABASE_ERROR")
    
    async def refresh_github_token(self, user: User) -> User:
        """Refresh GitHub access token using refresh token"""
        
        # Check if GitHub access token is expired or about to expire (within 5 minutes)
        now = datetime.now(timezone.utc)
        if user.github_token_expires_at > now + timedelta(minutes=5):
            # Token is still valid, no need to refresh
            return user
        
        # Check if refresh token is still valid
        if user.github_refresh_token_expires_at <= now:
            raise StandardHTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="GitHub refresh token expired. Please log in again.",
                code="GITHUB_REFRESH_EXPIRED"
            )
        
        request_params = {
            "client_id": settings.github_client_id,
            "client_secret": settings.github_client_secret,
            "grant_type": "refresh_token",
            "refresh_token": user.github_refresh_token
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    settings.github_access_token_url,
                    data=request_params,
                    headers={"Accept": "application/json"}
                )
            
            if response.status_code != 200:
                raise StandardHTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message="Failed to refresh GitHub token. Please log in again.",
                    code="GITHUB_REFRESH_FAILED"
                )
            
            response_data = response.json()
            
            if "access_token" not in response_data:
                raise StandardHTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message="Failed to refresh GitHub token. Please log in again.",
                    code="GITHUB_REFRESH_FAILED"
                )
            
            # Update user with new tokens
            user.github_access_token = response_data["access_token"]
            user.github_token_expires_at = now + timedelta(seconds=response_data.get("expires_in", 28800))
            
            # GitHub might provide new refresh token
            if "refresh_token" in response_data:
                user.github_refresh_token = response_data["refresh_token"]
                user.github_refresh_token_expires_at = now + timedelta(seconds=response_data.get("refresh_token_expires_in", 15811200))
            
            self.db.commit()
            self.db.refresh(user)
            
            return user
            
        except httpx.TimeoutException:
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_TIMEOUT")
        except httpx.RequestError:
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_REQUEST_ERROR")
        except StandardHTTPException:
            raise
        except Exception as e:
            print(f"Unexpected error refreshing GitHub token: {str(e)}")
            raise StandardHTTPException(500, "GitHub server error. Please try again in a few minutes.", "GITHUB_SERVER_ERROR")

    async def get_valid_github_token(self, user: User) -> str:
        """Get valid GitHub access token, refreshing if necessary"""
        
        # Check if token needs refresh
        now = datetime.now(timezone.utc)
        if user.github_token_expires_at <= now + timedelta(minutes=5):
            user = await self.refresh_github_token(user)
        
        return user.github_access_token
    
    def create_tokens(self, user: User) -> dict:
        """Create access and refresh tokens for user"""
        token_data = {"sub": str(user.id), "github_id": user.github_id}
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token"""
    
    token = credentials.credentials
    payload = verify_token(token, "access")
    
    if payload is None:
        raise StandardHTTPException(status.HTTP_401_UNAUTHORIZED, "Could not validate credentials", "UNAUTHORIZED")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise StandardHTTPException(status.HTTP_401_UNAUTHORIZED, "Could not validate credentials", "UNAUTHORIZED")
    
    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    if user is None:
        raise StandardHTTPException(status.HTTP_401_UNAUTHORIZED, "Could not validate credentials", "UNAUTHORIZED")
    
    return user