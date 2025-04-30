from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Factor
from django.conf import settings
import requests
from rest_framework import status
import uuid
from django.http import HttpRequest
import requests
from ConsultHub.models import DebugSession,ConsultSession
User = get_user_model()


class PaymentService:
    def invoice_handler(self, request: Request):
        required_fields = {"invoice", "invoice_id"}
        missing_fields = {
            field: "required" for field in required_fields if field not in request.data
        }

        if missing_fields:
            return Response(missing_fields, status=status.HTTP_400_BAD_REQUEST)

        # ادامه‌ی پردازش فاکتور...
        return Response(
            {"message": "Invoice processed successfully"}, status=status.HTTP_200_OK
        )

    def create_payment(self, request: Request):
        try:
            user = User.objects.get(id=request.user.id)
            session_id_str = request.data.get("session_id")
            title = request.data.get("title")
            description = request.data.get("description")
            amount = request.data.get("amount")

            # بررسی و تبدیل session_id
            session_id = None
            if session_id_str:
                try:
                    session_id = uuid.UUID(session_id_str)
                except ValueError:
                    return Response(
                        {"success": False, "message": "مقدار session_id نامعتبر است"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            # ساخت فاکتور
            factor_created = Factor.objects.create(
                user=user,
                title=title,
                session_id=session_id,
                description=description,
                amount=amount,
            )

            # در صورت موفقیت ساخت فاکتور
            if factor_created:
                payment_data = {
                    "amount": amount,
                    "payerIdentity": factor_created.user.user_phone,
                    "payerName": f"{factor_created.user.first_name} {factor_created.user.last_name}",
                    "description": "پرداخت برای خدمات دیباگ‌چی",
                    "returnUrl": f"http://localhost:8000/payment/callback_payment/{str(factor_created.factor_uuid)}/",
                    "clientRefId": str(factor_created.user.uuid),
                }

                headers = {
                    "Authorization": f"Bearer hHyAxYWyYPHRraE3vMKp3F_ySwhhmTvqLkIyrhBKQgw"
                }

                response = requests.post(
                    url="https://api.payping.ir/new/v2/pay",
                    json=payment_data,
                    headers=headers,
                )
                print(response)
                # بررسی وضعیت پاسخ از PayPing
                if response.status_code == 200:
                    try:
                        _response = response.json()

                        return Response(
                            {
                                "success": True,
                                "url": f"https://api.payping.ir/new/v2/pay/gotoipg/{_response['code']}",
                            },
                            status=status.HTTP_200_OK,
                        )
                    except ValueError:
                        return Response(
                            {
                                "success": False,
                                "message": "پاسخ نامعتبر از سمت درگاه پرداخت دریافت شد",
                            },
                            status=status.HTTP_502_BAD_GATEWAY,
                        )
                else:
                    return Response(
                        {
                            "success": False,
                            "message": "درگاه پرداخت در دسترس نیست یا درخواست نامعتبر بود",
                            "details": response.text,  # برای دیباگ
                        },
                        status=status.HTTP_502_BAD_GATEWAY,
                    )
            else:
                return Response(
                    {
                        "success": False,
                        "message": "در هنگام ساخت فاکتور خطایی رخ داد",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except Exception as e:
            print(response.json())
            return Response(
                {
                    "success": False,
                    "message": "خطای سیستمی هنگام ایجاد پرداخت",
                    "error": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def callback_payment(self, request: HttpRequest,session_id):
        if request.POST:
            code = request.POST.get("code")
            refid = request.POST.get("refid")
            clientrefid = request.POST.get("clientrefid")
            cardnumber = request.POST.get("cardnumber")
            cardhashpan = request.POST.get("cardhashpan")
            factor = Factor.objects.filter(factor_uuid=session_id).first()
            headers = {
                "Authorization":f"Bearer {settings.PAYPING_TOKEN}"
            }
            data = {
                    "refid":refid,
                    "amount":factor.amount
                }
            _request = requests.post('https://api.payping.ir/new/v2/pay/verify',json=data,headers=headers)
            response = _request.json()
            print(response)

            if _request.status_code == 200:
                factor.payemnt_status = "success"
                factor.save()
                session = DebugSession.objects.filter(session_id=factor.session_id).first() or ConsultSession.objects.filter(session_id=factor.session_id).first() 
                session.is_locked = False
                session.status = "opne"
                session.save()
                
                return {
                    "amount":factor.amount,
                    "session_id":session.session_id,
                    "success": True,
                    "code": code,
                    "refid": refid,
                    "clientrefid": clientrefid,
                    "cardnumber": cardnumber,
                    "cardhashpan": cardhashpan,
                }
