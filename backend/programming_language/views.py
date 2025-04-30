from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status

class ProgrammingLanguageViewSet(ModelViewSet):
    queryset = ProgrammingLanguage.objects.all()    
    serializer_class = ProgrammingLanguageSerializer



class ProgrammingLanguageList(ListAPIView):
    queryset = ProgrammingLanguage.objects.all()
    serializer_class = ProgrammingListSerializer




class ProgrammerSkillViewSet(ModelViewSet):
    queryset = ProgrammerSkill.objects.all()    
    serializer_class = ProgrammerSkillSerializer


class ProgrammerExpertiseViewSet(ModelViewSet):
    queryset = ProgrammerExpertise.objects.all()    
    serializer_class = ProgrammerExpertiseSerializer



class ProgrammingList(APIView):
    def get(self,request:Request):
        data = ProgrammingLanguage.objects.order_by('name').distinct('name').values('id', 'name', 'image')
        if len(data) > 0:
            return Response(data,status=status.HTTP_200_OK)
        else:
            return Response({
                "success":False,
                "message":"اطلاعات یافت نشد"
            },status=status.HTTP_200_OK)


# class AddLanguageForUser(APIView):
#     permission_classes = [IsAuthenticated]
#     def post(self,request:Request):
#         language_id = request.data.get('language_id')
