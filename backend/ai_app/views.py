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
from rest_framework.response import Response
import requests
import os
from dotenv import load_dotenv

# تنظیم کلید API
genai.configure(api_key=settings.GOOGLE_API_KEY)

# مدل را مقداردهی می‌کنیم (می‌توانی مدل‌های دیگر را هم امتحان کنی)
model = genai.GenerativeModel("gemma-3-27b-it")

load_dotenv()

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
            # Get the message and conversation history from the request
            message = request.data.get('message')
            conversation_history = request.data.get('conversation_history', [])

            if not message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Prepare the request to FastAPI service
            fastapi_url = 'http://localhost:8001/api/chat'
            payload = {
                'message': message,
                'conversation_history': conversation_history
            }

            # Make request to FastAPI service
            response = requests.post(fastapi_url, json=payload)
            response.raise_for_status()  # Raise an exception for bad status codes

            return Response(response.json())

        except requests.exceptions.RequestException as e:
            return Response(
                {'error': f'Error communicating with AI service: {str(e)}'}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
