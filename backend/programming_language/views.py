from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from .serializers import *


class ProgrammingLanguageViewSet(ModelViewSet):
    queryset = ProgrammingLanguage.objects.all()    
    serializer_class = ProgrammingLanguageSerializer



class ProgrammerSkillViewSet(ModelViewSet):
    queryset = ProgrammerSkill.objects.all()    
    serializer_class = ProgrammerSkillSerializer


class ProgrammerExpertiseViewSet(ModelViewSet):
    queryset = ProgrammerExpertise.objects.all()    
    serializer_class = ProgrammerExpertiseSerializer