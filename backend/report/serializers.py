from django.apps import apps
from rest_framework import serializers

DebugReport = apps.get_model('ConsultHub', 'DebugSession')
ConsultReport = apps.get_model('ConsultHub', 'ConsultSession')

class DebugReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DebugReport
        fields = '__all__'
        depth = 1

class ConsultReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultReport
        fields = '__all__'
        depth = 1