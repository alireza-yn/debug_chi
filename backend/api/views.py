from django.shortcuts import render
from rest_framework.request import Request
# Create your views here.
from drf_spectacular.utils import extend_schema
from auths.serializers import Role,CustomRoleSerializers,UserSerializer
from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.viewsets import ViewSet
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView 
import requests
from core.permissions import RoleMixin
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
User = get_user_model()





class UsersByRoleListView(ListAPIView):
    serializer_class = CustomRoleSerializers
    
    def get_queryset(self,*args,**kwargs):
        request:Request = self.request
        name = request.query_params.get('name')
        if name:
            return Role.objects.filter(name=name)
        else:
            return Role.objects.all()

class GetUserInfoByUUID(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "uuid"  # مشخص کردن uuid به عنوان فیلد جستجو

    @extend_schema(
        summary="Get user by UUID",
        description="Retrieve user details using a UUID provided in the URL path.",
        responses={200: UserSerializer},
    )
    def get_object(self):
        uuid = self.kwargs.get("uuid")  # دریافت uuid از مسیر
        if not uuid:
            raise NotFound(detail="User UUID is required.")

        try:
            return User.objects.get(uuid=uuid)
        except User.DoesNotExist:
            raise NotFound(detail="User not found.")


class GetUserInfo(APIView):
    def get(self,request:Request):
        return request.user    
        
    
    


class TextToSpeech(APIView):
    def post(self,request:Request):
        text = request.data.get('text')
        headers = {
    'Authorization': 'Bearer sk-7c5371ca2a70048898931c4c448017ad'
        }

        data = {
            'text': text,
            'server': 'farsi',
            'sound': '2'
        }

        url = 'https://api.talkbot.ir/v1/media/text-to-speech/REQ'

        response = requests.post(url, headers=headers, data=data)

        if response.status_code == 200:
            
            data = response.json()
            return Response (
                {
                    "url":data["response"]['download']
                }
            )
        else:
            print(f'Error: {response.status_code} - {response.text}')

# class GetUserInfoByUUID(RetrieveAPIView):
#     serializer_class = UserSerializer
#     lookup_field = "uuid"
#     @extend_schema(
#         parameters=[
#             {
#                 "name": "user",
#                 "in": "query",
#                 "required": True,
#                 "description": "User UUID",
#                 "schema": {
#                     "type": "string",
#                     "format": "uuid"
#                 }
#             }
#         ],
#         responses={200: UserSerializer}
#     )
#     def get_object(self):
#         request: Request = self.request
#         uuid = request.query_params.get('user')
#         if not uuid:
#             raise NotFound(detail="User UUID is required.")
        
#         try:
#             user = User.objects.get(uuid=uuid)
#             return user
#         except User.DoesNotExist:
#             raise NotFound(detail="User not found.")


class TestUploadView(APIView):
    def get(self, request):
        content = ContentFile(b"Hello world!")
        path = default_storage.save("test/test_file.txt", content)
        file_url = default_storage.url(path)
        
        return Response({"file_url": file_url})