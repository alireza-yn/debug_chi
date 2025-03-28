from rest_framework import serializers
from .models import *

class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Followers
        fields = '__all__'