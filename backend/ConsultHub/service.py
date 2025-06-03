from .models import ConsultSession, DebugSession
from django.contrib.auth import get_user_model
import requests
from rest_framework.request import Request
from rest_framework.response import Response
from django.db import transaction
from .serializers import DebuggerSerializer, ConsultSerializer, UserSerializer
from django.db.models import Q
from followers.models import UserComments
User = get_user_model()
from rest_framework import status


class ConsultHubService:
    def getOpenedSession(self, user_id):

        debugger = DebugSession.objects.filter(debuger=user_id, status="open").all()
        if debugger:
            return debugger
        else:
            return DebugSession.objects.filter(
                debuger_applicator=user_id, status="open"
            ).all()

    def getAllRequest(self, user):
        debug = DebugSession.objects.filter(debuger=user,rejected_by__isnull=True).all()
        consult = ConsultSession.objects.filter(consult=user,rejected_by__isnull=True).all()

        return Response(
            {
                "consult": ConsultSerializer(consult, many=True).data,
                "debug": DebuggerSerializer(debug, many=True).data,
            }
        )

    def getSessionInfoBySessionId(self, request: Request, session_id: str):

        user = User.objects.get(id=request.user.id)
        print(user)

        roles = user.user_roles.all()
        is_debuger = roles.filter(name="debugger").exists()

        try:
            print(f"session_id: {session_id}")
            session = (
                DebugSession.objects.filter(session_id=session_id).first()
                or ConsultSession.objects.filter(session_id=session_id).first()
            )

            if not session:
                return Response({"error": "Session not found"}, status=404)

            if isinstance(session, DebugSession):
                serializer = DebuggerSerializer(session)
            else:
                serializer = ConsultSerializer(session)

            
            commented = UserComments.objects.filter(session_id=session.session_id,commented_user=user)
            commented.first()
            is_commented_exist = commented.exists()
            print(commented,is_commented_exist)

            return Response({"is_debuger": is_debuger, "data": serializer.data,"is_commented":is_commented_exist})

        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response({"error": "Internal server error"}, status=500)

    def LockSession(self, session_id):
        if session_id is None:
            return Response({"error": "session_id is required"})
        session = (
            DebugSession.objects.filter(session_id=session_id).first()
            or ConsultSession.objects.filter(session_id=session_id).first()
        )
        session.is_locked = True
        session.save()
        return Response({"success": True, "message": "با موفقیت انجام شد"})
   
    def close_session(self, session_id):
        session = (
            DebugSession.objects.filter(session_id=session_id).first()
            or ConsultSession.objects.filter(session_id=session_id).first()
        )
        session.status = "close"
        session.save()
        return Response({"success": True}, status=status.HTTP_200_OK)

    def reject_session(self,session_id,user):
        
        find_session_to_reject = DebugSession.objects.filter(session_id=session_id).first() or ConsultSession.objects.filter(session_id=session_id).first()
        if find_session_to_reject is None:
            return Response({
                "success":False,
                "message":"جلسه مورد نظر پیدا نشد"
            })
        user_wants_to_reject = User.objects.filter(id=user.id).first()
        if user_wants_to_reject is None:
            return Response({
                "success":False,
                "message":"کاربر پیدا نشد"
            }) 

        find_session_to_reject.is_rejected = True
        find_session_to_reject.rejected_by = user_wants_to_reject
        find_session_to_reject.save()
        return Response({
            "success":True,
            "message":"با موفقیت بسته شد"
        })
    
    def session_handler(self,request:Request,user):
        action = request.data.get('action')
        session_id = request.data.get('session_id')
        find_session_to_reject = DebugSession.objects.filter(session_id=session_id).first() or ConsultSession.objects.filter(session_id=session_id).first()
        if action is None:
            return Response({
                "action":"این فیلد برای اجرا نیاز است"
            },status=status.HTTP_400_BAD_REQUEST)
        
        elif session_id is None:
            return Response({
                "session_id":"این فیلد برای اجرا نیاز است"
            },status=status.HTTP_400_BAD_REQUEST)
        
        if action == "reject":
            find_session_to_reject.rejected_by = user
            find_session_to_reject.save()

            return Response({
                "success":True,
                "message":"عملیات با موفقیت انجام شد"
            },status=status.HTTP_201_CREATED)
        else:
            return Response({
                "success":False,
                "message":"عملیات شما با خطا مواجه شد دوباره اقدام کنید"
            })
        


            

 


class DebugHubService:
    def AcceptSession(self, session_id):
        try:
            with transaction.atomic():
                session = DebugSession.objects.select_for_update().get(
                    session_id=session_id
                )
                if session.status == "pending":
                    user = User.objects.select_for_update().get(
                        id=session.debuger_applicator.id
                    )
                    print(
                        user.digital_wallet,
                        session.debuger.uuid,
                        session.debuger_applicator.uuid,
                    )

                    if user.digital_wallet < session.price:
                        return "اعتبار کافی نیست", False  # بررسی قبل از ارسال درخواست

                    try:
                        res = requests.post(
                            "http://localhost:3000/api/chat/create",
                            json={
                                "session_id": str(session_id),
                                "debuger": str(session.debuger.uuid),
                                "applicator": str(session.debuger_applicator.uuid),
                            },
                        )
                        res.raise_for_status()

                        # فقط اگر درخواست موفق بود (کد وضعیت 201)
                        if res.status_code == 201:
                            session.status = "open"
                            session.save()
                            user.digital_wallet -= session.price
                            user.save()
                            print("fully worked")
                            return "Session accepted successfully", True
                        else:
                            return (
                                f"Failed to create chat session (Status: {res.status_code})",
                                False,
                            )

                    except requests.exceptions.RequestException as e:
                        print(f"Request failed: {e}")
                        return "Failed to create chat session", False
        except DebugSession.DoesNotExist:
            print("Session not found")
            return "Session not found", False
        except User.DoesNotExist:
            print("User not found")
            return "User not found", False

    def AcceptSessionBySessionId(self, request: Request):
        return Response({"welcome": "your access is successfully"})

    def getUserSession(self, request: Request):
        session = DebugSession.objects.filter(debuger=request.user)
        return session

    def PendingSessionBySessionId(self, request: Request):
        # جلسات pending برای دیباگر
        pending_debug_for_debugger = DebugSession.objects.filter(
            debuger=request.user, status="pending", is_rejected=False
        ).all()
        
        # جلسات pending برای درخواست‌دهنده
        pending_debug_for_applicator = DebugSession.objects.filter(
            debuger_applicator=request.user, status="pending", is_rejected=False
        ).all()
        
        # جلسات مشاوره pending برای مشاور
        pending_consult = ConsultSession.objects.filter(
            consult=request.user, status="pending", is_rejected=False
        ).all()
        
        # ترکیب نتایج
        pending_debug = pending_debug_for_debugger | pending_debug_for_applicator
        
        if pending_debug or pending_consult:
            return Response(
                {
                    "pending_debug": DebuggerSerializer(pending_debug, many=True).data,
                    "pending_consult": ConsultSerializer(pending_consult, many=True).data,
                }
            )
        else:
            return Response({"pending_debug": [], "pending_consult": []})

    def OpenedSessionBySessionId(self, request: Request):
        user = request.user

        opened_debug = DebugSession.objects.filter(
            Q(debuger=user) & Q(status__in=["open", "pending"]) & Q(is_rejected=False)
        )
        opened_consult = ConsultSession.objects.filter(
            Q(consult=user) & Q(status__in=["open", "pending"]) & Q(is_rejected=False)
        )

        if opened_debug.exists() or opened_consult.exists():
            return Response(
                {
                    "opened_debug": DebuggerSerializer(opened_debug, many=True).data,
                    "opened_consult": ConsultSerializer(opened_consult, many=True).data,
                }
            )
        else:
            return Response(
                {"message": "There is no opened session."},
                status=status.HTTP_204_NO_CONTENT,
            )
    def OpenedSessionBySessionIdForNormalUser(self, request: Request):
        user = request.user

        opened_debug = DebugSession.objects.filter(
            Q(debuger_applicator=user) & Q(status__in=["open", "pending"]) & Q(is_rejected=False)
        )
        opened_consult = ConsultSession.objects.filter(
            Q(consult_applicator=user) & Q(status__in=["open", "pending"]) & Q(is_rejected=False)
        )

        if opened_debug.exists() or opened_consult.exists():
            return Response(
                {
                    "opened_debug": DebuggerSerializer(opened_debug, many=True).data,
                    "opened_consult": ConsultSerializer(opened_consult, many=True).data,
                }
            )
        else:
            return Response(
                {"message": "There is no opened session."},
                status=status.HTTP_204_NO_CONTENT,
            )

    def RejectSession(self, session_id):
        pass

    def create_temporary_session(self,user):
        debuggers = User.objects.filter(user_roles__name="debugger").distinct()
        
