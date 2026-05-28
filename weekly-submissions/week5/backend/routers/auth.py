"""
routers/auth.py — Smart Wholesaler Authentication Endpoints
-------------------------------------------------------------
POST /auth/login  → Validate credentials, return JWT + user profile
GET  /auth/me     → Return the profile of the currently logged-in user
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
import models, schemas
from auth import (
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate a user with email + password.
    Returns a JWT access_token and the user's profile.

    Frontend expects:
      { access_token: string, token_type: "bearer", user: { id, email, role, name } }
    """
    # Look up user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Contact your distributor.",
        )

    # Create JWT — 'sub' claim holds the email (standard practice)
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.from_orm(user),
    )


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    """
    Return the profile of the currently authenticated user.
    Used by AuthContext.jsx on page refresh to re-hydrate the session.
    """
    return current_user
