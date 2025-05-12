from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'category',viewset=AiCategorQuestionViewSet,basename='ai_category_questions')
router.register(r'questions',viewset=AiQuestionViewSet,basename='ai_questions')
router.register(r'answers',viewset=AiQuestionAnswerViewSet,basename='ai_answers')

urlpatterns = [
    path('',include(router.urls)),
    path('list/',view=GetAiQuestions.as_view(),name='AI_questions')
]
