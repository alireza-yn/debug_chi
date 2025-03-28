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