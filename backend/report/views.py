from django.apps import apps
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from .serializers import *
DebugReport = apps.get_model('ConsultHub', 'DebugSession')
ConsultReport = apps.get_model('ConsultHub', 'ConsultSession')


class UserReportApiView(APIView):
    def get(self, request: Request):
        user = request.user
        
        debuger = DebugReport.objects.filter(debuger=user)
        consult = ConsultReport.objects.filter(consult=user)
        debug_request = DebugReport.objects.filter(debuger_applicator=user)
        consult_request = ConsultReport.objects.filter(consult_applicator=user)

        return Response({
            "incoming_request": {
                "debug": DebugReportSerializer(debuger,many=True).data,
                "consult": ConsultReportSerializer(consult,many=True).data
            },
            "my_requests": {
                "debug": DebugReportSerializer(debug_request,many=True).data,
                "consult": ConsultReportSerializer(consult_request,many=True).data
            }
        })
