from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import GitHubCode, AccessTokenResponse
from ..services import AuthService
from ..utils import verify_token

router = APIRouter()


@router.post("/login", response_model=AccessTokenResponse)
async def login(github_code: GitHubCode, response: Response, db: Session = Depends(get_db)):
    """Complete GitHub OAuth flow - authenticate, create/update user, return our tokens"""
    auth_service = AuthService(db)
    
    # Handle complete GitHub OAuth flow
    user = await auth_service.github_oauth_login(github_code.code)
    
    # Generate our JWT tokens
    tokens = auth_service.create_tokens(user)
    
    # Set refresh token as HttpOnly cookie
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        domain=".localhost",
        max_age=7 * 24 * 60 * 60,  # 7 days in seconds
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    
    # Return only access token
    return AccessTokenResponse(
        access_token=tokens["access_token"],
        token_type="bearer"
    )


@router.post("/refresh-token")
async def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    """Refresh access token using refresh token from cookie"""
    
    # Get refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token found"
        )
    
    # Verify refresh token
    payload = verify_token(refresh_token, "refresh")
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Get user and create new tokens
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id), User.is_active == True).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    auth_service = AuthService(db)
    tokens = auth_service.create_tokens(user)
    
    # Set new refresh token as cookie
    response.set_cookie(
        key="refresh_token",
        value=tokens["refresh_token"],
        max_age=7 * 24 * 60 * 60,  # 7 days in seconds
        httponly=True,
        secure=False,  # Set to True in production with HTTPS
        samesite="lax"
    )
    
    # Return only access token
    return AccessTokenResponse(
        access_token=tokens["access_token"],
        token_type="bearer"
    )


@router.post("/logout")
async def logout(response: Response):
    """Logout user by clearing refresh token cookie"""
    
    # Clear the refresh token cookie
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=False,  # Set to True in production
        samesite="lax"
    )
    
    return {"message": "Logged out successfully"}