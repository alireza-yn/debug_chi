
from .models import CustomUser,OTP
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import random
from rest_framework.request import Request
class UserService:
    
    def create_user_by_phone(self,phone):
        user = CustomUser.objects.filter(user_phone=phone).first()
        otp_exist = OTP.objects.filter(user=user).first()
        if otp_exist:
            otp_exist.delete()
        
        otp_code = random.randint(100000, 999999)
        if user:
            otp = OTP.objects.create(user=user, otp_code=otp_code)
            if otp:
                return Response(
                    {"success": True, "otp": otp.otp_code},
                    status=status.HTTP_200_OK,
                )
        else:
            new_user = CustomUser.objects.create(user_phone=phone)
            otp = OTP.objects.create(user=new_user, otp_code=otp_code)
            return Response(
                {"success": True, "otp": otp_code},
                status=status.HTTP_201_CREATED,
            )
    
    def activate_user(self,phone,otp_code):
        
        user = self.get_by_phone(phone)
        otp = OTP.objects.filter(user=user, otp_code=otp_code).first()
        if otp:
            otp.delete()
            user.is_active = True
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                    {
                        "success": True,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "intro":user.intro_completed,
                        "uuid":user.uuid
                    },
                    status=status.HTTP_200_OK,
                )
        else:
            return Response(
                {"error": "Invalid OTP code"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
    def active_users(self):
        return CustomUser.objects.filter(is_active=True)
    
    def get_by_phone(self,phone):
        return CustomUser.objects.filter(user_phone=phone).first()

    def admin_login(self,request:Request):
        email = request.data.get("email")
        password = request.data.get("password")
        user = CustomUser.objects.filter(email=email).first()
        print(user)
        if user.is_superuser:
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "success": True,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    },status=status.HTTP_200_OK  
                )
            else:
                print(user.check_password(password))
                return Response(
                    {"error": "credentials are not valid"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
    
    