# from rest_framework import serializers
# from .models import Category, Section, Question, Answer


# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = "__all__"


# class SectionSerializer(serializers.ModelSerializer):
#     # category = CategorySerializer()  # نمایش اطلاعات کامل دسته‌بندی

#     class Meta:
#         model = Section
#         fields = ["id", "number", "category"]


# class QuestionSerializer(serializers.ModelSerializer):
#     # section = SectionSerializer()  # نمایش اطلاعات کامل سکشن

#     class Meta:
#         model = Question
#         fields = [
#             "id",
#             "section",
#             "text",
#             'description',
#             "sound",
#             "active",
#             "question_type",
#         ]


# class AnswerSerializer(serializers.ModelSerializer):
#     # question = QuestionSerializer()  # نمایش اطلاعات کامل سوال

#     class Meta:
#         model = Answer
#         fields = "__all__"
from rest_framework import serializers
from .models import Category, Section, Question, Answer


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = '__all__'