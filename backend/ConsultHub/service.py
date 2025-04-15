from .models import ConsultSession, DebugSession
from django.contrib.auth import get_user_model
import requests
from rest_framework.request import Request
from rest_framework.response import Response
from django.db import transaction
from .serializers import DebuggerSerializer, ConsultSerializer,UserSerializer
from django.db.models import Q
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

    def getSessionInfoBySessionId(self, request: Request, session_id: str):

        user = User.objects.get(id=request.user.id)
        print(user)

        is_debuger = False
        if hasattr(user, "debuger"):
            is_debuger = True

        try:
            print(f"session_id: {session_id}")
            session = (
                DebugSession.objects.filter(session_id=session_id).first()
                or ConsultSession.objects.filter(session_id=session_id).first()
            )

            if not session:
                return Response({"error": "Session not found"}, status=404)

            print(f"session type: {type(session)}")
            if isinstance(session, DebugSession):
                serializer = DebuggerSerializer(session)
            else:
                serializer = ConsultSerializer(session)

            return Response(
                {
                    "is_debuger": is_debuger,
                    "data": serializer.data
                }
            )

        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response({"error": "Internal server error"}, status=500)


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
        pending_debug = DebugSession.objects.filter(
            debuger=request.user, status="pending"
        ).all()
        pending_consult = ConsultSession.objects.filter(
            consult=request.user, status="pending"
        ).all()
        if pending_debug or pending_consult:
            return Response(
                {
                    "pending_debug": DebuggerSerializer(pending_debug, many=True).data,
                    "pending_consult": ConsultSerializer(
                        pending_consult, many=True
                    ).data,
                }
            )
        else:
            return Response({"message": "there is no pending session"})



    def OpenedSessionBySessionId(self, request: Request):
        user = request.user
        opened_debug = DebugSession.objects.filter(
            Q(debuger=user, status="open") | Q(debuger=user, status="pending")
        )
        opened_consult = ConsultSession.objects.filter(
            Q(consult=user, status="open") | Q(consult=user, status="pending")
        )
        if opened_debug.exists() or opened_consult.exists():
            return Response({
                "opened_debug": DebuggerSerializer(opened_debug, many=True).data,
                "opened_consult": ConsultSerializer(opened_consult, many=True).data,
            })
        else:
            return Response(
                {"message": "There is no opened session."},
                status=status.HTTP_204_NO_CONTENT
            )
   
    def RejectSession(self, session_id):
        pass
