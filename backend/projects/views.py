from rest_framework.viewsets import ModelViewSet, ViewSet
from django.contrib.auth import get_user_model
from .serializers import *
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, JSONParser
from .models import EducationProject, TenderProject
from programming_language.models import ProgrammingLanguage, ProgrammerExpertise
import json
from rest_framework.request import Request
from .service import TenderService
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers
User = get_user_model()
import redis

redis_client = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


class TenderProjectViewSet(ModelViewSet):
    queryset = TenderProject.objects.all()
    serializer_class = TenderSerializers

    # def perform_create(self, serializer):
    #     if self.request.user:
    #         print(serializer.data,self.request.user)
    #         serializer.save(created_by=self.request.user)
    #     raise ("not valid user")
    # ارسال اطلاعات مزایده به Redis برای اطلاع‌رسانی به Node.js
    # trend_data = {
    #     "title": trend.title,
    #     "description": trend.description,
    #     "start_time": str(trend.start_time),
    #     "end_time": str(trend.end_time),
    #     "created_by": trend.created_by.user_phone,
    #     "start_bid": str(trend.start_bid),
    # }
    # message = json.dumps(trend_data)
    # redis_client.publish("new_trend", message)


class BidProjectListView(APIView, TenderService):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        # دریافت بیدهای مرتبط با کاربر
        bids = Bid.objects.filter(user=request.user)
        serializer = BidSerializers(bids, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BidProjectAPIView(APIView, TenderService):

    def post(self, request: Request):

        if not request.user.is_authenticated:
            raise AuthenticationFailed("لطفاً وارد حساب کاربری خود شوید.")

        serializer = BidSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        success, message = self.submit_bid(serializer, request)

        if not success:
            raise ValidationError({"success": success, "message": message})

        return Response(
            {"success": success, "message": message}, status=status.HTTP_201_CREATED
        )

    def put(self, request: Request):

        if not request.user.is_authenticated:
            raise AuthenticationFailed("لطفاً وارد حساب کاربری خود شوید.")
        serializer = BidSerializers(data=request.data)
        serializer.is_valid(raise_exception=True)
        success, message = self.update_bid(serializer, request)

        if not success:
            raise ValidationError({"success": success, "message": message})

        return Response(
            {"success": success, "message": message}, status=status.HTTP_201_CREATED
        )


class TenderProjectListView(APIView, TenderService):
    def get(self, request: Request):

        tender_id = request.query_params.get("tender_id")
        return self.tender_users_list(tender_id)


class ProjectViewSet(ModelViewSet):
    queryset = EducationProject.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CreateProjectAPIView(ViewSet):
    parser_classes = (MultiPartParser, JSONParser)  # برای پشتیبانی از FormData و JSON

    def create(self, request: Request, *args, **kwargs):
        try:
            # دریافت داده‌ها
            type_class = request.data.get("type_class")
            class_session = request.data.get("class_session")
            educational_heading = request.data.get("educational_heading")
            price = request.data.get("price")
            discount = request.data.get("discount")
            description = request.data.get("description")
            user_id = request.data.get("user")

            # دریافت فایل‌ها
            educational_heading_file = request.FILES.get("educational_heading_file")

            # دریافت آرایه‌ها و تبدیل به لیست Python
            try:
                language = json.loads(request.data.get("language", "[]"))
                expertise = json.loads(request.data.get("expertise", "[]"))
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid JSON format for language or expertise"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # بررسی موجودیت کاربر
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # ایجاد نمونه پروژه
            project = EducationProject.objects.create(
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

            return Response(
                {"message": "Project created successfully", "project_id": project.id},
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ShowTenderProject(ListAPIView):
    queryset = TenderProject.objects.all()
    serializer_class = CustomTenderSerializers

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    # def get_object(self):
    #     return super().get_object()


class GetBidTender(APIView):
    def get(self, request: Request):
        tenders = TenderProject.objects.all().order_by("-created_at")
        data = []

        for tender in tenders:
            bids = Bid.objects.filter(tender=tender)  # دریافت بیدهای مرتبط با هر تندر
            data.append(
                {
                    "tender": CustomTenderSerializers(
                        tender, context={"request": request}
                    ).data,
                    "bids": BidSerializers(bids, many=True).data,
                }
            )

        return Response({"results": data}, status=status.HTTP_200_OK)


class ProjectImageViewSet(ModelViewSet):
    queryset = ProjectImage.objects.all()
    serializer_class = ProjectImageSerializer


class TenderLikeHandlerAPIView(APIView, TenderService):
    def get(self, request: Request, tender_uuid: str):
        return self.toggle_tender_like_handler(request.user, tender_uuid)


class GetAllClassDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):
        all_educations = EducationProject.objects.filter(created_by=request.user)
        return Response(ProjectSerializer(all_educations, many=True).data)


class EducationTenderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request):

        # دریافت لیست پروژه‌های آموزشی
        tender_projects_public = TenderProject.objects.filter(
            created_by=request.user,
            project__is_tender=True,
            project__type_class="public",
        ).order_by("-created_at")
        tender_projects_private = TenderProject.objects.filter(
            created_by=request.user,
            project__is_tender=True,
            project__type_class="private",
        ).order_by("-created_at")
        if not tender_projects_public.exists() and not tender_projects_private.exists():
            return Response(
                {"message": "No educational projects found."},
                status=status.HTTP_200_OK,
            )
        serializer_public = TenderSerializers(
            tender_projects_public, many=True, context={"request": request}
        )
        serializer_private = TenderSerializers(
            tender_projects_private, many=True, context={"request": request}
        )
        return Response(
            {"public": serializer_public.data, "private": serializer_private.data},
            status=status.HTTP_200_OK,
        )


# class UserTenderListView(APIView):


@extend_schema(
    tags=["tender"],
    summary="علامت گذاری پیشنهاد به عنوان دیده شده",
    request=inline_serializer(
        name="HandleSeenBidSerializer",
        fields={
        "bid_id":serializers.IntegerField(help_text="شناسه پیشنهاد", required=True),
        }
    ),
)
class HandleSeenBid(APIView, TenderService):
    permission_classes = [IsAuthenticated]
    def post(self, request: Request,bid_id:str):
        return self.handle_seen_bid(bid_id,request.user)
     


class UserJoinedClassesAPIView(APIView,TenderService):
    def get(self,request:Request):
        return self.get_all_active_user_class(request.user)
    


class AcceptUserBid(APIView,TenderService):
    permission_classes=[IsAuthenticated]
    def post(self,request:Request,bid_id:int):
        user_uuid = request.data.get('uuid')
        return self.accept_user(user_uuid,bid_id)