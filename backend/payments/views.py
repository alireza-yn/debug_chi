from django.shortcuts import render
from rest_framework.views import APIView
# Create your views here.
from .services import PaymentSerivce


class PaymentApiView(APIView,PaymentSerivce):
    def post(self,request):
        return self.submitPayment()