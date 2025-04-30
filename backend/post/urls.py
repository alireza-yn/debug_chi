from django.urls import path

from .views import *


urlpatterns = [
    path('course_list/',VideoPostListAPIView.as_view(),name='video_course_list')
]