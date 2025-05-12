from django.db import models
from core.models import Timestamp
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    def __str__(self):
        return self.name


class Section(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="sections")
    number = models.IntegerField(default=0)  # ترتیب بخش‌ها
    
    def __str__(self):
        return f"{self.category.name} - Section {self.number}"


class Question(models.Model):
    QUESTION_TYPES = (
        ('checkbox', 'Checkbox'),
        ('text', 'Text'),
        ('button', 'Button'),
        ('emoji', 'Emoji'),
    )

    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="questions")
    description = models.TextField(default="")
    text = models.CharField(max_length=100)
    sound = models.FileField(upload_to='static/sound/questions_sounds/', blank=True, null=True)
    active = models.BooleanField(default=False)
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES, default="button")
    agreement = models.TextField(default="")
    def __str__(self):
        return f"{self.text} {self.section.category.name}" 


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.text






class AiCategoryQuestion(Timestamp):
    category_name = models.CharField(max_length=100)
    title = models.CharField(max_length=150,default="")
    
    def __str__(self):
        return self.category_name
    
    class Meta:
        db_table = 'AiCategoryQuestion'




class AiQuestion(Timestamp):
    category = models.ForeignKey(AiCategoryQuestion,on_delete=models.CASCADE,related_name='ai_category')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True,null=True)
    sound = models.FileField(upload_to='static/ai_question/',blank=True,null=True)
    # answers = models.TextField(default="")
    priority = models.IntegerField(default=1)
    def __str__(self):
        return f"{self.title} ({self.category.category_name})"
    
    class Meta:
        db_table = 'AiQuestion'


class AiQuestionAnswer(Timestamp):

    choices = (
        ('all','all'),
        ('front-end','front-end'),
        ('back-end','back-end'),
        ('ai','ai'),
        ('data-analyze','data-analyze')
               
        )


    answer = models.CharField(max_length=100)
    description = models.TextField(default="",blank=True)
    type = models.CharField(max_length=100,default="text")
    question = models.ForeignKey(AiQuestion,on_delete=models.CASCADE,related_name='ai_answer')
    # answers = models.TextField(default="")
    language_type = models.CharField(max_length=100,choices=choices,default="all")

    def __str__(self):
        return self.answer
    
    class Meta:
        db_table = 'AiQuestionAnswer'