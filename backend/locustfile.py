import time
import socketio
from locust import User, task, between

# ایجاد یک Client برای اتصال به سرور Socket.IO
sio = socketio.Client()

class SocketIOUser(User):
    wait_time = between(0.1, 1)  # زمان تأخیر بین درخواست‌ها

    def on_start(self):
        # اتصال به سرور Socket.IO هنگام شروع تست
        sio.connect('http://localhost:5000')  # آدرس سرور شما

    @task
    def send_message(self):
        # ارسال پیام به سرور Socket.IO
        sender_uuid = "sender_test_uuid"
        receiver_uuid = "receiver_test_uuid"
        message = "Hello from Locust"

        # ارسال پیام به رویداد "message" سرور
        payload = {
            'sender_uuid': sender_uuid,
            'receiver_uuid': receiver_uuid,
            'message': message
        }

        sio.emit('message', payload)
        print(f"Sent message from {sender_uuid} to {receiver_uuid}")

    def on_stop(self):
        # قطع ارتباط از سرور Socket.IO بعد از پایان تست
        sio.disconnect()
