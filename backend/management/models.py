from django.db import models
from django.conf import settings 

class ProjectTeam(models.Model):
    manager = models.ForeignKey(settings.AUTH_USER_MODEL,blank=True,null=True,on_delete=models.SET_NULL)
    team_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name='projetc_users',blank=True)
    is_deleted = models.BooleanField(default=False)

    def delete(self, using=None, keep_parents=False):
        """بازنویسی متد delete برای انجام حذف نرم"""
        self.is_deleted = True
        self.save()

    def restore(self):
        """متد برای بازگردانی تیم حذف‌شده"""
        self.is_deleted = False
        self.save()

    def __str__(self):
        return self.team_name

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    start_date = models.DateTimeField(blank=True,null=True)
    end_date = models.DateTimeField(blank=True,null=True)
    buffer_date = models.IntegerField(default=0)
    project_teams = models.ManyToManyField(ProjectTeam,related_name='project_teams',blank=True)
    is_deleted = models.BooleanField(default=False)

    def delete(self, using=None, keep_parents=False):
        """بازنویسی متد delete برای انجام حذف نرم"""
        self.is_deleted = True
        self.save()

    def restore(self):
        """متد برای بازگردانی تیم حذف‌شده"""
        self.is_deleted = False
        self.save()

    def __str__(self):
        return self.title
