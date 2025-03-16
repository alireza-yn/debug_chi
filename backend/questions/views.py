from django.shortcuts import render
from rest_framework import viewsets 
from rest_framework.request import HttpRequest
from .models import *
from .serializers import *

class QuestionView(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
        

class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CateogrySerializer