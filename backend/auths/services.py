from .models import CustomUser, OTP, UserBankCards, RequestPassowordReset,Role
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import random
from .serializers import RegisterSerializers, UserSerializer
from rest_framework.request import Request
import redis
import json

from django.db.models import Q
from django.contrib.auth import get_user_model
from .utils import send_verification_code
from django.conf import settings

User = get_user_model()
redis_client = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


class UserService:
    def create_user(self, request: Request):
        serializer = RegisterSerializers(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        print(validated_data)
        # Check if user already exists by username, phone, or email
        user_exists = CustomUser.objects.filter(
            Q(username=validated_data.get('username')) |
            Q(user_phone=validated_data.get('user_phone')) |
            Q(email=validated_data.get('email'))
        ).exists()

        if user_exists:
            return Response(
                {
                    "error": True,
                    "message": "کاربری با این مشخصات از قبل وجود دارد"
                },
                status=status.HTTP_200_OK
            )

        # Create the user
        user = serializer.save()

        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "user_phone": user.user_phone,
        }

        # Publish user data to Redis
        message = json.dumps(user_data)
        redis_client.publish("new_user", message)

        # Create OTP and send it
        created, otp_code = self.create_otp(user.user_phone)
        response = None
        if otp_code:
            response = send_verification_code(user.user_phone, otp_code)

        return Response(
            {
                "message": "کاربر با موفقیت ثبت شد",
                "user_id": user.id,
                "success": True,
                "response": response,
            },
            status=status.HTTP_201_CREATED,
        )
    def create_user_by_phone(self, phone):
        user = CustomUser.objects.filter(user_phone=phone).first()
        otp_exist = OTP.objects.filter(user=user).first()
        if otp_exist:
            otp_exist.delete()

        otp_code = random.randint(100000, 999999)
        if user:
            otp = OTP.objects.create(user=user, otp_code=otp_code)
            if otp:
                send_verification_code(user.user_phone, otp.otp_code)
        else:
            new_user = CustomUser.objects.create(user_phone=phone)
            otp = OTP.objects.create(user=new_user, otp_code=otp_code)
            return Response(
                {"success": True, "otp": otp_code},
                status=status.HTTP_201_CREATED,
            )

    def activate_user(self, otp_code):

        otp = OTP.objects.filter(otp_code=otp_code).first()
        if otp:
            otp.delete()
            otp.user.is_active = True
            otp.user.save()
            refresh = RefreshToken.for_user(otp.user)
            return Response(
                {
                    "success": True,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "intro": otp.user.intro_completed,
                    "uuid": otp.user.uuid,
                    "data": UserSerializer(otp.user).data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"error": "Invalid OTP code"},
                status=status.HTTP_200_OK,
            )

    def active_users(self):
        return CustomUser.objects.filter(is_active=True)

    def get_by_phone(self, phone):
        return CustomUser.objects.filter(user_phone=phone).first()

    def admin_login(self, request: Request):
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
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                print(user.check_password(password))
                return Response(
                    {"error": "credentials are not valid"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

    def user_login(self, request:Request):
        username = request.data.get("username")
        password = request.data.get("password")
        user_type = request.data.get("type")

        if not username or not password or not user_type:
            return Response(
                {"error": "نام کاربری، کلمه عبور و نوع کاربر الزامی است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = CustomUser.objects.filter(
            Q(username=username) | Q(email=username) | Q(user_phone=username)
        ).first()

        if not user or not user.check_password(password):
            return Response(
                {"error": "نام کاربری یا کلمه عبور اشتباه است"},
                status=status.HTTP_200_OK,
            )

        is_specialist = user.user_roles.filter(Q(name="debugger") | Q(name="consultant")).exists()

        # Handle specialist login
        if user_type == "specialist":
            if is_specialist:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "success": True,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "user": UserSerializer(user).data,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"error": "نام کاربری وارد شده پیدا نشد"},
                    status=status.HTTP_200_OK,
                )

        # Handle customer login
        if user_type == "customer":
            if is_specialist:
                return Response(
                    {"error": "نام کاربری وارد شده مختص دیباگر است"},
                    status=status.HTTP_200_OK,
                )
            else:
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "success": True,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "user": UserSerializer(user).data,
                    },
                    status=status.HTTP_200_OK,
                )

        return Response(
            {"error": "نوع کاربر نامعتبر است"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def create_otp(self, user_phone):
        user = CustomUser.objects.filter(user_phone=user_phone).first()
        otp_exist = OTP.objects.filter(user=user).first()
        if otp_exist:
            otp_exist.delete()

        otp_code = random.randint(100000, 999999)
        if user:
            otp = OTP.objects.create(user=user, otp_code=otp_code)
            if otp:
                print("otp_created")
                return True, otp.otp_code
            else:
                print("otp_false")
                return False, None

    def add_bank_card(self, card_number, title, user):

        requested_user_for_add_card = User.objects.filter(id=user.id).first()
        print(requested_user_for_add_card.first_name)

        # exist = UserBankCards.objects.filter(card_number=card_number).first()
        if UserBankCards.objects.filter(card_number=card_number).exists():
            return False, "کارت بانکی وارد شده تکراری است", None
        else:
            new_card = UserBankCards.objects.create(
                card_number=card_number, title=title, user=requested_user_for_add_card
            )
            return (
                True,
                "با موفقیت ذخیره شد",
                {
                    "id": new_card.id,
                    "title": new_card.title,
                    "card_number": new_card.card_number,
                    "default_card": new_card.default_card,
                },
            )

    def delete_bank_card(self, card_id, user):
        card = UserBankCards.objects.filter(user=user, id=card_id).first()
        if card:
            card.delete()
            return True, "کارت با موفقیت حذف شد."
        return False, "کارت یافت نشد."

    def create_reset_password_link(self, user_phone):
        user = CustomUser.objects.filter(user_phone=user_phone).first()
        if user is None:
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": True,
                    "data": "",
                    "message": "شماره تلفن وارد شده پیدا نشد",
                }
            )

        code = random.randint(100000, 999999)

        exist = RequestPassowordReset.objects.filter(user=user).first()
        if exist:
            exist.code = code
            exist.save()
            send_verification_code(exist.user.user_phone, exist.code, "767468")
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": False,
                    "message": "کد تغییر کلمه عبور برای شما ارسال شد",
                }
            )

        password_object = RequestPassowordReset.objects.create(
            user=user, code=str(code)
        )

        if password_object:
            send_verification_code(
                user.user_phone, code=password_object.code, templateID="767468"
            )
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": False,
                    "message": "کد تغییر کلمه عبور برای شما ارسال شد",
                }
            )
        else:
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": True,
                    "message": "درخواست شما با خطا مواجه شد دوباره اقدام کنید",
                }
            )

    def code_verification(self, code):
        code = RequestPassowordReset.objects.filter(code=code).first()
        if code is None:
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": False,
                    "message": "کد ارسالی اشتباه است دوباره اقدام کنید",
                }
            )

        else:

            code.is_verified = True
            code.save()
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": False,
                    "data": str(code.token),
                    "message": "کد شما تایید شد",
                }
            )

    def reset_user_password(self, token, password):
        token_obj = RequestPassowordReset.objects.filter(token=token).first()
        if token_obj.is_verified:
            token_obj.save()

            user = token_obj.user
            user.set_password(password)
            user.save()
            token_obj.delete()
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": False,
                    "message": "پسورد شما با موفقیت تغییر کرد",
                }
            )
        else:
            return Response(
                {
                    "status": status.HTTP_201_CREATED,
                    "error": True,
                    "message": "توکن معتبر نیست یا قبلاً استفاده شده است",
                }
            )

    def regitser_debuger(self, request: Request):
        serializer = RegisterSerializers(data=request.data)
        user = CustomUser.objects.filter(Q(username=serializer.data.get('username')) | Q(user_phone=serializer.data.get('user_phone')) | Q(email = serializer.data.get('email'))).exists()
        if user:
            return Response({
                "error":True,
                "message":"user exist"
            })
        if serializer.is_valid():
            user = serializer.save()

            # Assign debugger role to the user
            try:
                debugger_role = Role.objects.get(name="debugger")
                print(debugger_role)
            except Role.DoesNotExist:
                debugger_role = None

            if debugger_role:
                debugger_role.users.add(user)
                debugger_role.save()
                print(debugger_role)


            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "user_phone": user.user_phone,
            }
            message = json.dumps(user_data)

            redis_client.publish("new_user", message)

            created, otp_code = self.create_otp(user.user_phone)

            response = None
            if otp_code is not None:
                response = send_verification_code(user.user_phone, otp_code)

            return Response(
                {
                    "message": "کاربر با موفقیت ثبت شد",
                    "user_id": user.id,
                    "success": True,
                    "intro":True,
                    "response": response,
                },
                status=status.HTTP_201_CREATED,
            )
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_200_OK)
