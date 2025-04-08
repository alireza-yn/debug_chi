import { Server, Socket } from "socket.io";
import { saveMessage, updateMessageInRoom } from "../controllers/chatController";
import { ChatMessageModel } from "../model/chatModel";
import fs from "fs";
import path from "path";
import { getOpenedChatRoomId } from "../services/chatServices";
import { getUserByUUID } from "../services/usersService";
import { checkSentMessage, getMessages, saveTestMessage } from "../controllers/testChatController";
import saveAudioFile from "../utils";
import saveBase64Audio from "../test";

export const chatSocket = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);

    socket.on("get_room", async (data) => {
      socket.join(data.debuger);
      const room = await getOpenedChatRoomId(data.debuger);
      console.log(room);
      io.to(data.debuger).emit("room_list", room);
    });

    socket.on("join_room", (data: { room_id: string; user_id: string }) => {
      const { room_id, user_id } = data;
      socket.join(room_id);
      console.log(`User ${user_id} joined room ${room_id}`);
      socket.to(room_id).emit("user_joined", { user_id });
    });

    socket.on("send_message", async (data: { room_id: string; message: any }) => {
      const { room_id, message } = data;
      console.log(room_id, message);
      const sender: any = await getUserByUUID(message.sender_id);
      const receiver: any = await getUserByUUID(message.receiver_id);
      if (message.type === "file" && message.file) {
        try {
          const base64Data = message.file.split(";base64,").pop();
          const fileExtension = message.file.match(/data:(.*?);base64/)?.[1]?.split("/")[1] || "txt";
          const fileName = `${message.fileName}.${fileExtension}`;
          const uploadPath = path.join(__dirname, `../uploads/${message.room_id}`);
    
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
          }
    
          const filePath = path.join(uploadPath, fileName);
          fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    
          console.log(`File saved at: ${filePath}`);
          saveMessage(
            room_id,
            sender,
            receiver,
            message.content,
            message.type,
            filePath,
            filePath,
            message.language
          );
    
          io.to(room_id).emit("receive_message", {
            room_id: room_id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            message,
            file_url: `/uploads/${fileName}`,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Error saving file:", error);
        }
      } else {
        io.to(room_id).emit("receive_message", {
          room_id: room_id,
          sender_id: sender._id,
          receiver_id: receiver._id,
          message,
          timestamp: new Date().toISOString(),
        });
        saveMessage(
          room_id,
          sender,
          receiver,
          message.content,
          message.type,
          "",
          "",
          message.language
        );
      }
    });
    
    socket.on("update_message", async (data: { room_id: string; message_id: string; updated_data: any }) => {
      const updated_message = await updateMessageInRoom(data.room_id, data.message_id, data.updated_data);
      socket.emit("update_new_message", updated_message);
    });

    socket.on("test_message", async (msg) => {
      const check = await saveTestMessage(msg);
      console.log(check);
    
      if (check) {
        io.emit(`${msg.sender}_sent`, msg.id);
        checkSentMessage(msg.id)
        io.emit(msg.receiver, msg);
      }
    });

    socket.on("send_audio", async (msg) => {
      console.log("Received audio message:", msg);
      // استخراج اطلاعات از msg.data طبق ساختار جدید
      const { audio, sender, receiver, id } = msg.data;
  
      // تبدیل داده base64 به Buffer
      const audioBuffer = Buffer.from(audio, "base64");
  
      // ذخیره فایل صوتی
      const filePath = `./audioFiles/${id}.wav`;
      fs.writeFile(filePath, audioBuffer, (err) => {
        if (err) {
          console.error("Error saving audio file:", err);
          return;
        }
        console.log("Audio file saved:", filePath);
      });
  
      // ارسال تایید به کلاینت‌ها
      io.emit(`${sender}_sent`, id);
      io.emit(receiver, msg);
    });
  
    socket.on("read_message", (data) => {
      io.emit(`${data.sender}_${data.reciever}_read`, data);
    });
  
    socket.on("get_messages", async (data) => {
      const messages = await getMessages(data.session_id);
      console.log(messages);
      socket.emit("get_messages", messages);
    });
  
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
