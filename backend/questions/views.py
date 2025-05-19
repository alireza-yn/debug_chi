from django.shortcuts import render
from rest_framework import viewsets 
from rest_framework.request import HttpRequest
from .models import *
from .serializers import *
from rest_framework import views
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from drf_spectacular.utils import extend_schema



@extend_schema(tags=['interview'])
class QuestionView(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
        
@extend_schema(tags=['interview'])
class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=False, methods=['get'])
    def filter_by_name(self, request: Request):
        category_name = request.query_params.get('name')
        category = Category.objects.filter(name=category_name).first()
        
        if category:
            serializer = self.get_serializer(category)  # many=False به‌صورت پیش‌فرض
            return Response(serializer.data)
        return Response({"error": "Category not found"}, status=404)

@extend_schema(tags=['interview'])
class AnswersView(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

@extend_schema(tags=['interview'])
class SectionView(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

@extend_schema(tags=['interview'])
class CategoryDetailAPIView(views.APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


@extend_schema(tags=['AIQuestions'])
class AiCategorQuestionViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAdminUser]
    queryset = AiCategoryQuestion.objects.all()
    serializer_class = AiQuestionCategorySerializer

@extend_schema(tags=['AIQuestions'])
class AiQuestionViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAdminUser]
    queryset = AiQuestion.objects.all()
    serializer_class = AiQuestionSerializer

@extend_schema(tags=['AIQuestions'])
class AiQuestionAnswerViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAdminUser]
    queryset = AiQuestionAnswer.objects.all()
    serializer_class = AiQuestionAnswerSerilzers


@extend_schema(tags=['AIQuestions'])
class GetAiQuestions(ListAPIView):
    queryset = AiCategoryQuestion.objects.all()
    serializer_class = AiQuestionCategorySerializer