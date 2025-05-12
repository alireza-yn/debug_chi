from django.db import models
from django.conf import settings
# Create your models here.
from programming_language.models import *
from core.models import Timestamp

from django.contrib.auth import get_user_model




User = get_user_model()

class TimeStampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True




class UserResume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="user_resume")
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='static/resume/image_resume',null=True,blank=True)
    cv_file = models.FileField(upload_to='static/resume/cv_resume',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user} - {self.title}"
    
    
class VideoResume(models.Model):
    user = models.ForeignKey(UserResume, on_delete=models.CASCADE,related_name="video_resume")
    video_file = models.FileField(upload_to='static/resume/video_resume',null=True,blank=True)
    title = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='static/resume/video_resume',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class UserDegree(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="user_degree")
    title = models.CharField(max_length=100,default="")
    degree_file = models.FileField(upload_to='static/resume/degree_resume',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user} - degrees"

class UserLanguage(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="user_language")
    language_name = models.ForeignKey(ProgrammingLanguage, on_delete=models.CASCADE,related_name="language_name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('user', 'language_name')
        
    def __str__(self):
        return f"{self.language_name.name} - {self.language_name.level}"
    
class UserSkill(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="user_skill")
    skill_name = models.ForeignKey(ProgrammerSkill, on_delete=models.CASCADE,related_name="language_name")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('user', 'skill_name')
    def __str__(self):
        return f"{self.user} - {self.skill_name}"

class UserSocialMediaLinks(models.Model):
    SOCIAL_NAME = [
        ("instagram","instagram"),
        ("linkedin","linkedin"),
        ("github","github"),
        ("facebook","facebook")
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="user_social_media_links")
    social_media_name = models.CharField(max_length=100,choices=SOCIAL_NAME,blank=True,null=True)
    link = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user} - {self.social_media_name}"
    


class UserExpertise(TimeStampModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,related_name="user_expertise",blank=True,null=True)
    expertise = models.ManyToManyField(ProgrammerExpertise,related_name="user_expertise",blank=True)
    




class UserPortfolio(Timestamp):
    name = models.CharField(max_length=100, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_portfolios"
    )

    def __str__(self):
        return f"Portfolio: {self.name or 'No Title'}"


class UserPortfolioImage(Timestamp):
    image = models.ImageField(upload_to='static/user/portfolio/')
    user_portfolio = models.ForeignKey(
        UserPortfolio,
        on_delete=models.CASCADE,
        related_name="images"
    )

    def __str__(self):
        return f"Image for {self.user_portfolio.name or 'No Title'}"

    # def __str__(self):
    #     if self.expertise.values_list('title',flat=True):
    #         return self.expertise.values('title')
    #     else :
    #         return "none"
    # def __str__(self):
    #     # اگر expertise داده‌ای داشته باشد، نام هر یک از آن‌ها را نمایش می‌دهیم
    #     expertise_names = self.expertise.values_list('title', flat=True)  # فرض می‌کنیم فیلدی به نام 'name' در مدل ProgrammerExpertise وجود دارد
    #     return ", ".join(expertise_names) if expertise_names else "No expertise"



class UserJobHistory(Timestamp):
    companyName = models.CharField(max_length=200)
    jobTitle = models.CharField(max_length=200)
    description = models.TextField()
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    responsibilities = models.TextField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='user_job_history')




class UserForiegnLanguage(Timestamp):
    name = models.CharField(max_length=30)
    rate = models.IntegerField(default=0)
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='user_foreign_language')