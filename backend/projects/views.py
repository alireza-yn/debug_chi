from rest_framework.viewsets import ModelViewSet,ViewSet
from django.contrib.auth import get_user_model
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, JSONParser
from .models import EducationPeoject,TenderProject
from programming_language.models import ProgrammingLanguage, ProgrammerExpertise
import json
from rest_framework.request import Request
from .service import TenderService
User = get_user_model()
import redis

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)




class TenderProjectViewSet(ModelViewSet):
    queryset = TenderProject.objects.all()
    serializer_class = TenderSerializers
    def perform_create(self, serializer):
        trend = serializer.save()
        
        # ارسال اطلاعات مزایده به Redis برای اطلاع‌رسانی به Node.js
        trend_data = {
            "title":trend.title,
            "description":trend.description,
            "start_time":str(trend.start_time),
            "end_time":str(trend.end_time),
            "created_by":trend.created_by.user_phone,
            "start_bid":str(trend.start_bid)
        }
        message = json.dumps(trend_data)
        redis_client.publish("new_trend", message)

class BidProjectViewSet(ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializers
    def perform_create(self, serializer):
        bid = serializer.save()
        
        # ارسال اطلاعات مزایده به Redis برای اطلاع‌رسانی به Node.js
        bid_data = {
            "bid_id": bid.id,
            "amount": float(bid.amount),
            "user_id": bid.user.id,
            "tender_id": bid.tender.id,
            "tender_title": bid.tender.title
        }
        message = json.dumps(bid_data)
        redis_client.publish("new_bid", message)


class TenderProjectListView(APIView,TenderService):
    def get(self,request:Request):
        tender_id = request.query_params.get('tender_id')
        return self.tender_users_list(tender_id)

class ProjectViewSet(ModelViewSet):
    queryset = EducationPeoject.objects.all().order_by('-created_at')
    serializer_class = ProjectSerializer



class CreateProjectAPIView(ViewSet):
    parser_classes = (MultiPartParser, JSONParser)  # برای پشتیبانی از FormData و JSON

    def create(self, request:Request , *args, **kwargs):
        try:
            # دریافت داده‌ها
            type_class = request.data.get('type_class')
            class_session = request.data.get('class_session')
            educational_heading = request.data.get('educational_heading')
            price = request.data.get('price')
            discount = request.data.get('discount')
            description = request.data.get('description')
            user_id = request.data.get('user')

            # دریافت فایل‌ها
            educational_heading_file = request.FILES.get('educational_heading_file')

            # دریافت آرایه‌ها و تبدیل به لیست Python
            try:
                language = json.loads(request.data.get('language', '[]'))
                expertise = json.loads(request.data.get('expertise', '[]'))
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON format for language or expertise"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # بررسی موجودیت کاربر
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            # ایجاد نمونه پروژه
            project = EducationPeoject.objects.create(
                type_class=type_class,
                class_session=class_session,
                educational_heading=educational_heading,
                price=price,
                discount=discount,
                description=description,
                educational_heading_file=educational_heading_file,
                user=user,
            )

            # افزودن زبان‌های برنامه‌نویسی
            for lang_id in language:
                try:
                    lang = ProgrammingLanguage.objects.get(id=lang_id)
                    project.language.add(lang)
                except ProgrammingLanguage.DoesNotExist:
                    return Response(
                        {"error": f"ProgrammingLanguage with id {lang_id} not found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            # افزودن تخصص‌ها
            for exp_id in expertise:
                try:
                    exp = ProgrammerExpertise.objects.get(id=exp_id)
                    project.expertise.add(exp)
                except ProgrammerExpertise.DoesNotExist:
                    return Response(
                        {"error": f"ProgrammerExpertise with id {exp_id} not found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            # ذخیره نهایی پروژه
            project.save()

            return Response({"message": "Project created successfully", "project_id": project.id}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )