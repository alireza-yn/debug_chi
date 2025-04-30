from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model


User = get_user_model()
class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = '__all__'



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'image_profile',
            'first_name',
            'last_name',
            'username',
            'uuid'
        ]




class UserCommentsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    commented_user = UserSerializer(read_only=True)

    class Meta:
        model = UserComments
        fields = [
            'id',
            'description',
            'user',
            'commented_user',
            "session_id",
            'rate',
            'tags'
        ]