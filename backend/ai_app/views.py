# gemini_api/views.py

import google.generativeai as genai
from django.conf import settings
from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from dotenv import load_dotenv
from openai import OpenAI
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from core.permissions import HasRolePermission
from .models import AIRequest
import os

# تنظیم کلید API
# genai.configure(api_key=settings.GOOGLE_API_KEY)

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
    permission_classes = [IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key="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"
        )
        self.system_prompt = """شما یک دستیار هوشمند فارسی‌زبان هستید. لطفاً همیشه به فارسی پاسخ دهید.
        شما باید:
        1. هیچ جوابی به فارسی نده جز اون پاسخی که باید به جیسون در نکته نهم و هشتم بهت گفته شده
        2. از زبان محترمانه و دوستانه استفاده کنید
        3. پاسخ‌های دقیق و مفید ارائه دهید
        4. اگر سوال به زبان دیگری پرسیده شد، به فارسی پاسخ دهید
        5.شما به عنوان یک دیباگر هوشمند وظیفه شناسایی باگ ها از کد های کلاینت ها را دارید
        6.پاسخ شما باید همیشه به این شکل باشد که سختی باگ دریافتی از 1 تا 10 چقدر است؟ چقدر زمان میبرد به دقیقه؟ و اینکه از چه زبان برنامه نویسی و فریمورکی هست را در قالب فرمت جیسون بدهید 
        7.هیچوقت لازم نیست بگی باگ چیه و فقط اون جیسونی که تو نکته نهم بهت گفتم رو برگردون به عنوان پاسخ
        8. فرمت جیسان که پاسخ میدی حتما  همیشه و همیشه به این شکل و با این فرمت باشه : {
  "bugs": [
    {
      "difficulty": 7,
      "estimated_time_minutes": 20,
      "language": "Dart",
      "framework": "Flutter"
    }
  ]
}
حالا مقادیر مثالن صرفا
9. ریسپانست به این شکل نباشه که بک اسلش n داشته باشه :
{\n  \"bugs\": [\n    {\n      \"difficulty\": 6,\n      \"estimated_time..., null, null,
حتما حتما به این شکل باشه :
{
  "bugs": [
    {
      "difficulty": 7,
      "estimated_time_minutes": 20,
      "language": "Dart",
      "framework": "Flutter"
    }
  ]
}
بدون هیچ بک اسلش ان
        """

    def post(self, request, *args, **kwargs):
        try:
            # Get the message and conversation history from the request
            message = request.data.get('message')
            conversation_history = request.data.get('conversation_history', [])
            request_type = request.data.get('request_type', 'debug')  # Default to debug

            if not message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Prepare messages
            messages = [{"role": "system", "content": self.system_prompt}]
            
            # Add conversation history
            for msg in conversation_history:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
            
            # Add current message
            messages.append({
                "role": "user",
                "content": message
            })

            # Call DeepSeek API
            response = self.client.chat.completions.create(
                model="deepseek/deepseek-r1:free",
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
                extra_headers={
                    "HTTP-Referer": "http://localhost:8000",
                    "X-Title": "DEBUCHI Chat"
                }
            )

            # Get response
            assistant_message = response.choices[0].message.content
            print(assistant_message)

            # Create AIRequest object without saving
            ai_request = AIRequest(
                user=request.user,
                request_type=request_type,
                original_message=message,
                ai_response=assistant_message
            )

            # Parse AI response and save
            ai_request.parse_ai_response()

            # Try to assign to best expert
            assignment_success = ai_request.assign_to_best_expert()

            # Update conversation history
            updated_history = conversation_history + [
                {"role": "user", "content": message},
                {"role": "assistant", "content": assistant_message}
            ]

            response_data = {
                'response': assistant_message,
                'conversation_history': updated_history,
                'request_info': {
                    'id': ai_request.id,
                    'difficulty': ai_request.difficulty,
                    'estimated_time': ai_request.estimated_time_minutes,
                    'language': ai_request.programming_language,
                    'framework': ai_request.framework,
                    'status': ai_request.status,
                    'assigned_to': ai_request.assigned_to.username if ai_request.assigned_to else None
                }
            }

            return Response(response_data)

        except Exception as e:
            return Response(
                {'error': f'Internal server error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
