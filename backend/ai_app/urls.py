# gemini_api/urls.py

from django.urls import path
from .views import AskGemini, DeepSeekChatView

urlpatterns = [
    path('ask/', AskGemini.as_view(),name="ask_gemini"),
    path('api/deepseek-chat/', DeepSeekChatView.as_view(), name='deepseek-chat'),
]
