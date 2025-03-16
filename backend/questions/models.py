from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.name

class Question(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    sound = models.FileField(upload_to='questions_sounds/', blank=True, null=True)
    def __str__(self):
        return self.text
    
    
    

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)    
    def __str__(self):
        return self.text
