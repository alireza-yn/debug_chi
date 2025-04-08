from rest_framework import serializers
from .models import Posts, Comments, Liked,PostGroup
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

    user = UserPostSerializer()
    class Meta:
        model = Comments
        fields = ['id', 'user', 'text', 'created_at','post']
        # fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    user = UserPostSerializer(read_only=True)
    class Meta:
        model = Liked
        fields = ['id', 'user', 'is_liked','created_at']
        # fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    
    comments = CommentSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField() 
    likes = serializers.SerializerMethodField() 

    class Meta:
        model = Posts
        fields = ['id',"thumbnail",'media_type','post_type', 'title', 'caption', 'file', 'comments', 'likes', 'likes_count', 'created_at','order']

    def get_likes_count(self, obj):
        return obj.likes.filter(is_liked=True).count()  

    def get_likes(self, obj):
        liked_users = obj.likes.filter(is_liked=True) 
        return LikeSerializer(liked_users, many=True).data  
    

class PostGroupSerializers(serializers.ModelSerializer):
    collection = PostSerializer(many=True,read_only=True)
    class Meta:
        model = PostGroup
        fields = ['id','is_slider','title','description','collection','created_at','updated_at']