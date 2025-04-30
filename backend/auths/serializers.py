from rest_framework.serializers import (
    ModelSerializer,
    StringRelatedField,
    ValidationError,
    CharField,
    EmailField,
    SerializerMethodField,
    PrimaryKeyRelatedField,
)
from .models import *
from user_resume.serializers import *
from django.contrib.auth import get_user_model
from programming_language.serializers import *
from followers.serializer import Followers,UserComments,UserCommentsSerializer
from user_resume.serializers import UserPortfolioSerializer
User = get_user_model()


class UserBankCardSerializer(ModelSerializer):
    class Meta:
        model = UserBankCards
        fields = ['id','title','card_number','default_card']

class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"


class UserSerializer(ModelSerializer):
    user_roles = StringRelatedField(
        many=True, read_only=True, help_text="نقش های کاربر"
    )
    user_resume = UserResumeSerializer(many=True, read_only=True)
    user_language = UserLanguageSerializer(many=True, read_only=True)
    user_expertise = UserExpertiseSerializer(many=True, read_only=True)
    followers = SerializerMethodField()
    user_main_comment = UserCommentsSerializer(many=True,read_only=True)
    user_bank_cards = UserBankCardSerializer(many=True,read_only=True)
    user_portfolios = UserPortfolioSerializer(many=True,read_only=True)
    user_job_history = UserJobHistorySerializer(many=True,read_only=True)
    user_degree = UserDegreeSerializer(many=True,read_only=True)

    # followers = FollowerSerializer(read_only=True)
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "image_profile",
            "password",
            "user_phone",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "intro_completed",
            "unlimited",
            'job_title',
            "created",
            "updated",
            "uuid",
            "user_roles",
            "user_resume",
            "user_language",
            "user_expertise",
            "user_bio",
            "debugger_bio",
            "user_score",
            "digital_wallet",
            'blocked_wallet',
            "followers",
            'user_bank_cards',
            'user_portfolios',
            'user_job_history',
            'user_degree',
            'user_main_comment'
        ]

    def get_followers(self, obj):
        try:
            followers_obj = Followers.objects.get(user=obj)
            return {
                "count": followers_obj.followers.count(),
                "users": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "image": str(user.image_profile),
                        "uuid": user.uuid,
                    }
                    for user in followers_obj.followers.all()
                ],
            }
        except Followers.DoesNotExist:
            return []  # اگر فالوئری نداشت، لیست خالی برمی‌گردانیم.
        # extra_kwargs = {'user_roles': {'read_only': True}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class CustomUserSerializer(ModelSerializer):
    user_language = UserLanguageSerializer(many=True, read_only=True)
    user_expertise = UserExpertiseSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "image_profile",
            "user_phone",
            "first_name",
            "last_name",
            "uuid",
            "user_language",
            "user_expertise",
            "user_bio",
            "debugger_bio",
            "user_score",
        ]


class CustomRoleSerializers(ModelSerializer):
    users = CustomUserSerializer(many=True)

    class Meta:
        model = Role
        fields = ["id", "name", "users"]


class RegisterSerializers(ModelSerializer):
    user_phone = CharField(max_length=11, min_length=11, required=True)
    email = EmailField(required=True)
    first_name = CharField(max_length=50, required=True)
    last_name = CharField(max_length=50, required=True)
    username = CharField(max_length=150, required=True)
    password = CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = [
            "user_phone",
            "email",
            "first_name",
            "last_name",
            "username",
            "password",
        ]

    def validate_user_phone(self, value):
        """بررسی فرمت شماره موبایل ایرانی"""
        if not value.isdigit() or not value.startswith("09"):
            raise ValidationError("شماره تلفن معتبر نیست، باید با 09 شروع شود.")
        if CustomUser.objects.filter(user_phone=value).exists():
            raise ValidationError("این شماره تلفن قبلاً ثبت شده است.")
        return value

    def validate_username(self, value):
        """بررسی یکتا بودن نام کاربری"""
        if CustomUser.objects.filter(username=value).exists():
            raise ValidationError("این نام کاربری قبلاً ثبت شده است.")
        return value

    def validate_email(self, value):
        """بررسی یکتا بودن ایمیل"""
        if CustomUser.objects.filter(email=value).exists():
            raise ValidationError("این ایمیل قبلاً ثبت شده است.")
        return value

    def create(self, validated_data):
        """ایجاد کاربر جدید با هش کردن رمز عبور"""
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserBankCardsSerializers(ModelSerializer):
    class Meta:
        model = UserBankCards
        fields = ["card_number", "user"]
        extra_kwargs = {"user": {"read_only": True}}




class NormalUserSerializer(ModelSerializer):
    # user_roles = StringRelatedField(
    #     many=True, read_only=True, help_text="نقش های کاربر"
    # )
    user_resume = UserResumeSerializer(many=True, read_only=True)
    user_language = UserLanguageSerializer(many=True, read_only=True)
    user_expertise = UserExpertiseSerializer(many=True, read_only=True)
    followers = SerializerMethodField()
    user_main_comment = UserCommentsSerializer(many=True,read_only=True)
    user_bank_cards = UserBankCardSerializer(many=True,read_only=True)
    user_portfolios = UserPortfolioSerializer(many=True,read_only=True)
    user_job_history = UserJobHistorySerializer(many=True,read_only=True)
    user_degree = UserDegreeSerializer(many=True,read_only=True)

    # followers = FollowerSerializer(read_only=True)
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "image_profile",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "intro_completed",
            "unlimited",
            'job_title',
            "created",
            "updated",
            "uuid",
            "user_resume",
            "user_language",
            "user_expertise",
            "user_bio",
            "debugger_bio",
            "user_score",
            "digital_wallet",
            'blocked_wallet',
            "followers",
            'user_bank_cards',
            'user_portfolios',
            'user_job_history',
            'user_degree',
            'user_main_comment'
        ]

    def get_followers(self, obj):
        try:
            followers_obj = Followers.objects.get(user=obj)
            return {
                "count": followers_obj.followers.count(),
                "users": [
                    {
                        "id": user.id,
                        "username": user.username,
                        "image": str(user.image_profile),
                        "uuid": user.uuid,
                    }
                    for user in followers_obj.followers.all()
                ],
            }
        except Followers.DoesNotExist:
            return []  # اگر فالوئری نداشت، لیست خالی برمی‌گردانیم.
        # extra_kwargs = {'user_roles': {'read_only': True}
