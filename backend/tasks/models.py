from django.db import models
from management.models import Project,ProjectTeam
from django.conf import settings
import os
from django.utils.timezone import now

def task_file_upload_path(instance, filename):
    # دریافت نام پروژه و نام تیم
    project_name = instance.project.title if instance.project else 'unknown_project'
    team_name = instance.team.team_name if instance.team else 'unknown_team'
    
    # استخراج پسوند فایل
    extension = filename.split('.')[-1]
    
    # ایجاد مسیر جدید برای ذخیره فایل
    new_filename = f"{now().strftime('%Y%m%d%H%M%S')}.{extension}"
    path = os.path.join('static', project_name, team_name, new_filename)
    
    return path

class Task(models.Model):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'
    PRIORITY_CHOICES = [
        (LOW, 'Low Priority'),
        (MEDIUM, 'Medium Priority'),
        (HIGH, 'High Priority'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    task_type = models.CharField(max_length=255)
    documents = models.FileField(upload_to=task_file_upload_path)
    user = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name="user_task")
    team = models.ForeignKey(ProjectTeam,on_delete=models.CASCADE,related_name="team_tasks")
    project = models.ForeignKey(Project,on_delete=models.CASCADE,related_name="project_tasks")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.CharField(max_length=255,choices=PRIORITY_CHOICES,default=LOW)
    open_status = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    buffer_date = models.DateTimeField()
