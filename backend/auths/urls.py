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
    path('login/', UserLoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('user_register/', UserRegister.as_view(), name='user_register'),
    path('register_debuger/', RegisterDebugerApiView.as_view(), name='register_debuger'),
    path('verify_otp/',OTPView.as_view(),name="verify_otp"),
    path('user_info/',GetUserData.as_view(),name="user_info"),
    path('user_cards/',UserBankCardApiView.as_view(),name="user_cards"),
    path('all_debuger/',UsersByRoleView.as_view(),name="all_debuger"),
    path('forget-password/',CreateResetPasswordLinkApiView.as_view(),name="forget-password"),
    path('reset-password/',ResetPasswordApiView.as_view(),name="reset-password"),
    path('code-verification/',CodeVerification.as_view(),name="code-verification")

    
]