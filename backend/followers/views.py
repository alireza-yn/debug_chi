from django.shortcuts import render
from rest_framework import viewsets
from .serializer import *

class FollowerViewSet(viewsets.ModelViewSet):
    queryset = Followers.objects.all()
    serializer_class = FollowerSerializer