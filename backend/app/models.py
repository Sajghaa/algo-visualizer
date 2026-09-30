from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


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