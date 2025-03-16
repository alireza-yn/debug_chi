from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import *
# from .serializers_services.userSerializers import UserSerializers as testSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import random
from drf_spectacular.utils import extend_schema_view,extend_schema
from .services import UserService
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import IsStaffPermission

class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    # permission_classes=[IsAdminUser,IsStaffPermission]

class GetUserData(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    # user_permission =
    def get_object(self):
        # Return the currently authenticated user
        return self.request.user

class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

class CustomLoginView(APIView,UserService):
    def post(self, request: Request):
        phone = request.data.get("phone")
        if not phone:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self.create_user_by_phone(phone=phone)

class AdminLoginView(APIView,UserService):   
    def post(self, request: Request):
        return self.admin_login(request=request)


class UserLoginView(APIView,UserService):
    def post(self,request):
        return self.user_login(request=request)


class OTPView(APIView,UserService):
    def post(self, request: Request):
        phone = request.data.get("phone")
        otp_code = request.data.get("otp")
        if otp_code is None and phone is None :
            return Response({"error":"phone or otp is required"},status=status.HTTP_400_BAD_REQUEST)
        return self.activate_user(phone=phone,otp_code=otp_code)            


class UserRegister(APIView,UserService):
    def post(self,request):
        return self.create_user(request)
