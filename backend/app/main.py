from fastapi import FastAPI

from app.config import settings
from app.database.database import Base, engine
from app.database import models

# Import API Routers
from app.api.sessions import router as session_router
from app.api.chat import router as chat_router



# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Lenny Growth Assistant API"
)

# Register Routers
app.include_router(session_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "status": "running",
        "version": settings.APP_VERSION
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }