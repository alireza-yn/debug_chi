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
import { executionAsyncId } from "async_hooks";

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
        io.emit(`${msg.session_id}_sent`, msg.session_id);
        checkSentMessage(msg.data.id);
        io.emit(msg.session_id, msg);
      }
    });

    // socket.on("send_audio", async (msg) => {
    //   const base64Data = msg.audio.split(";base64,").pop();
    //   const fileExtension = msg.audio.match(/data:(.*?);base64/)?.[1]?.split("/")[1] || "txt";
    //   const fileName = `${msg.fileName}.${fileExtension}`;
    //   const uploadPath = path.join(__dirname, `../uploads/${msg.sender}_${msg.session_id}`);

    //   if (!fs.existsSync(uploadPath)) {
    //     fs.mkdirSync(uploadPath);
    //   }

    //   const filePath = path.join(uploadPath, fileName);
    //   fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    // });
    socket.on("send_audio", async (payload) => {
      try {
        const { session_id, sender, receiver, data } = payload;
        const { audioUrl: base64Audio } = data;
        console.log(payload)
        // استخراج داده از base64
        const matches = base64Audio.match(/^data:audio\/webm;base64,(.*)$/);
        if (!matches || matches.length !== 2) {
          console.error("Invalid base64 audio data");
          socket.emit("audio_status", "Invalid audio data");
          return;
        }
    
        const base64Data = matches[1];
        const buffer = Buffer.from(base64Data, "base64");
    
        // ساخت مسیر
        const sessionDir = path.join(__dirname, "../uploads", session_id);
        const fileName = `audio_${Date.now()}.webm`;
        const filePath = path.join(sessionDir, fileName);
        const publicAudioUrl = `http://localhost:3001/uploads/${session_id}/${fileName}`;
    
        // ساخت پوشه در صورت عدم وجود
        if (!fs.existsSync(sessionDir)) {
          fs.mkdirSync(sessionDir, { recursive: true });
        }
    
        // ذخیره فایل
        fs.writeFile(filePath, buffer, async (err) => {
          if (err) {
            console.error("Error saving audio file:", err);
            socket.emit("audio_status", "Error saving audio");
          } else {
            console.log("Audio saved at:", filePath);
            socket.emit("audio_status", {
              message: "Audio saved",
              filePath,
              fileName,
            });
    
            // ذخیره پیام در دیتابیس
            const check = await saveTestMessage({
              session_id:session_id,
              sender:sender,
              receiver:receiver,
              data: {
                type: data.type,
                audioUrl: publicAudioUrl, // آدرس قابل استفاده در مرورگر
                created_at: data.created_at,
                status: data.status,
              },
            });
    
            console.log(check);
    
            if (check) {
              io.emit(`${session_id}_sent`, payload.session_id);
              checkSentMessage(session_id);
              io.emit(session_id, payload);
            }
          }
        });
      } catch (error) {
        console.error("Exception while processing audio:", error);
        socket.emit("audio_status", "Server error");
      }
    });


    socket.on("upload-chunk", async (message) => {
      const { chunk, fileName, offset, total,session_id,reciever,sender,data } = message
      const publicImageUrl = `http://localhost:3001/uploads/${session_id}/${fileName}`;
      // Convert base64 chunk to buffer
      const buffer = Buffer.from(chunk, "base64")
  
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, `../uploads/${session_id}`)
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }
  
      // Append chunk to file
      const filePath = path.join(uploadDir, fileName)
      fs.appendFileSync(filePath, buffer)
  
      // Calculate progress
      const currentSize = fs.statSync(filePath).size
      const progress = Math.round((currentSize / total) * 100)
  
      // Emit progress update
      socket.emit("upload-progress", { fileName, progress })
  
      // If upload is complete
      if (progress >= 100) {
        socket.emit("upload-complete", { fileName, path: filePath })
        const check = await saveTestMessage({
          session_id:session_id,
          sender:sender,
          receiver:reciever,
          data:{
            ...data,url:publicImageUrl,filename:fileName
          }
        });

        console.log(check);

        if (check) {
          io.emit(`${session_id}_sent`, data.id);
          checkSentMessage(session_id);
          io.emit(session_id, {
            session_id:session_id,
            sender:sender,
            reciever:reciever,
            data:{
              ...data,url:publicImageUrl,filename:fileName
            }
          });
        }
      }
    })
  


    socket.on("read_message", (data) => {
      io.emit(`${data.session_id}_read`, data.data.id);
    });
    
  
    socket.on("get_messages", async (data) => {
      const messages = await getMessages(data.session_id);
      console.log(messages);
      socket.emit("get_messages", messages);
    });
    

    socket.on("lock_session", (session_id)=>{
      console.log(session_id)

    
      io.emit(`lock_session_${session_id}`,{
        lock:true
      })
    })

    socket.on("close_session",(session_id)=>{
      console.log(session_id)
      
      io.emit(`close_session_${session_id}`,{
        closed:true
      })
    })

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });


    

  });
};
