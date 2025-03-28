from django.shortcuts import render
from rest_framework import viewsets 
from rest_framework.request import HttpRequest
from .models import *
from .serializers import *
from rest_framework import views
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import action
class QuestionView(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
        

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

class AnswersView(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class SectionView(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer


class CategoryDetailAPIView(views.APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
