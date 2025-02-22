from rest_framework.serializers import ModelSerializer
from .models import *
from programming_language.serializers import ProgrammingLanguageSerializer
class UserResumeSerializer(ModelSerializer):
    class Meta:
        model = UserResume
        fields = '__all__'
        
class VideoResumeSerializer(ModelSerializer):
    class Meta:
        model = VideoResume
        fields = '__all__'


class UserLanguageSerializer(ModelSerializer):
    language_name = ProgrammingLanguageSerializer()
    class Meta:
        model = UserLanguage
        fields = ['language_name']
    

class UserSkillSerializer(ModelSerializer):
    class Meta:
        model = UserSkill
        fields = '__all__'

class UserDegreeSerializer(ModelSerializer):
    class Meta:
        model = UserDegree
        fields = '__all__'

class UserSocialMediaLinksSerializer(ModelSerializer):
    class Meta:
        model = UserSocialMediaLinks
        fields = '__all__'

class UserExpertiseSerializer(ModelSerializer):
    class Meta:
        model = UserExpertise
        fields = '__all__'