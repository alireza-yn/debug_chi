from rest_framework.viewsets import ModelViewSet, ViewSet

# from .models import  *
from .serializers import *
from auths.models import Role
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
import json
from django.db import transaction

User = get_user_model()
from rest_framework import status


class UserResumeViewSet(ModelViewSet):
    queryset = UserResume.objects.all()
    serializer_class = UserResumeSerializer


class VideoResumeViewSet(ModelViewSet):
    queryset = VideoResume.objects.all()
    serializer_class = VideoResumeSerializer


class UserLanguageViewSet(ModelViewSet):
    queryset = UserLanguage.objects.all()
    serializer_class = UserLanguageSerializer


class UserSkillViewSet(ModelViewSet):
    queryset = UserSkill.objects.all()
    serializer_class = UserSkillSerializer


class UserDegreeViewSet(ModelViewSet):
    queryset = UserDegree.objects.all()
    serializer_class = UserDegreeSerializer


class UserSocialMediaLinksViewSet(ModelViewSet):
    queryset = UserSocialMediaLinks.objects.all()
    serializer_class = UserSocialMediaLinksSerializer


class UserExpertiseViewSet(ModelViewSet):
    queryset = UserExpertise.objects.all()
    serializer_class = UserExpertiseSerializer


class AddUserResume(ViewSet):
    def create(self, request: Request):
        user_id = request.user.id
        programmer = request.data.get("programmer")

        language = json.loads(request.data.get("language", "[]"))
        skill = json.loads(request.data.get("skill", "[]"))
        expertise = json.loads(request.data.get("expertise", "[]"))
        cv_file = request.data.get("cv_file")
        cv_title = request.data.get("cv_title")
        cv_description = request.data.get("cv_description")
        user = User.objects.get(id=user_id)
        print(cv_file, cv_description, cv_title, user_id)
        try:
            # استفاده از transaction برای atomic بودن عملیات
            with transaction.atomic():
                # پردازش زبان‌ها
                if language:
                    for item in language:
                        p = ProgrammingLanguage.objects.get(id=item)
                        UserLanguage.objects.update_or_create(
                            user=user, language_name=p
                        )

                # پردازش مهارت‌ها
                if skill:
                    for item in skill:
                        p = ProgrammerSkill.objects.get(id=item)
                        UserSkill.objects.update_or_create(user=user, skill_name=p)

                # پردازش تخصص‌ها (ManyToMany)
                if expertise:
                    expertise_objects = ProgrammerExpertise.objects.filter(
                        id__in=expertise
                    )
                    user_expertise, created = UserExpertise.objects.update_or_create(
                        user=user
                    )
                    user_expertise.expertise.set(expertise_objects)

                # به‌روزرسانی یا ایجاد رزومه
                UserResume.objects.update_or_create(
                    user=user,
                    defaults={
                        "user": user,
                        "title": cv_title,
                        "description": cv_description,
                        "cv_file": cv_file,
                    },
                )
                User.objects.filter(id=user_id).update(intro_completed=True)
            return Response(
                {"success": True, "message": "Resume successfully updated or created."}
            )
        except TypeError as e:
            return Response({"success": False, "error": str(e)})


class UserPortfolioViewSet(ModelViewSet):
    queryset = UserPortfolio.objects.all()
    serializer_class = UserPortfolioSerializer


class UserPortfolioImageViewSet(ModelViewSet):
    queryset = UserPortfolioImage.objects.all()
    serializer_class = UserPortfolioImageSerializer


class UserJobHistoryViewSet(ModelViewSet):
    queryset = UserJobHistory.objects.all()
    serializer_class = UserJobHistorySerializer

class AddLanguageForUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        language_id = request.data.get("language_id")

        if not language_id:
            return Response({"success": False, "message": "language_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        language = ProgrammingLanguage.objects.filter(id=language_id).first()
        if not language:
            return Response({"success": False, "message": "Invalid language_id"}, status=status.HTTP_404_NOT_FOUND)

        user_language, created = UserLanguage.objects.update_or_create(
            user=request.user, language_name=language
        )

        return Response(
            {"success": True, "created": created},
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )