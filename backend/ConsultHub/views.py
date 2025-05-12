from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .service import *
from django.db.models import Q

from core.permissions import *


class ConsultHubView(ModelViewSet):
    queryset = ConsultSession.objects.all()
    serializer_class = ConsultSerializer

class DebuggerHubView(ModelViewSet):
    queryset = DebugSession.objects.all().order_by("-created_at")
    serializer_class = DebuggerSerializer


class DebuggerApplicatorView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = DebuggerSerializer

    def get_queryset(self):
        return DebugSession.objects.filter(
            models.Q(debuger=self.request.user)
            | models.Q(debuger_applicator=self.request.user)
        ).order_by("created_at")


class RequestDebugeFromUsers(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = DebuggerSerializer

    def get_queryset(self):
        return DebugSession.objects.filter(
            Q(debuger=self.request.user) | Q(debuger_applicator=self.request.user)
        ).order_by("created_at")


class AcceptDebugSession(APIView, DebugHubService):
    permission_classes = [IsAuthenticated, IsDebugger]

    def get(self, request: Request):
        return self.AcceptSessionBySessionId(request)


class OpenedDebugSession(APIView, DebugHubService):
    permission_classes = [IsAuthenticated]
    check_roles = RoleMixin()

    def get(self, request: Request):
        if self.check_roles.has_role(request.user, "debugger"):
            return self.OpenedSessionBySessionId(request)
        else:
            return self.OpenedSessionBySessionIdForNormalUser(request)


class PendingSession(APIView, DebugHubService):
    permission_classes = [IsAuthenticated, IsDebugger]

    def get(self, request: Request):
        return self.PendingSessionBySessionId(request)


class GetDebugerSession(ListAPIView, DebugHubService):
    permission_classes = [IsAuthenticated, IsDebugger]
    serializer_class = DebuggerSerializer

    def get_queryset(self):
        return self.getUserSession(self.request)


class UserOpendDebugList(ListAPIView, ConsultHubService):
    serializer_class = DebuggerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.getOpenedSession(self.request.user)


class GetSessionInfo(APIView, ConsultHubService):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, session_id: str):
        return self.getSessionInfoBySessionId(request, session_id)


class GetDebugerRequest(APIView, ConsultHubService):
    def get(self, request: Request):
        user = self.request.user.is_authenticated
        if user:
            return self.getAllRequest(user)
        else:
            return Response(
                {"success": False, "message": "عدم دسترسی"},
                status=status.HTTP_401_UNAUTHORIZED,
            )




class SessionHandlerAPIView(APIView,ConsultHubService):
    def post(self,request:Request):
        user = self.request.user.is_authenticated
        if user:
            return self.session_handler(request=request,user=user)
        else:
           return Response(
                {"success": False, "message": "عدم دسترسی"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LockSession(APIView, ConsultHubService):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        session_id = request.data.get("session_id")
        return self.LockSession(session_id)


class CloseSession(APIView, ConsultHubService):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        session_id = request.data.get("session_id")
        return self.close_session(session_id)


class RejectSession(APIView, ConsultHubService):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        session_id = request.data.get("session_id")
        return self.reject_session(session_id=session_id, user=request.user)


class AllDebugersAndConsulters(APIView, ConsultHubService):
    def get(self, request: Request):
        return self.get_all_debugers(request)


class TemporarySession(APIView,DebugHubService):
    permission_classes = [IsAuthenticated]
    def get(self, request: Request):
        temporary_session = DebugSession.objects.create(
            debuger=request.user, debuger_applicator=request.user
        )
        return Response({
            "data":"ads"
        })