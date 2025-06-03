from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.request import Request
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import *
from rest_framework import serializers
# from .serializers_services.userSerializers import UserSerializers as testSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import random
from drf_spectacular.utils import extend_schema_view, extend_schema,inline_serializer
from .services import UserService
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import IsStaffPermission, IsDebuggerPermission
from .models import DebuggerExam, DebuggerExamScore
import json
import os




class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes=[IsAdminUser,IsStaffPermission]


class GetUserData(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class RoleViewSet(ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer



class CustomLoginView(APIView, UserService):
    def post(self, request: Request):
        phone = request.data.get("phone")
        if not phone:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self.create_user_by_phone(phone=phone)


class AdminLoginView(APIView, UserService):
    def post(self, request: Request):
        return self.admin_login(request=request)


class UserLoginView(APIView, UserService):
    def post(self, request):
        return self.user_login(request=request)


class OTPView(APIView, UserService):
    def post(self, request: Request):
        otp_code = request.data.get("otp")
        if otp_code is None :
            return Response(
                {"error": "phone or otp is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return self.activate_user(otp_code=otp_code)


class UserRegister(APIView, UserService):
    def post(self, request):
        return self.create_user(request)


class UserBankCardsListCreateView(ListCreateAPIView, UserService):
    queryset = UserBankCards.objects.all()
    serializer_class = UserBankCardsSerializers
    # permission_classes = [IsAuthenticated]
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
        
    #     card_number = serializer.validated_data.get('card_number')
    #     created, message = self.add_bank_card(card_number=card_number, user=request.user)
        
    #     if created:
    #         self.perform_create(serializer)
    #         return Response({"success":created,"message": message}, status=status.HTTP_201_CREATED)
    #     else:
    #         return Response({"success":created,"message": message}, status=status.HTTP_400_BAD_REQUEST)

class UserBankCardApiView(APIView,UserService):
    permission_classes= [IsAuthenticated]
    def post(self, request: Request):




        title = request.data.get('title')
        card_number = request.data.get("card_number")
        created, message,data = self.add_bank_card(card_number=card_number, title=title,user=request.user)
        print(created,message)
        if created:
            return Response({"success": created, "message": message,"data":data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"success": created, "message": message}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request: Request):
        card_id = request.query_params.get('card_id')
        if not card_id:
            return Response({"success": False, "message": "شناسه کارت ارسال نشده است."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            card_id = int(card_id)
        except ValueError:
            return Response({"success": False, "message": "شناسه کارت نامعتبر است."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        success, message = self.delete_bank_card(card_id=card_id, user=user)

        if success:
            return Response({"success": success, "message": message}, status=status.HTTP_204_NO_CONTENT)

        return Response({"success": success, "message": message}, status=status.HTTP_400_BAD_REQUEST)


class UsersByRoleView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            debugger_role = Role.objects.get(name='debugger')
            consultants_role = Role.objects.get(name='consultant')

            users = CustomUser.objects.filter(
                user_roles__in=[debugger_role, consultants_role]
            ).distinct()

            serializer = CustomUserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Role.DoesNotExist:
            return Response({"error": "Role not found."}, status=status.HTTP_400_BAD_REQUEST)

class CreateResetPasswordLinkApiView(APIView,UserService):
    
    def post(self,request:Request):
        phone = request.data.get('phone')
        return self.create_reset_password_link(phone)


class CodeVerification(APIView,UserService):
    
    def post(self,request:Request):
        code = request.data.get('code')
        return self.code_verification(code=code)


class ResetPasswordApiView(APIView,UserService):
    
    def post(self,request:Request):
        token = request.data.get('token')
        password = request.data.get('password')
        return self.reset_user_password(token,password)

@extend_schema(
    tags=["auths"],
    summary="ثبت نام کاربران دیباگر",
    description="ارسال کنید post بصورد متد body برای ثبت نام کاربر دیباگر اطلاعات زیر را در بخش  ",
    request=RegisterSerializers,
)
class RegisterDebugerApiView(APIView,UserService):
    def post(self,request:Request):
        return self.regitser_debuger(request)

class GetDebuggerExam(APIView):
    permission_classes = [IsAuthenticated, IsDebuggerPermission]
    
    def get(self, request):
        """Get the debugger qualification exam"""
        try:
            # خواندن فایل JSON سوالات با encoding مناسب
            exam_path = os.path.join(os.path.dirname(__file__), "../debugger_exam.json")
            with open(exam_path, 'r', encoding='utf-8') as f:
                exam_data = json.load(f)
            return Response(exam_data)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class SubmitDebuggerExam(APIView):
    permission_classes = [IsAuthenticated, IsDebuggerPermission]
    
    def post(self, request):
        """Submit exam answers and get score"""
        try:
            # خواندن سوالات با encoding مناسب
            exam_path = os.path.join(os.path.dirname(__file__), "../debugger_exam.json")
            with open(exam_path, 'r', encoding='utf-8') as f:
                exam_data = json.load(f)
            
            # محاسبه نمره
            score = 0
            answers_dict = {}
            
            for answer in request.data.get('answers', []):
                question = next((q for q in exam_data['questions'] if q['id'] == answer['question_id']), None)
                if not question:
                    continue
                    
                answers_dict[answer['question_id']] = answer['answer']
                
                if answer['answer'] == question['correct_answer']:
                    score += question['points']
            
            # ایجاد یا به‌روزرسانی آزمون
            exam, _ = DebuggerExam.objects.get_or_create(
                title="Debugger Qualification Exam",
                defaults={
                    'description': "Initial debugger qualification exam",
                    'passing_score': 7,
                    'time_limit_minutes': 30
                }
            )
            
            # ذخیره نمره
            exam_score, created = DebuggerExamScore.objects.update_or_create(
                debugger=request.user,
                exam=exam,
                defaults={
                    'score': score,
                    'passed': score >= exam_data['passing_score'],
                    'answers': answers_dict
                }
            )
            
            return Response({
                "score": score,
                "passed": score >= exam_data['passing_score'],
                "passing_score": exam_data['passing_score']
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GetDebuggerExamScores(APIView):
    permission_classes = [IsAuthenticated, IsDebuggerPermission]
    
    def get(self, request):
        """Get all exam scores for the current debugger"""
        try:
            scores = DebuggerExamScore.objects.filter(debugger=request.user).order_by('-taken_at')
            
            if not scores.exists():
                return Response({
                    "message": "هنوز هیچ آزمونی انجام نداده‌اید",
                    "scores": []
                })
            
            result = []
            for score in scores:
                result.append({
                    "exam_title": score.exam.title,
                    "score": score.score,
                    "passed": score.passed,
                    "passing_score": score.exam.passing_score,
                    "date": score.taken_at,
                    "answers": score.answers
                })
            
            return Response({
                "scores": result
            })
            
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
