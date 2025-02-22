from .models import Bid, TenderProject
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.request import Request
from django.shortcuts import get_object_or_404


User = get_user_model()


class TenderService:
    def start_tender(self):
        pass

    def won_tender(self):
        pass

    def stop_tender(self):
        pass

    def tender_users_list(self, tender_id):
        if not tender_id:
            return Response({"error": "tender_id is required"}, status=400)

        tender = get_object_or_404(TenderProject, id=tender_id)
        
        # دریافت پیشنهادات مرتبط با این مناقصه و کاربران آن
        bids = Bid.objects.filter(tender=tender).select_related('user')

        users_data = [
            {
                "id": bid.user.id,
                "full_name":f"{bid.user.first_name} {bid.user.last_name}",
                "username": bid.user.username,
                "email": bid.user.email,
                "bid_amount": bid.amount 
            }
            for bid in bids
        ]
        
        return Response({
            "tender_id":tender.id,
            "title":tender.title,
            "description":tender.description,
            "start_time":tender.start_time,
            "end_time":tender.end_time,
            "created_by":f"{tender.created_by.first_name} {tender.created_by.last_name}",
            "start_bid":tender.start_bid,
            "tender_users": users_data
        })
        
    