from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.validators import ValidationError
from rest_framework import serializers
from .services import PaymentService
# Create your views here.
from django.views.decorators.csrf import csrf_exempt
import redis
import json
from rest_framework import status
from drf_spectacular.utils import extend_schema ,inline_serializer
redis_client = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


# class PaymentApiView(APIView,PaymentSerivce):
#     def post(self,request):
#         return self.submitPayment()


class WithDrawViewSet(ModelViewSet):
    queryset = WithDrawFunds.objects.all()
    serializer_class = WithDrawSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):

        user = self.request.user
        print(user)
        amount = serializer.validated_data["amount"]

        if user.digital_wallet < amount:
            raise ValidationError("مقدار برداشت از موجودی کیف پول شما بیشتر است.")

        serializer.save(user=user, status="pending")
        return super().perform_create(serializer)


class WithDrawApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        try:
            amount = int(request.data.get("amount"))
        except (TypeError, ValueError):
            return Response(
                {"success": False, "message": "مقدار وارد شده نامعتبر است."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        card_bank = request.data.get("card_bank")
        user = request.user

        # بررسی موجودی در کیف پول با در نظر گرفتن safe_withdraw
        if user.safe_withdraw + amount > user.digital_wallet:
            return Response(
                {
                    "success": False,
                    "message": "موجودی کافی نیست برای این برداشت.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ثبت درخواست برداشت
        created = WithDrawFunds.objects.create(
            user=user,
            amount=amount,
            bank_card_to_with_draw=card_bank
        )

        # افزایش مقدار safe_withdraw
        user.safe_withdraw += amount
        user.save()

        return Response(
            {
                "success": True,
                "message": "درخواست برداشت با موفقیت ثبت شد.",
            },
        )





@extend_schema(
    summary="ایجاد پرداخت",
    description="این API برای ایجاد یک پرداخت جدید استفاده می‌شود.",
    request=inline_serializer(
        name="CreatePaymentInput",
        fields={
            'amount': serializers.IntegerField(help_text="مبلغ پرداخت (تومان)"),
            'currency': serializers.CharField(help_text="واحد پول (مثلاً IRR)"),
            'description': serializers.CharField(help_text="توضیحات پرداخت", required=False),
        }
    ),
)
class CreatePaymentMethod(APIView,PaymentService):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        return self.create_payment(request)


@csrf_exempt    
def CallBackPayment(request,session_id):
    payment_service = PaymentService()
    print(session_id)
    context = payment_service.callback_payment(request,session_id)
    message = {
        "session_id":context["session_id"],
        "payed":True
    }
    payed_message = json.dumps(message)
    redis_client.publish("payed_session",payed_message)


    return render(request,template_name="callback.html",context=context)
    # return payment_service.callback_payment(request)