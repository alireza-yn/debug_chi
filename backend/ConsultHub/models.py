from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator,MaxValueValidator

# Create your models here.
from uuid import uuid4

User = get_user_model()

class TimeStamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True,blank=True,null=True)
    updated_at = models.DateTimeField(auto_now=True,blank=True,null=True)
    
    class Meta:
        abstract = True
        
class DebugSession(TimeStamp):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        CLOSE = 'close', 'Close'
        PENDING = 'pending', 'Pending'
    
    class DebugMode(models.TextChoices):
        CHAT = 'chat', 'Chat',
        VOICE_CALL = 'voice_call', 'Voice Call',
        VIDEO_CALL = 'video_call', 'Video Call'
    title = models.CharField(max_length=100,blank=True,null=True)
    session_id = models.UUIDField(default=uuid4)
    debuger = models.ForeignKey(User, on_delete=models.CASCADE,related_name="debuger")
    debuger_applicator = models.ForeignKey(User, on_delete=models.CASCADE,related_name="debuger_applicator")
    status = models.CharField(max_length=100,choices=Status.choices,default='pending')
    start_at = models.DateTimeField(blank=True,null=True)
    close_at = models.DateTimeField(blank=True,null=True)
    mode = models.CharField(max_length=100,choices=DebugMode.choices,default='chat')
    price = models.IntegerField()
    discount = models.IntegerField()
    file = models.FileField(upload_to='static/debug/file',null=True,blank=True)
    description = models.TextField(null=True,blank=True)
    time = models.IntegerField(default=20,validators=[MaxValueValidator(60),MinValueValidator(20)])
    
    
    def __str__(self):
        return self.session_id

class ConsultSession(TimeStamp):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        CLOSE = 'close', 'Close'
        PENDING = 'pending', 'Pending'

    class ConsultMode(models.TextChoices):
        CHAT = 'chat', 'Chat'
        VOICE_CALL = 'voice_call', 'Voice Call'
        VIDEO_CALL = 'video_call', 'Video Call'
    title = models.CharField(max_length=100,blank=True,null=True)
    description = models.TextField(null=True,blank=True)
    session_id = models.UUIDField(default=uuid4)
    consult = models.ForeignKey(User, on_delete=models.CASCADE,related_name="consult")
    consult_applicator = models.ForeignKey(User, on_delete=models.CASCADE,related_name="consult_applicator")
    status = models.CharField(max_length=100,choices=Status.choices,default='pending')
    close_at = models.DateTimeField(auto_now_add=True)
    mode = models.CharField(max_length=100,choices=ConsultMode.choices,default='chat')
    price = models.FloatField()
    discount = models.IntegerField()
    lnaguage = models.TextField(null=True,blank=True)
    def __str__(self):
        return self.session_id