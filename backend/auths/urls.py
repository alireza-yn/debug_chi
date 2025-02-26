from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from .views import *


router = DefaultRouter()
router.register('register',viewset=UserViewSet)
router.register('roles',viewset=RoleViewSet)
urlpatterns = [
    path('',include(router.urls)),
    path('admin_login/', AdminLoginView.as_view(), name='login'),
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user_register/', UserRegister.as_view(), name='user_register'),
    path('verify_otp/',OTPView.as_view(),name="verify_otp"),
    path('user_info/',GetUserData.as_view(),name="user_info")
    
]