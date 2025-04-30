from django.db import models
from core.models import Timestamp
from django.contrib.auth import get_user_model


User = get_user_model()
# Create your models here.
class Followers(Timestamp):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="following")  # کاربر اصلی
    followers = models.ManyToManyField(User, related_name="followers", blank=True)  # لیست دنبال‌کنندگان

    def count_followers(self):
        return self.followers.count()

    def __str__(self):
        return f"{self.user.username} - {self.count_followers()} followers"


class UserComments(Timestamp):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_main_comment")
    commented_user  = models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_comment_id",blank=True,null=True)
    description = models.TextField()
    rate = models.IntegerField(default=0)
    session_id = models.UUIDField(null=True,blank=True)
    tags = models.TextField(null=True,blank=True)
