from asgiref.sync import sync_to_async
from skywalker.socketio_server import sio
from auths.serializers_services import UserSerializer, CustomUser
# دیکشنری برای نگهداری کاربران آنلاین با UUID
import asyncio
import time
online_users = {}

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    # حذف کاربر از دیکشنری آنلاین‌ها هنگام قطع ارتباط
    uuid_to_remove = None
    for uuid, user_sid in online_users.items():
        if user_sid == sid:
            uuid_to_remove = uuid
            break
    if uuid_to_remove:
        del online_users[uuid_to_remove]
        print(f"User with UUID {uuid_to_remove} disconnected.")
    print(f"Current online users: {online_users}")

@sio.event
async def join(sid, data):
    uuid = data.get("uuid")
    if uuid and uuid not in online_users:
        online_users[uuid] = sid
        print(f"User with UUID {uuid} joined with SID {sid}")
        print(f"Current online users: {online_users}")

@sio.event
async def leave(sid, data):
    uuid = data.get("uuid")
    if uuid in online_users:
        del online_users[uuid]
        print(f"User with UUID {uuid} left.")
    print(f"Current online users: {online_users}")

@sio.event
async def message(sid, data):
    sender_uuid = data.get("sender_uuid")
    receiver_uuid = data.get("receiver_uuid")
    message = data.get("message")
    reciver_info = await sync_to_async(CustomUser.objects.filter(uuid=receiver_uuid).first)()
    # reciver_info = CustomUser.objects.filter(uuid=receiver_uuid).afirst()
    # if reciver_info is not None:
    #     print(reciver_info)
    reciver_serializer = UserSerializer(reciver_info).data
    print(f"Message from {sender_uuid} to {receiver_uuid}: {message}" )

    if receiver_uuid in online_users:
        target_sid = online_users[receiver_uuid]
        await sio.emit('response', {'message': message, 'sender_uuid': sender_uuid, 'receiver_info': reciver_serializer}, to=target_sid)
    else:
        print(f"User with UUID {receiver_uuid} is not online.")


    # می‌توانید عملکردهای دیگر را نیز به همین صورت اضافه کنید
