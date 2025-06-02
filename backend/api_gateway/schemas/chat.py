from pydantic import BaseModel
from typing import List, Dict

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    response: str
    conversation_history: List[Dict[str, str]] 