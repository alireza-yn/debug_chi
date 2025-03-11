import express, { Application } from "express";
import connectDB from "./db/mongo";
import http from "http";
import userRoutes from "./routes/users";
import chatRoutes from "./routes/chat";
import cors from "cors";
import { Server } from "socket.io";
import { chatSocket } from "./sockets/chatSocket";
import trendSocket from "./sockets/trendSocket";
import { redisHandler } from "./redis/redis";
import { on } from "stream";
import { Socket } from "dgram";
import { UserSocket } from "./sockets/userSocket";
const app: Application = express();
const PORT: number = 3001;

// اتصال به MongoDB
connectDB();

// میدل‌ورها
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// مسیرها
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:5500"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const online_users: any[] = [];
const online_debuger: any[] = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  io.emit("user", `${socket.id} connected to server`);
  socket.on("message", (msg) => {
    const startTime = Date.now();
    console.log(`Received message: ${msg}`);

    io.emit("server_message", `Response to: ${msg}`);

    const endTime = Date.now();
    console.log(`Processing Time: ${endTime - startTime}ms`);
  });

  socket.on("join", (userId) => {
    if (!socket.rooms.has(userId)) {
      socket.join(userId);
      if (!online_users.includes(userId)) {
        online_users.push(userId);
      }

      console.log(online_users);

      socket.on("notification", (data) => {
        console.log(data);
        io.to(data.uuid).emit("recieve_notification", {
          new_debugg: true,
        });
      });
    }

    socket.on("acceptedSession", (data) => {
      io.to(data.uuid).emit("sessionAccepted", data);
    });

    socket.on("send_message", (message) => {
      io.to(message.id).emit("message", message.text);
    });

    socket.on("receive_message", (message) => {
      console.log(message);
    });
  });

  socket.on("chat message", (msg) => {
    console.log("Message:", msg);
    io.emit("chat message", { message: "hi you" });
  });

  socket.on("online_debugger", (user) => {
    if (online_debuger.length > 0) {
      const dup_user = online_debuger.find((item) => item.uuid == user.uuid);
      if (!dup_user) {
        online_debuger.push(user);
        socket.emit('new_online_debuger',user)
      }
    }else{
      online_debuger.push(user)
    }

    console.log(online_debuger);
  });

  socket.on("get_data", (condition) => {
    if (condition == "online_debuger") {
      socket.emit("recieved_data", online_debuger);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
  
  const new_message =(emit:string,msg:string)=>{
  socket.emit(emit,msg) 
  }
});



chatSocket(io);
trendSocket(io);
UserSocket(io)
redisHandler();

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
