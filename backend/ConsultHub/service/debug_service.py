from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import *


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name","image_profile","username"]


class DebuggerSerializer(serializers.ModelSerializer):
    debuger = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    debuger_applicator = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )

    class Meta:
        model = DebugSession
        fields = [
            "id",
            "session_id",
            "debuger",
            "debuger_applicator",
            "status",
            "start_at",
            "close_at",
            "description",
            "file",
            "price",
            "discount",
            "mode",
            "time",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["debuger"] = UserSerializer(instance.debuger).data
        representation["debuger_applicator"] = UserSerializer(
            instance.debuger_applicator
        ).data
        return representation
    
    
    def create(self, validated_data):
        
        return super().create(validated_data)
