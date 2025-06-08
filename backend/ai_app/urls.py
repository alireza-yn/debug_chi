# gemini_api/urls.py

from django.urls import path
from .views import DeepSeekChatView

urlpatterns = [
    path('chat/deepseek/', DeepSeekChatView.as_view(), name='deepseek-chat'),
]
