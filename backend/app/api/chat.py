from fastapi import APIRouter
from app.schemas.chat import ChatRequest
from app.services.llm_service import ask_ollama

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.post("/")
def chat(request: ChatRequest):

    answer = ask_ollama(request.message)

    return {
        "response": answer
    }