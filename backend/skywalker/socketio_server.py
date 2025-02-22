import socketio

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=["*"],  # تنظیم CORS
)
online_users = []
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def message(sid, data):
    print(f"Message from {sid}: {data}")
  
    await sio.emit('response', {'message': 'Message received!'}, to=sid)


@sio.event
async def room(sid,data):
    print(f"Message from {sid}: {data}")
    await sio.emit('userMessage',data)

@sio.event
async def send_message(sid, data):
    print(f"Client hello: {data}")
    