from .models import Bid, TenderProject,TenderLikes
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.request import Request
from django.shortcuts import get_object_or_404
from rest_framework import status

import redis
from .serializers import *
import json

User = get_user_model()
redis_client = redis.StrictRedis(
    host="localhost", port=6379, db=0, decode_responses=True
)


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
        bids = Bid.objects.filter(tender=tender).select_related("user")

        users_data = [
            {
                "id": bid.user.id,
                "full_name": f"{bid.user.first_name} {bid.user.last_name}",
                "username": bid.user.username,
                "email": bid.user.email,
                "bid_amount": bid.amount,
            }
            for bid in bids
        ]

        return Response(
            {
                "tender_id": tender.id,
                "title": tender.title,
                "description": tender.description,
                "start_time": tender.start_time,
                "end_time": tender.end_time,
                "created_by": f"{tender.created_by.first_name} {tender.created_by.last_name}",
                "start_bid": tender.start_bid,
                "tender_users": users_data,
            }
        )

    def submit_auction(self, serializer: BidSerializers, request: Request):
        tender: TenderProject = serializer.validated_data.get("tender")
        amount = serializer.validated_data.get("amount")
        _user = User.objects.get(id=request.user.id)
        start_price  = Bid.objects.filter(tender=tender).order_by("-amount").first()
        check_user_bid = Bid.objects.filter(tender=tender, user=_user)
        if (check_user_bid.exists()):
            check_user_bid.update(amount=amount)
            return True, "با موفقیت بروزرسانی شد"
        else:
            if _user.digital_wallet < tender.start_bid:
                return False, "موجودی کیف پول شما کافی نیست."
            if amount > tender.start_bid:
                return False, "مقدار پیشنهادی شما نباید بیشتر از مقدار شروع باشد"




    def submit_bid(self, serializer: BidSerializers, request: Request):
        tender: TenderProject = serializer.validated_data.get("tender")
        amount = serializer.validated_data.get("amount")
        _user = User.objects.get(id=request.user.id)
        highest_price = Bid.objects.filter(tender=tender).order_by("-amount").first()
        check_user_bid = Bid.objects.filter(tender=tender, user=_user).exists()
        print(_user.digital_wallet)

        if check_user_bid:
            return False, "شما قبلا شرکت کرده‌اید"

        if _user.digital_wallet < tender.start_bid:
            return False, "موجودی کافی نیست"

        if amount < tender.start_bid:
            return False, "مقدار پیشنهاد شما کمتر از حداقل مقدار لازم است"

        if highest_price is None:
            return self._save_bid(serializer, _user)

        if amount == highest_price.amount:
            return False, "مزایده شما با آخرین مزایده‌ی ثبت‌شده برابر است"

        if amount > highest_price.amount:
            return self._save_bid(serializer, _user)

        return False, "پیشنهاد شما باید بیشتر از آخرین پیشنهاد باشد"

    def _save_bid(self, serializer, user):
        """ذخیره‌ی پیشنهاد در دیتابیس و ارسال پیام به ردیسی."""
        bid: Bid = serializer.save(user=user)

        bid_data = {
            "bid_id": bid.id,
            "amount": float(bid.amount),
            "user_id": bid.user.id,
            "tender_id": bid.tender.id,
            "tender_title": bid.tender.title,
        }
        message = json.dumps(bid_data)
        redis_client.publish("new_bid", message)

        return True, "با موفقیت ثبت شد"

    def update_bid(self, serializer: BidSerializers, request: Request):
        tender: TenderProject = serializer.validated_data.get("tender")
        amount = serializer.validated_data.get("amount")
        _user = User.objects.get(id=request.user.id)
        if _user.digital_wallet < amount:
            return False, "موجودی کیف پول شما کافی نیست."

        try:
            user_bid = Bid.objects.get(tender=tender, user=_user)
            user_bid.amount = amount
            user_bid.save()
            return True, "با موفقیت بروزرسانی شد"
        except Bid.DoesNotExist:
            return False, "پیشنهاد شما در این مناقصه ثبت نشده است."
    


    def toggle_tender_like_handler(self, user, tender_uuid):
        try:
            tender = TenderProject.objects.get(uuid=tender_uuid)
        except TenderProject.DoesNotExist:
            return Response({"success": False, "message": "Tender not found."}, status=status.HTTP_404_NOT_FOUND)

        like = TenderLikes.objects.filter(user=user, tender=tender).first()

        if like:
            like.delete()
            return Response({
                "liked": False,
            })
        else:
            TenderLikes.objects.create(user=user, tender=tender)
            return Response({
                "liked":True
  
            },status=status.HTTP_201_CREATED)