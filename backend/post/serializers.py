from rest_framework import serializers
from .models import Posts, Comments, Liked
from django.contrib.auth import get_user_model

User = get_user_model()



class UserPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'username',
            'image_profile',
            'uuid'
        ]


class CommentSerializer(serializers.ModelSerializer):
    # user = serializers.StringRelatedField()  # نمایش نام کاربر به جای ID
    user = UserPostSerializer()
    class Meta:
        model = Comments
        fields = ['id', 'user', 'text', 'created_at','post']

class LikeSerializer(serializers.ModelSerializer):
    user = UserPostSerializer(read_only=True)
    class Meta:
        model = Liked
        fields = ['id', 'user', 'is_liked','created_at']

class PostSerializer(serializers.ModelSerializer):
    user = UserPostSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()  # شمارش تعداد لایک‌ها
    likes = serializers.SerializerMethodField()  # فیلتر کردن لایک‌ها

    class Meta:
        model = Posts
        fields = ['id', 'user', "thumbnail", 'post_type', 'title', 'caption', 'video', 'comments', 'likes', 'likes_count', 'created_at']

    def get_likes_count(self, obj):
        return obj.likes.filter(is_liked=True).count()  # شمارش تعداد لایک‌های مرتبط با پست

    def get_likes(self, obj):
        liked_users = obj.likes.filter(is_liked=True)  # فقط مواردی که لایک کرده‌اند
        return LikeSerializer(liked_users, many=True).data  # سریالایز کردن داده‌ها