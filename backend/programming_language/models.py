from django.db import models

# Create your models here.

class TimeStampModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        
class ProgrammingLanguage(models.Model):
    LEVEL_CHOICES = [
        ('beginner', 'مقدماتی'),
        ('intermediate', 'متوسط'),
        ('advanced', 'پیشرفته'),
    ]

    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='static/programming_language/', null=True, blank=True)
    video = models.FileField(upload_to='static/programming_language/', null=True, blank=True)
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default='beginner',  # مقدار پیش‌فرض
    )

    def __str__(self):
        return f"{self.name} - {self.level}"
 
class ProgrammerSkill(models.Model):
    SKILL_LEVEL = [
        ('beginner', 'مقدماتی'),
        ('intermediate', 'متوسط'),
        ('advanced', 'پیشرفته')
    ]
    name = models.CharField(max_length=100)
    skill_level = models.CharField(max_length=20, choices=SKILL_LEVEL, default='beginner')
    image = models.ImageField(upload_to='static/programmer_skill',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name','skill_level'],name='unique_name_skill_level')
        ]
    
    
    def __str__(self):
        return self.name

    

class ProgrammerExpertise(TimeStampModel):
    title = models.CharField(max_length=100)
    def __str__(self):
        return f"{self.title}"