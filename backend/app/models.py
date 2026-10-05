import uuid
from datetime import datetime, timezone
from typing import Optional
from sqlmodel import SQLModel, Field

def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[str] = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
    )
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime =Field(default_factory=_utc_now)




class AlgorithmProgress(SQLModel, table=True):
    __tablename__ = "algorithm_progress"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)               
    algorithm_slug: str = Field(index=True)
    quiz_attempts: int = Field(default=0)
    best_score: int = Field(default=0)
    latest_score: Optional[int] = Field(default=None)
    times_played: int = Field(default=0)
    last_attempted: Optional[datetime] = Field(default=None)