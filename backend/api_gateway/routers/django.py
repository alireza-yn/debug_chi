from fastapi import APIRouter

router = APIRouter(
    prefix="/api/django",
    tags=["Django Integration"]
)

@router.get("/health")
async def health_check():
    # TODO: Implement actual Django health check
    return {"status": "Django backend integration coming soon"} 