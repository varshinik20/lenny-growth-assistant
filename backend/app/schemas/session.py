from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class SessionCreate(BaseModel):
    title: str = "New Chat"


class SessionResponse(BaseModel):
    id: UUID
    title: str
    llm_provider: str
    created_at: datetime

    class Config:
        from_attributes = True