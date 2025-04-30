from django.db import models
from core.models import Timestamp
from django.contrib.auth import get_user_model

User = get_user_model()
class PostGroup(Timestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post_groups')
    is_slider = models.BooleanField(default=False)
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    collection = models.ManyToManyField('Posts',related_name='post_collection')
    def __str__(self):
        return self.title

class Posts(Timestamp):
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True,blank=True)
    thumbnail = models.ImageField(upload_to='static/posts/images')
    media_type = models.CharField(max_length=50,default="picture")
    post_type = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    caption = models.TextField()
    file = models.FileField(upload_to='static/posts/file/',null=True,blank=True) 
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

class Comments(Timestamp):

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()

    def __str__(self):
        return f"{self.user.username} - {self.text[:20]}" 

class Liked(Timestamp):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    post = models.ForeignKey(Posts, on_delete=models.CASCADE, related_name='likes')
    is_liked = models.BooleanField(default=False) 

    class Meta:
        unique_together = ('user', 'post') 

    def __str__(self):
        return f"{self.user.username} liked {self.post.title}"
