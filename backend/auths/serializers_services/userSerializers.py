from rest_framework.serializers import *
from django.contrib.auth import get_user_model
from ..utils import send_request
from django.conf import settings
User = get_user_model()


class UserSerializers(ModelSerializer):
    user_roles = StringRelatedField(
        many=True, read_only=True, help_text="نقش های کاربر"
    )
    # user_resume = StringRelatedField(many=True,read_only=True)
    # user_language = StringRelatedField(many=True, read_only=True)
    user_language = SerializerMethodField()
    user_expertise = SerializerMethodField()

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
            "digital_wallet",
        ]
        depth = 1
        # extra_kwargs = {'user_roles': {'read_only': True}}
    def get_user_expertise(self, obj):
        # بازیابی تمامی UserExpertise مرتبط با کاربر
        user_expertises = obj.user_expertise.all()
        # استخراج عناوین ProgrammerExpertise از UserExpertise
        expertise_titles = []
        for user_expertise in user_expertises:
            expertise_titles.extend(
                [expertise.title for expertise in user_expertise.expertise.all()]
            )
        return expertise_titles
    def get_user_language(self,obj):
        user_language = obj.user_language.all()
        language = []
        for item in user_language:
            language.append({
                "id": item.language_name.id,
                "name": item.language_name.name,
                "image": str(item.language_name.image),
                "level":item.language_name.level
            })
        return language

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        data = {
            "user_phone":instance.user_phone,
            "first_name":instance.first_name,
            "last_name":instance.last_name,
            "uuid":str(instance.uuid),
            "image_profile":str(instance.image_profile)
        }
        c = send_request(f"{settings.NODE_JS_URL}/api/users",data)
        print(c)
        return instance

    def update(self, instance: Meta.model, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance
    def delete(self, instance: Meta.model):
        
        instance.is_deleted = True
        instance.save()
        return instance


