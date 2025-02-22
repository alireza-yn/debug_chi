from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

class PaymentService:
    def invoice_handler(self, request: Request):
        required_fields = {"invoice", "invoice_id"}
        missing_fields = {field: "required" for field in required_fields if field not in request.data}
        
        if missing_fields:
            return Response(missing_fields, status=status.HTTP_400_BAD_REQUEST)
        
        # ادامه‌ی پردازش فاکتور...
        return Response({"message": "Invoice processed successfully"}, status=status.HTTP_200_OK)