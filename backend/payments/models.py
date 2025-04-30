from django.db import models
from django.conf import settings
import uuid
from django.contrib.auth import get_user_model
from core.models import Timestamp

User = get_user_model()


class Payments(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    description = models.CharField(max_length=300)


class Factor(models.Model):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

    STATUS_CHOICES = [
        (PENDING, "در حال پردازش"),
        (SUCCESS, "با موفقیت انجام شد"),
        (FAILED, "با خطا مواجه شد"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    session_id = models.UUIDField(null=True, blank=True,unique=True)
    factor_uuid = models.UUIDField(default=uuid.uuid4)
    amount = models.IntegerField(default=0)
    payemnt_status = models.CharField(
        max_length=150, default="pending", choices=STATUS_CHOICES
    )
    created_at = models.DateTimeField(auto_now=True)


class WithDrawFunds(Timestamp):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"

    STATUS_CHOICES = [
        (PENDING, "در حال پردازش"),
        (SUCCESS, "با موفقیت انجام شد"),
        (FAILED, "با خطا مواجه شد"),
    ]

    amount = models.IntegerField(default=0)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="user_withdraw"
    )
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default=PENDING)
    bank_card_to_with_draw = models.CharField(max_length=16, default="")

    def __str__(self):
        return (
            f"Withdraw {self.amount} from {self.user.username} - Status: {self.status}"
        )
