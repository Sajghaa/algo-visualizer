from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models import User
from app.schemas import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from app.security import (
    create_access_token,
    hash_password,
    verify_password,
)


router = APIRouter(prefix="/auth", tags=["auth"])


def _to_auth_response(user: User) -> AuthResponse:
    return AuthResponse(
        access_token=create_access_token(user.id),
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
        ),
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    session: Session = Depends(get_session),
):
    # Check email not taken
    existing = session.exec(
        select(User).where(User.email == payload.email)
    ).first()
    if existing is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return _to_auth_response(user)


@router.post("/login", response_model=AuthResponse)
def login(
    payload: LoginRequest,
    session: Session = Depends(get_session),
):
    user = session.exec(
        select(User).where(User.email == payload.email.strip().lower())
    ).first()

    # Same error for both cases — prevents user enumeration
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    return _to_auth_response(user)