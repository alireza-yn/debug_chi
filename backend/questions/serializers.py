from rest_framework import serializers
from .models import *




class AnswersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id','text','description']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswersSerializer(many=True,read_only=True)
    class Meta:
        model = Question
        fields = ['id','text','sound','answers']


class CateogrySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True,read_only=True)
    class Meta:
        model = Category
        fields = ['id','name','questions']
        