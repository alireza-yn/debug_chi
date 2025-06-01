# gemini_api/views.py

import google.generativeai as genai
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
import httpx
from django.core.cache import cache
import asyncio

# تنظیم کلید API
genai.configure(api_key=settings.GOOGLE_API_KEY)

# مدل را مقداردهی می‌کنیم (می‌توانی مدل‌های دیگر را هم امتحان کنی)
model = genai.GenerativeModel("gemma-3-27b-it")


class AskGemini(APIView):
    def post(self,request: Request):
        
        prompt = request.data.get("prompt")

        if not prompt:
            return JsonResponse({"error": "Prompt is required."}, status=400)

        try:
            response = model.generate_content(prompt)
            raw_text = response.text

            return JsonResponse(
                {
                    "prompt": prompt,
                    "gemini_response": raw_text,
                    "structured": {
                        "summary": raw_text[:100],
                        "length": len(raw_text),
                    },
                }
            )

        except Exception as e:
            print(e)
            return JsonResponse({"error": str(e)}, status=status.HTTP_200_OK)

class DeepSeekChatView(APIView):
    def post(self, request):
        try:
            # Get message and conversation history from request
            message = request.data.get('message')
            conversation_history = request.data.get('conversation_history', [])
            
            # Create event loop for async operation
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            # Make request to FastAPI service
            async def make_request():
                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        'http://localhost:8001/api/chat',
                        json={
                            'message': message,
                            'conversation_history': conversation_history
                        }
                    )
                    return response
            
            # Run the async request
            response = loop.run_until_complete(make_request())
            loop.close()
            
            if response.status_code == 200:
                return Response(response.json())
            else:
                return Response(
                    {'error': 'Error from DeepSeek API'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                    
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
