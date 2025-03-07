import { Server, Socket } from "socket.io";
import { saveMessage, updateMessageInRoom } from "../controllers/chatController";
import { ChatMessageModel } from "../model/chatModel";
import fs from "fs";
import path from "path";
import { getOpenedChatRoomId } from "../services/chatServices";
import { getUserByUUID } from "../services/usersService";
export const chatSocket = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log("A user connected:", socket.id);
    socket.on("get_room",async (data)=>{
      socket.join(data.debuger)
      const room = await getOpenedChatRoomId(data.debuger);
      console.log(room)
      io.to(data.debuger).emit('room_list',room)
    })
    // کاربر به روم مشخصی متصل می‌شود
    socket.on("join_room", (data: { room_id: string; user_id: string }) => {
      const { room_id, user_id } = data;
      socket.join(room_id);
      console.log(`User ${user_id} joined room ${room_id}`);

      // اطلاع‌رسانی به کاربران دیگر در روم
      socket.to(room_id).emit("user_joined", { user_id });
    });

    // ارسال پیام به روم
    socket.on(
      "send_message",
       async (data: { room_id: string; message: any }) => {
        const { room_id, message } = data;
        console.log(room_id,message)
        const sender:any = await getUserByUUID(message.sender_id)
        const receiver:any = await getUserByUUID(message.receiver_id) 
        // بررسی نوع پیام
        if (message.type === "file" && message.file) {
          try {
            // Decode کردن Base64
            const base64Data = message.file.split(";base64,").pop();
            const fileExtension = message.file.match(/data:(.*?);base64/)?.[1]?.split("/")[1] || "txt"; // استخراج نوع فایل
            const fileName = `${message.fileName}.${fileExtension}`; // ایجاد نام یکتا
            const uploadPath = path.join(__dirname, `../uploads/${message.room_id}`);
    
            // اطمینان از وجود پوشه uploads
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath);
            }
    
            // ذخیره فایل در پوشه
            const filePath = path.join(uploadPath, fileName);
            fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    
            console.log(`File saved at: ${filePath}`);

            // ذخیره پیام در دیتابیس
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
    
    
            // ارسال پیام به کاربران دیگر
            io.to(room_id).emit("receive_message", {
              room_id:room_id,
              sender_id:sender._id,
              receiver_id:receiver._id ,
              message,
              file_url: `/uploads/${fileName}`, // لینک فایل برای کلاینت
              timestamp: new Date().toISOString(),
            });
          } catch (error) {
            console.error("Error saving file:", error);
          }
        } else {
          // اگر پیام فایل نبود، به صورت عادی پردازش کنید
          io.to(room_id).emit("receive_message", {
            room_id:room_id,
            sender_id:sender._id,
            receiver_id:receiver._id ,
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
      }
    );
    
    socket.on('update_message', async (data:{room_id:string,message_id:string,updated_data:any})=>{
        const updated_message = await updateMessageInRoom(data.room_id,data.message_id,data.updated_data)
        socket.emit("update_new_message",updated_message)
    })


    socket.on("test_message",(msg)=>{
      socket.emit("new_test_message",msg)
    })



    // مدیریت قطع ارتباط کاربر
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
