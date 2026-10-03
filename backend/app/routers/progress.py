from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.database import get_session
from app.models import AlgorithmProgress
from app.schemas import ProgressResponse, QuizSubmission

router = APIRouter(prefix="/progress", tags=["progress"])

DEFAULT_USER = "default-user"


def _to_response(record: AlgorithmProgress) -> ProgressResponse:
    return ProgressResponse(
        slug=record.algorithm_slug,
        quiz_attempts=record.quiz_attempts,
        best_score=record.best_score,
        latest_score=record.latest_score,
        times_played=record.times_played,
        last_attempted=record.last_attempted,
    )


def _empty_response(slug: str) -> ProgressResponse:
    return ProgressResponse(
        slug=slug,
        quiz_attempts=0,
        best_score=0,
        latest_score=None,
        times_played=0,
        last_attempted=None,
    )

@router.get("", response_model=list[ProgressResponse])
def list_progress(session: Session = Depends(get_session)):
    statement = select(AlgorithmProgress).where(
        AlgorithmProgress.user_id == DEFAULT_USER
    )
    records = session.exec(statement).all()
    return [_to_response(r) for r in records]


@router.get("/{slug}", response_model=ProgressResponse)
def get_progress(slug: str, session: Session = Depends(get_session)):
    statement = select(AlgorithmProgress).where(
        AlgorithmProgress.user_id == DEFAULT_USER,
        AlgorithmProgress.algorithm_slug == slug,
    )
    record = session.exec(statement).first()

    if record is None:
        return _empty_response(slug)

    return _to_response(record)


@router.post("/{slug}/quiz", response_model=ProgressResponse)
def record_quiz(
    slug: str,
    submission: QuizSubmission,
    session: Session = Depends(get_session),
):
    percentage = round((submission.score / submission.total) * 100)

    # Find or create the row
    statement = select(AlgorithmProgress).where(
        AlgorithmProgress.user_id == DEFAULT_USER,
        AlgorithmProgress.algorithm_slug == slug,
    )
    record = session.exec(statement).first()

    if record is None:
        record = AlgorithmProgress(
            user_id=DEFAULT_USER,
            algorithm_slug=slug,
        )

    # Update fields
    record.quiz_attempts += 1
    record.best_score = max(record.best_score, percentage)
    record.latest_score = percentage
    record.last_attempted = datetime.now(timezone.utc)

    session.add(record)
    session.commit()
    session.refresh(record)

    return _to_response(record)