from django.db import models
from django.conf import settings
import uuid

class Payments(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    description = models.CharField(max_length=300)





class Factor(models.Model):
    payemnt = models.ForeignKey(Payments,on_delete=models.CASCADE)
    factor_uuid = models.UUIDField(default=uuid.uuid4())
    created_at = models.DateTimeField(auto_now=True)