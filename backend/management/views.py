from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet

from .serializers import *


class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProjectTeamViewSet(ModelViewSet):
    queryset = ProjectTeam.objects.all()
    serializer_class = ProjectTeamSerializer