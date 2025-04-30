import mongoose from "mongoose";
import saveAudioFile from "../utils";

// تعریف تایپ برای داده‌ها (در صورت تمایل به استفاده از تایپ‌های دقیق‌تر)
interface Message {
  type: "file" | "text" | "audio" | "picture";
  text?: string;
  url?: string;
  time?: string;
  status?: "sent" | "pending" | "recieved";
  reply?: boolean;
  uuid?: string;
  file?: File;
}

export const saveTestMessage = async (data: any): Promise<any> => {
  try {
    // بررسی اتصال به دیتابیس قبل از استفاده
    if (mongoose.connection && mongoose.connection.db) {
      const collection = mongoose.connection.db.collection('test_messages'); // ایجاد یا استفاده از کالکشن messages
      await collection.insertOne(data);
      return true
    } else {
      console.error('MongoDB connection is not established');
    }
  } catch (error) {
    return false
  }
};

export const checkSentMessage = async (msg_id:string)=>{
  try {
    if (mongoose.connection && mongoose.connection.db) {
      const collection = mongoose.connection.db.collection('test_messages');
      const result = await collection.updateOne(
        { 'data.id': msg_id }, // پیدا کردن سند بر اساس id
        { $set: { 'data.status': 'sent' } } // آپدیت فقط فیلد status در data
      );

      if (result.modifiedCount > 0) {
        console.log('Message status updated to sent');
      } else {
        console.log('No message found or no change made');
      }
    }
  } catch (error) {
    console.error('Error updating message:', error);
  }
}

export const getMessages = async (session_id: string): Promise<any> => {
  try {
    if (mongoose.connection && mongoose.connection.db) {
      const collection = mongoose.connection.db.collection('test_messages');

      const messages = await collection.find({
        session_id: session_id,
      }).toArray();
      console.log(messages)

      return messages;
    } else {
      console.error('MongoDB connection is not established');
      return [];
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
    return false;
  }
};
