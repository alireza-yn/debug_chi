import { Request, Response } from "express";
import { ChatRoomModel, ChatMessageModel } from "../model/chatModel";
import { UserModel } from "../model/userModel"; // اگر مدل User دارید
import { randomUUID } from "crypto";
import { getUserByUUID } from "../services/usersService";
import { getChatRoomId, getOpenedChatRoomId } from "../services/chatServices";
// ایجاد چت روم جدید بین دو کاربر
export const createChatRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { debuger, applicator, session_id } = req.body;
  console.log(req.body)
  if (!debuger || !applicator) {
    res.status(400).json({ message: "User IDs are required" });
    return;
  }

  try {
    // بررسی وجود کاربران
    const room_id = session_id;
    const user1 = await getUserByUUID(debuger);
    const user2 = await getUserByUUID(applicator);

    if (!user1 || !user2) {
      res.status(404).json({ message: "User not found" });
    }

    // ایجاد چت روم جدید
    const chatRoom = new ChatRoomModel({
      room_id: room_id,
      debuger: user1,
      applicator: user2,
      open: true,
      messages: [],
    });

    await chatRoom.save();
    res.status(201).json(chatRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ارسال پیام در چت روم
export const saveMessage = async (
  room_id: string,
  senderId: string,
  receiverId: string,
  content: string,
  type: string,
  file: any,
  fileUrl: string,
  language: string
) => {
  console.log(room_id, senderId, receiverId, content, type);

  if (!room_id || !senderId || !receiverId || !content || !type) {
    return { message: "All fields are required" };
  }

  try {
    const chatRoom = await ChatRoomModel.findOne({ room_id });
    if (!chatRoom) {
      return { message: "Chat room not found" };
    }

    const chatMessage = new ChatMessageModel({
      sender: senderId,
      receiver: receiverId,
      content,
      type,
      language,
      file,
      fileUrl,
      timestamp: new Date(),
    });

    chatRoom.messages.push(chatMessage);

    await chatRoom.save();
  } catch (error) {
    return {
      err: error,
    };
  }
};
// دریافت پیام‌های یک چت روم
export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { room_id } = req.params;

  if (!room_id) {
    res.status(400).json({ message: "Room ID is required" });
  }

  try {
    const chatRoom = await ChatRoomModel.findOne({ room_id })
      .populate("messages.sender")
      .populate("messages.receiver");
    if (!chatRoom) {
      res.status(404).json({ message: "Chat room not found" });
    }

    res.status(200).json(chatRoom?.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMessageInRoom = async (
    room_id: string,
    message_id: string,
    data: any
  ) => {
    try {
      // آپدیت پیام درون آرایه messages
      const updatedRoom = await ChatRoomModel.findOneAndUpdate(
        {
          room_id: room_id, // پیدا کردن اتاق چت بر اساس room_id
          "messages._id": message_id, // پیدا کردن پیام بر اساس message_id
        },
        {
          $set: {
            "messages.$.content": data.content, // فقط فیلد content را آپدیت کنید
            "messages.$.received": data.received, // فقط فیلد content را آپدیت کنید
            "messages.$.read_reciept": data.read_reciept, // فقط فیلد content را آپدیت کنید
            "messages.$.fileUrl": data.fileUrl, // اگر fileUrl هم نیاز به آپدیت دارد
          },
        },
        { new: true } // بازگرداندن سند آپدیت شده
      );
  
      if (!updatedRoom) {
        return {
          success: false,
          message: "اتاق چت یا پیام مورد نظر یافت نشد.",
        };
      }
  
      return {
        success: true,
        data: updatedRoom,
      };
    } catch (error) {
      return {
        success: false,
        message: "خطا در آپدیت پیام",
        error: error,
      };
    }
  };

export const getChatRoomById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user1Id, user2Id } = req.body;
  console.log(user1Id);
  try {
    const chatRooms = await getChatRoomId(user1Id, user2Id);
    if (!chatRooms) {
      res.status(200).json({
        message: "No chat room found",
        success: false,
      });
    }
    res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const saveMessage = async (data: any) => {
//     // const chat = new Chat(data);
//     // return await chat.save();
//   };

export const getChatHistory = async () => {
  // return await Chat.find().sort({ timestamp: 1 });
};

export const getDebuggerChatList = async (req: Request, res: Response) => {
  const { debuger } = req.body;

  if (!debuger) {
    res.status(400).json({ debuger: "debuger ID is required" });
  }
  try {
    const chatRooms = await getOpenedChatRoomId(debuger);
    res.status(200).json(chatRooms);
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




