import express, { Application } from 'express';
import connectDB from './db/mongo';
import http from "http";
import userRoutes from './routes/users';
import chatRoutes from './routes/chat';
import cors from "cors";
import { Server } from 'socket.io';
import { chatSocket } from './sockets/chatSocket';
import trendSocket from './sockets/trendSocket';

const app: Application = express();
const PORT: number = 3000;

// اتصال به MongoDB
connectDB();

// میدل‌ورها
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// مسیرها
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  
  }
});

const online_users: any[] = [];

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (userId) => {

    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      if (!online_users.includes(userId)) {
        online_users.push(userId);
      }

      console.log(online_users);

      socket.on('notification', (data) => {
        console.log(data)
        io.to(data.uuid).emit('recieve_notification', {
          new_debugg: true
        });
      })
    }

    socket.on('acceptedSession',(data)=>{
      io.to(data.uuid).emit('sessionAccepted',data);
    })

    socket.on('send_message', (message) => {
      io.to(message.id).emit('message', message.text);
    });

    socket.on('receive_message', (message) => {
      console.log(message);
    });
  });
  

  
  socket.on('chat message', (msg) => {
    console.log('Message:', msg);
    io.emit('chat message', { message: "hi you" });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});
chatSocket(io);
trendSocket(io);
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
