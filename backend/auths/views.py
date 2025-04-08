from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import *

# from .serializers_services.userSerializers import UserSerializers as testSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import random
from drf_spectacular.utils import extend_schema_view, extend_schema
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

    def get_object(self):
        return self.request.user


class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class CustomLoginView(APIView, UserService):
    def post(self, request: Request):
        phone = request.data.get("phone")
        if not phone:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self.create_user_by_phone(phone=phone)


class AdminLoginView(APIView, UserService):
    def post(self, request: Request):
        return self.admin_login(request=request)


class UserLoginView(APIView, UserService):
    def post(self, request):
        return self.user_login(request=request)


class OTPView(APIView, UserService):
    def post(self, request: Request):
        phone = request.data.get("phone")
        otp_code = request.data.get("otp")
        if otp_code is None and phone is None:
            return Response(
                {"error": "phone or otp is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self.activate_user(phone=phone, otp_code=otp_code)


class UserRegister(APIView, UserService):
    def post(self, request):
        return self.create_user(request)


class UserBankCardsListCreateView(ListCreateAPIView, UserService):
    queryset = UserBankCards.objects.all()
    serializer_class = UserBankCardsSerializers
    # permission_classes = [IsAuthenticated]
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
        
    #     card_number = serializer.validated_data.get('card_number')
    #     created, message = self.add_bank_card(card_number=card_number, user=request.user)
        
    #     if created:
    #         self.perform_create(serializer)
    #         return Response({"success":created,"message": message}, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response({"success":created,"message": message}, status=status.HTTP_400_BAD_REQUEST)

class UserBankCardApiView(APIView,UserService):
    permission_classes= [IsAuthenticated]
    def post(self, request: Request):
        title = request.data.get('title')
        card_number = request.data.get("card_number")
        created, message,data = self.add_bank_card(card_number=card_number, title=title,user=request.user)
        print(created,message)
        if created:
            return Response({"success": created, "message": message,"data":data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"success": created, "message": message}, status=status.HTTP_400_BAD_REQUEST)




class UserReportApiView(APIView,UserService):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        pass
