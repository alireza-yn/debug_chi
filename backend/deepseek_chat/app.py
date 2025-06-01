from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="DeepSeek Chat API",
    description="A FastAPI application that integrates with DeepSeek's chat model",
    version="1.0.0"
)

# Configure CORS - Allow Django application
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",  # Django's URL
        "http://127.0.0.1:8000",  # Alternative Django URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_history: list = []

class ChatResponse(BaseModel):
    response: str

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        messages = request.conversation_history + [{"role": "user", "content": request.message}]
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                DEEPSEEK_API_URL,
                headers={
                    "Authorization": f"Bearer {os.getenv('DEEPSEEK_API_KEY')}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "deepseek-chat",
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 1000
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Error from DeepSeek API")
            
            result = response.json()
            return ChatResponse(response=result["choices"][0]["message"]["content"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "message": "DeepSeek Chat API is running",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8001)),
        reload=True
    ) 