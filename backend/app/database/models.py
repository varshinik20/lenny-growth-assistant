import uuid

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class ChatSession(Base):
    __tablename__ = "sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False, default="New Chat")
    llm_provider = Column(String(50), nullable=False, default="ollama")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    messages = relationship(
        "Message",
        back_populates="session",
        cascade="all, delete"
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("sessions.id")
    )

    role = Column(String(20))
    content = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ChatSession", back_populates="messages")