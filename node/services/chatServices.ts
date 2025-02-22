import { randomUUID } from "crypto";
import { ChatRoomModel } from "../model/chatModel";
import { UserModel } from "../model/userModel";

const getChatRoomId = async (user1: string, user2: string) => {
  try {
    const chatRoom = await ChatRoomModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }, 
      ],
    });

    if (chatRoom) {
      return { room_id: chatRoom.room_id };
    } else {
      
      
      return { room_id: "room not found" };
    }
  } catch (error) {
    console.error("Error in getChatRoomId:", error);
    return false;
  }
};


const getOpenedChatRoomId = async (debuger: string) => {
  try {
    // ابتدا تلاش می‌کنیم که کاربری با uuid مربوطه پیدا کنیم
    let user = await UserModel.findOne({ uuid: debuger });

    if (!user) {
      console.error("User not found");
      return false; // اگر کاربر پیدا نشد، false برمی‌گردانیم
    }

    // اگر کاربر پیدا شد، اتاق‌های چت مربوط به آن کاربر را جستجو می‌کنیم
    const room_list = await ChatRoomModel.find({$or: [{ debuger: user._id, open: true }, { applicator: user._id, open: true }]})
      .populate("debuger", "first_name last_name uuid image_profile") // بارگذاری اطلاعات debuger
      .populate("applicator", "first_name last_name uuid image_profile"); // بارگذاری اطلاعات applicator
      
    return room_list;

  } catch (error) {
    console.error("Error in getChatRoomId:", error);
    return false;
  }
};




export { getChatRoomId ,getOpenedChatRoomId};

