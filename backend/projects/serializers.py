from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import EducationPeoject, TenderProject, Bid
from programming_language.serializers import (
    ProgrammingLanguageSerializer,
    ProgrammerExpertiseSerializer,
)
from rest_framework.exceptions import ValidationError
from auths.serializers import CustomUserSerializer

from auths.serializers import CustomUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectSerializer(ModelSerializer):
    language = ProgrammingLanguageSerializer(many=True)
    expertise = ProgrammerExpertiseSerializer(many=True)
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = EducationPeoject
        fields = [
            "id",
            "type_class",
            "class_session",
            "educational_heading",
            "description",
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
            "user",
        ]


class TenderSerializers(ModelSerializer):

    class Meta:
        model = TenderProject
        fields = "__all__"
        # depth = 1


class BidSerializers(ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Bid
        fields = ['id','user','amount','created_at','updated_at','tender']


class CustomTenderSerializers(ModelSerializer):
    created_by = CustomUserSerializer()

    class Meta:
        model = TenderProject
        fields = [
            'id',
            "created_by" ,
            "active",
            "title",
            "description",
            "image",
            "file",
            "start_time",
            "end_time",
            "start_bid",
            "highest_bid",
            "winner",
            "language",
            "skills",
        ]
        depth = 2


class CustomBidSerializers(ModelSerializer):
    user = CustomUserSerializer()

    class Meta:
        model = Bid
        fields = ["id", "user", "amount"]
