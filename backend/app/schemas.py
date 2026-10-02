from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel


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