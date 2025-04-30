

from django.urls import path
from .views import CreatePaymentMethod,CallBackPayment

urlpatterns = [
    path('create_payment/',view=CreatePaymentMethod.as_view(),name="ساخت پرداخت"),
    path('callback_payment/<str:session_id>/',view=CallBackPayment,name="تکمیل پرداخت"),

]