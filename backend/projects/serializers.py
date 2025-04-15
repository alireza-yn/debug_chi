from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import EducationProject, TenderProject, Bid, ProjectImage
from programming_language.serializers import (
    ProgrammingLanguageSerializer,
    ProgrammerExpertiseSerializer,
)
from rest_framework.exceptions import ValidationError
from auths.serializers import CustomUserSerializer

from auths.serializers import CustomUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectImageSerializer(ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ["id", "image", "project"]


class ProjectSerializer(ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    # language = ProgrammingLanguageSerializer(many=True)
    # expertise = ProgrammerExpertiseSerializer(many=True)
    # created_by = CustomUserSerializer()
    # users = CustomUserSerializer(many=True,read_only=True)

    class Meta:
        model = EducationProject
        fields = [
            "id",
            "type_class",
            "class_session",
            "class_title",
            "images",
            "description",
            "educational_heading",
            "educational_heading_file",
            "price",
            "discount",
            "created_at",
            "updated_at",
            "start_date",
            "end_date",
            "buffer_date",
            "is_deleted",
            "language",
            "expertise",
            "users",
            "created_by",
            "is_tender",
        ]


class TenderSerializers(ModelSerializer):

    class Meta:
        model = TenderProject
        fields = [
            "uuid",
            "active",
            "title",
            "description",
            "image",
            "project",
            "start_time",
            "end_time",
            "created_by",
            "start_bid",
            "highest_bid",
            "winner",
            "language",
            "expertise",
            "skills",
            "mode"
        ]
        # depth = 1


class BidSerializers(ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "user", "amount", "created_at", "updated_at", "tender"]


class CustomTenderSerializers(ModelSerializer):
    created_by = CustomUserSerializer()
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = TenderProject
        fields = [
            "id",
            "uuid",
            "created_by",
            "active",
            "title",
            "description",
            "image",
            "project",
            "start_time",
            "end_time",
            "start_bid",
            "highest_bid",
            "winner",
            "language",
            "skills",
            "mode",
        ]
        depth = 2


class CustomBidSerializers(ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Bid
        fields = ["id", "user", "amount"]
