from django.db import models
from programming_language.models import *
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.exceptions import ValidationError
from core.models import Timestamp
User = get_user_model()
# Create your models here.
class EducationPeoject(models.Model):
    class_type =[
        
        ('public','عمومی'),
        ('private','خصوصی')
    
    ]
    class_session = models.IntegerField(default=0,blank=True,null=True)
    language = models.ManyToManyField(ProgrammingLanguage,related_name='project_language')
    expertise = models.ManyToManyField(ProgrammerExpertise,related_name='project_expertise')
    description = models.TextField()
    type_class = models.CharField(max_length=50,choices=class_type,default='public') 
    educational_heading = models.TextField(blank=True,null=True)
    educational_heading_file = models.FileField(upload_to='static/project/files')
    price = models.IntegerField()
    discount = models.IntegerField()
    users = models.ManyToManyField(User,related_name='project_user')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True,null=True)
    end_date = models.DateTimeField(blank=True,null=True)
    buffer_date = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    image = models.ImageField(upload_to='static/project/image_project',null=True,blank=True)
    time_line = models.TextField(null=True,blank=True)








class TenderProject(Timestamp):
    title = models.CharField(max_length=255) 
    description = models.TextField() 
    start_time = models.DateTimeField()  
    end_time = models.DateTimeField()  
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_tenders') 
    start_bid = models.DecimalField(max_digits=10,decimal_places=2,default=0) 
    highest_bid = models.DecimalField(max_digits=10, decimal_places=2, default=0)  
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_tenders')  # برنده نهایی
    language = models.ManyToManyField('programming_language.ProgrammingLanguage',related_name='tender_language')
    skills = models.ManyToManyField('programming_language.ProgrammerSkill',related_name='tender_skill')
    
    
    def __str__(self):
        user = self.created_by
        user_name = f"{user.first_name} {user.last_name}".strip()
        
        if not user_name:  # اگر نام و نام خانوادگی ثبت نشده بود
            user_name = user.email or getattr(user, 'phone_number', 'Unknown User')

        return f"{self.title} created by {user_name}"
    
    
    
class Bid(Timestamp):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bids')  
    tender = models.ForeignKey(TenderProject, on_delete=models.CASCADE, related_name='bids') 
    amount = models.DecimalField(max_digits=10, decimal_places=2) 
    
    class Meta:
        ordering = ['-amount']  
        
        
    def __str__(self):
        return self.tender.title