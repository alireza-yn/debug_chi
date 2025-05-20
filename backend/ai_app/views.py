# gemini_api/views.py

import google.generativeai as genai
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request

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
