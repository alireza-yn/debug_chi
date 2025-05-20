# gemini_api/urls.py

from django.urls import path
from .views import AskGemini

urlpatterns = [
    path('ask/', AskGemini.as_view(),name="ask_gemini"),
]
