from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import *
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.validators import ValidationError

# Create your views here.

from rest_framework import status

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