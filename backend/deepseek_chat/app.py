from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# Load environment variables
load_dotenv()

# Configure OpenAI client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"
)

app = FastAPI(
    title="DeepSeek Chat API",
    description="A FastAPI application that integrates with DeepSeek's chat model through OpenRouter",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    response: str
    conversation_history: List[Dict[str, str]]

@app.get("/")
async def root():
    return {"status": "healthy", "service": "deepseek-chat"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Prepare conversation history for DeepSeek
        messages = [
            {
                "role": "system", 
                "content": """شما یک دستیار هوشمند فارسی‌زبان هستید. لطفاً همیشه به فارسی پاسخ دهید.
                شما باید:
                1. همیشه به فارسی پاسخ دهید
                2. از زبان محترمانه و دوستانه استفاده کنید
                3. پاسخ‌های دقیق و مفید ارائه دهید
                4. اگر سوال به زبان دیگری پرسیده شد، به فارسی پاسخ دهید"""
            }
        ]
        
        # Add conversation history
        for msg in request.conversation_history:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        # Add current message
        messages.append({
            "role": "user",
            "content": request.message
        })

        # Call DeepSeek API through OpenRouter
        response = client.chat.completions.create(
            model="deepseek/deepseek-r1:free",
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
            extra_headers={
                "HTTP-Referer": "http://localhost:8000",
                "X-Title": "DEBUCHI Chat"
            }
        )

        # Get the response
        assistant_message = response.choices[0].message.content

        # Update conversation history
        updated_history = request.conversation_history + [
            {"role": "user", "content": request.message},
            {"role": "assistant", "content": assistant_message}
        ]

        return ChatResponse(
            response=assistant_message,
            conversation_history=updated_history
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing chat request: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8001)),
        reload=True
    ) 