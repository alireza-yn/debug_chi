from fastapi import APIRouter, HTTPException
from api_gateway.schemas.chat import ChatRequest, ChatResponse
from api_gateway.services.chat_service import ChatService

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)

chat_service = ChatService()

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response, updated_history = await chat_service.process_chat(
            request.message,
            request.conversation_history
        )
        return ChatResponse(
            response=response,
            conversation_history=updated_history
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) 