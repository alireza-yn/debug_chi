from rest_framework.serializers import ModelSerializer
from .models import *
from programming_language.serializers import ProgrammingLanguageSerializer,ProgrammerExpertiseSerializer
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
    expertise = ProgrammerExpertiseSerializer(many=True,read_only=True)
    
    class Meta:
        model = UserExpertise
        fields = ['id','expertise','created_at','updated_at']



class UserPortfolioImageSerializer(ModelSerializer):
    class Meta:
        model = UserPortfolioImage
        fields = '__all__'


class UserPortfolioSerializer(ModelSerializer):
    images = UserPortfolioImageSerializer(many=True, read_only=True)

    class Meta:
        model = UserPortfolio
        fields = ['id', 'name', 'owner','description', 'created_at','updated_at','images']


class UserJobHistorySerializer(ModelSerializer):
    class Meta:
        model = UserJobHistory
        fields = '__all__'