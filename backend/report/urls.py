from django.urls import path
from .views import *
urlpatterns = [
    path('user_report/',UserReportApiView.as_view(),name='user-report')
]