from rest_framework.serializers import ModelSerializer, StringRelatedField
from .models import *
from user_resume.serializers import *
from django.contrib.auth import get_user_model
from programming_language.serializers import *

User = get_user_model()

class RoleSerializer(ModelSerializer):
    class Meta:
        model = Role
        fields = "__all__"

class UserSerializer(ModelSerializer):
    user_roles = StringRelatedField(many=True, read_only=True,help_text="نقش های کاربر")
    user_resume = UserResumeSerializer(many=True, read_only=True)
    user_language = UserLanguageSerializer(many=True, read_only=True)
    user_expertise = StringRelatedField(many=True, read_only=True)
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
            "digital_wallet"
        ]
        # extra_kwargs = {'user_roles': {'read_only': True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class CustomUserSerializer(ModelSerializer):
    user_language = UserLanguageSerializer(many=True,read_only=True)
    user_expertise = StringRelatedField(many=True, read_only=True)
    
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
        fields = [
            "id",
            "name",
            "users"
        ]
