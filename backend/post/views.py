from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.status import *
# Create your views here.
from rest_framework.request import Request
from rest_framework import status
from auths.serializers import NormalUserSerializer



class PostsViewSet(ModelViewSet):
    queryset = Posts.objects.all()
    serializer_class = PostSerializer


class PostActionApiView(APIView):
    permission_classes = [IsAuthenticated]  # فقط کاربران لاگین کرده دسترسی دارند

    def post(self, request:Request):
        action_type = request.data.get('action')
        post_id = request.data.get('post_id')

        if not post_id:
            return Response({"error": "Post ID is required"}, status=HTTP_400_BAD_REQUEST)

        try:
            post = Posts.objects.get(id=post_id)
        except Posts.DoesNotExist:
            return Response({"error": "Post not found"}, status=HTTP_400_BAD_REQUEST)

        if action_type == 'like':
            is_liked = request.data.get('liked', False)  # مقدار پیش‌فرض False

            # دریافت یا ایجاد رکورد لایک برای کاربر
            post_liked, created = Liked.objects.get_or_create(user=request.user, post=post)
            post_liked.is_liked = is_liked  # مقدار جدید را ذخیره کنیم
            post_liked.save()

            # شمارش لایک‌های پست
            like_count = Liked.objects.filter(post=post, is_liked=True).count()

            return Response({
                "success": True,
                "is_liked": post_liked.is_liked,
                "like_count": like_count
            }, status=HTTP_201_CREATED)

        elif action_type == 'comment':
            return Response({"error": "Comment action not implemented"}, status=HTTP_400_BAD_REQUEST)

        return Response({"error": "Invalid action"}, status=HTTP_400_BAD_REQUEST)

class UserPostList(ListAPIView):
    # queryset = Posts.objects.all()
    serializer_class = PostGroupSerializers
    
    def get_queryset(self):
        user = self.request.user
        return PostGroup.objects.filter(user=user)

class GetUserInfoAndPost(APIView):
    def get(self, request: Request, uuid: str):
        print(uuid)
        user = User.objects.filter(uuid=uuid).first()
        if not user:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        posts = PostGroup.objects.filter(user=user)
        return Response({
            "user": NormalUserSerializer(user).data,
            "posts": PostGroupSerializers(posts, many=True).data
        })



class CommentViewSet(ModelViewSet):
    queryset = Comments.objects.all()
    serializer_class = CommentSerializer

class LikedPostViewSet(ModelViewSet):
    queryset= Liked.objects.all()
    serializer_class = LikeSerializer

class PostListModelViewSet(ModelViewSet):
    queryset = PostGroup.objects.all()
    serializer_class = PostGroupSerializers



class VideoPostListAPIView(ListAPIView):
    serializer_class = PostSerializer
    def get_queryset(self):
        return Posts.objects.filter(media_type="video").order_by('-created_at')

