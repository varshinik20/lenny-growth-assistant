from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import ChatSession
from app.schemas.session import SessionCreate

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/")
def create_session(
    request: SessionCreate,
    db: Session = Depends(get_db)
):
    session = ChatSession(
        title=request.title
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/")
def get_sessions(
    db: Session = Depends(get_db)
):
    return db.query(ChatSession).all()