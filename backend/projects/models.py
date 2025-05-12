from django.db import models
from programming_language.models import *
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.exceptions import ValidationError
from core.models import Timestamp
import uuid
User = get_user_model()

class EducationProject(models.Model):
    
    class_type = [
        ('public','عمومی'),
        ('private','خصوصی')
    ]

    class_session = models.UUIDField(default=uuid.uuid4)
    language = models.TextField(blank=True,null=True)
    expertise = models.TextField(blank=True,null=True)
    description = models.TextField()
    type_class = models.CharField(max_length=50,choices=class_type,default='public') 
    class_title = models.CharField(max_length=150,blank=True,null=True)
    educational_heading = models.TextField(blank=True,null=True)
    educational_heading_file = models.FileField(upload_to='static/project/files')
    price = models.BigIntegerField(default=0)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_projects_by',null=True,blank=True)
    discount = models.BigIntegerField(default=0)
    users = models.ManyToManyField(User,related_name='project_user',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True,null=True)
    end_date = models.DateTimeField(blank=True,null=True)
    buffer_date = models.BigIntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    time_line = models.TextField(null=True,blank=True)
    is_tender = models.BooleanField(default=False)

    def __str__(self):
        return self.class_title if self.class_title else 'No Title'


class ProjectImage(models.Model):
    project = models.ForeignKey(EducationProject, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='project/image_project/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.project.class_title or 'No Title'}"



class TenderProject(Timestamp):
    tender_type = [ 
        ('tender','مناقصه'),
        ('auction','مزایده')
    
    ]
    uuid = models.UUIDField(default=uuid.uuid4)
    active = models.BooleanField(default=False)
    title = models.CharField(max_length=255)    
    description = models.TextField() 
    image = models.ImageField(upload_to='static/tender/image',blank=True,null=True)
    project = models.ForeignKey(EducationProject,blank=True,null=True,on_delete=models.CASCADE)
    start_time = models.DateTimeField()  
    end_time = models.DateTimeField()  
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_tenders') 
    start_bid = models.BigIntegerField(default=0) 
    highest_bid = models.BigIntegerField(default=0)  
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_tenders')  # برنده نهایی
    language = models.TextField(blank=True,null=True)
    expertise = models.TextField(blank=True,null=True)
    skills = models.TextField(blank=True,null=True)
    mode = models.CharField(max_length=50,choices=tender_type,default='tender')
    


    def __str__(self):
        user = self.created_by
        user_name = user.get_full_name().strip() or user.email or getattr(user, 'phone_number', 'Unknown User')
        return f"{self.title} created by {user_name}"
    
    
class Bid(Timestamp):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bids')  
    tender = models.ForeignKey(TenderProject, on_delete=models.CASCADE, related_name='bids') 
    amount = models.DecimalField(max_digits=10, decimal_places=2) 
    
    class Meta:
        ordering = ['-amount']  
        
    def __str__(self):
        return self.tender.title




class TenderLikes(Timestamp):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='tender_like_user')
    tender = models.ForeignKey(TenderProject,on_delete=models.CASCADE,related_name="tender_like")

    class Meta:
        unique_together = ['user','tender']