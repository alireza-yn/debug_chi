# """
# ASGI config for skywalker project.

# It exposes the ASGI callable as a module-level variable named ``application``.

# For more information on this file, see
# https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
# """

# import os

# from django.core.asgi import get_asgi_application

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skywalker.settings')

# application = get_asgi_application()
# asgi.py

from channels.routing import ProtocolTypeRouter
from channels.sessions import SessionMiddlewareStack
from django.core.asgi import get_asgi_application
import socketio
import os
from .socketio_server import sio

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skywalker.settings")

# ایجاد سرور Socket.IO


# ایجاد اپلیکیشن ASGI برای Socket.IO
socket_app = socketio.ASGIApp(sio,socketio_path="socket.io")

# ترکیب با اپلیکیشن‌های دیگر
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # مدیریت درخواست‌های HTTP
    "websocket": SessionMiddlewareStack(socket_app),  # مدیریت WebSocket برای Socket.IO
})

from chat.consumers import *
