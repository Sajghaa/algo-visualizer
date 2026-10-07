from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
import re
from pydantic import field_validator




class CamelModel(BaseModel):
    """Base model that emits camelCase JSON to match the frontend."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class QuizSubmission(BaseModel):
    """Body for POST /progress/{slug}/quiz."""
    score: int = Field(ge=0, description="Correct answers")
    total: int = Field(gt=0, description="Total questions")


class ProgressResponse(CamelModel):
    """Response shape for progress endpoints."""
    slug: str
    quiz_attempts: int
    best_score: int
    latest_score: Optional[int] = None
    times_played: int
    last_attempted: Optional[datetime] = None

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

class RegisterRequest(BaseModel):

    email: str
    password: str = Field(min_length=8, max_length=72)

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        v = v.strip().lower()
        if not EMAIL_RE.match(v):
            raise ValueError("invalid email format")
        return v

class LoginRequest(BaseModel):

    email: str
    password: str

class UserResponse(CamelModel):

    id: str
    email: str
    created_at: datetime

class AuthResponse(CamelModel):

    access_token: str
    token_type: str = "bearer"
    user: UserResponse