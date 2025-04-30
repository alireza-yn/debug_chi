from django.shortcuts import render
from rest_framework import viewsets
from .serializer import *
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth import get_user_model


User = get_user_model()


class FollowerViewSet(viewsets.ModelViewSet):
    queryset = Followers.objects.all()
    serializer_class = FollowerSerializer


class UserCommentsViewSet(viewsets.ModelViewSet):
    
    queryset = UserComments.objects.all()
    serializer_class = UserCommentsSerializer
    permission_classes=[IsAuthenticated]
    def perform_create(self, serializer:UserCommentsSerializer):
        serializer.save(commented_user=self.request.user)