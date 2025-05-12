from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import EducationProject, TenderProject, Bid, ProjectImage,TenderLikes
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







class TenderLikeSerializer(ModelSerializer):
    class Meta:
        model = TenderLikes
        fields = ['user','tender']


class CustomBidSerializers(ModelSerializer):
    user = CustomUserSerializer()
    class Meta:
        model = Bid
        fields = ["id", "user", "amount"]


class ProjectSerializer(ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    # language = ProgrammingLanguageSerializer(many=True)
    # expertise = ProgrammerExpertiseSerializer(many=True)
    # created_by = CustomUserSerializer()
    # users = CustomUserSerializer(many=True,read_only=True)
    # bids = CustomBidSerializers(many=True, read_only=True)
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
            "is_tender"
            
        ]
class BidSerializers(ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "user", "amount", "created_at", "updated_at", "tender"]



class TenderSerializers(ModelSerializer):
    # tender_like = TenderLikeSerializer(many=True,read_only=True)
    tender_like = SerializerMethodField()
    bids = BidSerializers(many=True,read_only=True)
    class Meta:
        model = TenderProject
        fields = [
            "id",
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
            "mode",
            "tender_like",
            "bids"
            
        ]
        # depth = 1
    def get_tender_like(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return TenderLikes.objects.filter(user=user, tender=obj).exists()
        return False


class CustomTenderSerializers(ModelSerializer):
    created_by = CustomUserSerializer()
    project = ProjectSerializer(read_only=True)
    tender_like = SerializerMethodField()
    tender_like_count = SerializerMethodField()

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
            "tender_like",
            "tender_like_count"
        ]
        depth = 2

    def get_tender_like(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return TenderLikes.objects.filter(user=user, tender=obj).exists()
        return False
    

    def get_tender_like_count(self, obj):
        return TenderLikes.objects.filter(tender=obj).count()
    


