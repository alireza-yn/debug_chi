from .models import ConsultSession,DebugSession
from django.contrib.auth import get_user_model
import requests
from rest_framework.request import Request
from rest_framework.response import Response
from django.db import transaction

User = get_user_model()

class ConsultHubService:
    def getOpenedSession(self,user_id):
        debugger = DebugSession.objects.filter(debuger=user_id,status='open').all()
        if debugger:
            return debugger
        else:
            return DebugSession.objects.filter(debuger_applicator=user_id,status='open').all()
    



class DebugHubService:
    def AcceptSession(self, session_id):
        try:
            with transaction.atomic():
                session = DebugSession.objects.select_for_update().get(session_id=session_id)
                if session.status == "pending":
                    user = User.objects.select_for_update().get(id=session.debuger_applicator.id)
                    print(user.digital_wallet, session.debuger.uuid, session.debuger_applicator.uuid)

                    if user.digital_wallet < session.price:
                        return "اعتبار کافی نیست", False  # بررسی قبل از ارسال درخواست

                    try:
                        res = requests.post('http://localhost:3000/api/chat/create', json={
                            'session_id': str(session_id),
                            'debuger': str(session.debuger.uuid),
                            'applicator': str(session.debuger_applicator.uuid)
                        })
                        res.raise_for_status()

                        # فقط اگر درخواست موفق بود (کد وضعیت 201)
                        if res.status_code == 201:
                            session.status = 'open'
                            session.save()
                            user.digital_wallet -= session.price
                            user.save()
                            print("fully worked")
                            return "Session accepted successfully", True
                        else:
                            return f"Failed to create chat session (Status: {res.status_code})", False

                    except requests.exceptions.RequestException as e:
                        print(f"Request failed: {e}")
                        return "Failed to create chat session", False
        except DebugSession.DoesNotExist:
            print("Session not found")
            return "Session not found", False
        except User.DoesNotExist:
            print("User not found")
            return "User not found", False
    
    
    
    def AcceptSessionBySessionId(self,request:Request):
        return Response({
            "welcome":"your access is successfully"
        }) 
        
   
    def getUserSession(self,request:Request):
        session = DebugSession.objects.filter(debuger=request.user)
        return session
    
    def RejectSession(self,session_id):
        pass
    
    
   
            