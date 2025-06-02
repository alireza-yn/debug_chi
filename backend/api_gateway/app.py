from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api_gateway.routers import chat, django

app = FastAPI(
    title="API Gateway",
    description="A comprehensive API Gateway that integrates various services including AI features and Django backend",
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

# Include routers
app.include_router(chat.router)
app.include_router(django.router)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "api-gateway",
        "available_services": {
            "ai_services": ["deepseek-chat", "image-generation", "text-analysis"],
            "backend_services": ["django-backend"],
            "other_services": ["coming-soon"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    ) 