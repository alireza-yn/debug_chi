from django.db import models
from core.models import Timestamp
from django.contrib.auth import get_user_model

User = get_user_model()

class Posts(Timestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    thumbnail = models.ImageField(upload_to='static/posts/images')
    post_type = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    caption = models.TextField()
    video = models.FileField(upload_to='static/posts/videos/')  # محل ذخیره ویدیوها

    def __str__(self):
        return self.title

class Comments(Timestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.text[:20]}"  # نمایش خلاصه‌ای از کامنت

class Liked(Timestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='likes')
    is_liked = models.BooleanField(default=False)  # پیش‌فرض لایک هست

    class Meta:
        unique_together = ('user', 'post')  # یک کاربر فقط یک بار می‌تواند یک پست را لایک کند

    def __str__(self):
        return f"{self.user.username} liked {self.post.title}"