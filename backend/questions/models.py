from django.db import models
from core.models import Timestamp
# Create your models here.


class Questin(Timestamp):
    title = models.CharField(max_length=200,null=False,blank=False)
    category = models.CharField(max_length=250,null=False,blank=False)
    category = models.CharField(max_length=250,null=False,blank=False)
    